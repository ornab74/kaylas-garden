from __future__ import annotations

"""
Kayla's Garden local-first runtime.

This file replaces the old medical template with a plant-focused reference
implementation that matches the README's "new generation" direction:

- PlantSyncID identities with signed manifests
- LeafVault encrypted buckets with IPFS-aware object storage
- GeoPetal coarse location proofs
- BloomTrace Hive checkpoint payloads
- RootMesh sync queue generation
- PhytoScan edge analysis with LiteRT-LM hooks

The file is intentionally self-contained so it can be used as a prototype
runtime, CLI tool, or architecture reference without Azure dependencies.
"""

import argparse
import errno
import hashlib
import hmac
import json
import os
import signal
import shutil
import struct
import subprocess
import threading
import time
import uuid
from contextlib import contextmanager
from dataclasses import asdict, dataclass, field
from datetime import UTC, date, datetime
from pathlib import Path
from threading import RLock
from typing import Any, Callable, Dict, Iterable, List, Mapping, Optional, Tuple, Union

import tkinter as tk
from tkinter import filedialog, messagebox

try:
    from cryptography.hazmat.primitives.ciphers.aead import AESGCM
    from cryptography.hazmat.primitives.kdf.scrypt import Scrypt
except Exception as exc:
    AESGCM = None
    Scrypt = None
    CRYPTO_IMPORT_ERROR = exc
else:
    CRYPTO_IMPORT_ERROR = None

try:
    import httpx
except Exception as exc:
    httpx = None
    HTTPX_IMPORT_ERROR = exc
else:
    HTTPX_IMPORT_ERROR = None

try:
    import customtkinter as ctk
except Exception as exc:
    ctk = None
    CUSTOMTKINTER_IMPORT_ERROR = exc
else:
    CUSTOMTKINTER_IMPORT_ERROR = None

try:
    import litert_lm as litert_lm_module
except Exception as exc:
    litert_lm = None
    LITERT_IMPORT_ERROR = exc
else:
    litert_lm = litert_lm_module
    LITERT_IMPORT_ERROR = None

try:
    import oqs  # type: ignore
except Exception as exc:
    oqs = None
    OQS_IMPORT_ERROR = exc
else:
    OQS_IMPORT_ERROR = None


REPO_ROOT = Path(__file__).resolve().parent
MODEL_REPO = "https://huggingface.co/litert-community/gemma-4-E2B-it-litert-lm/resolve/main/"
MODEL_FILE = "gemma-4-E2B-it.litertlm"
EXPECTED_HASH = "ab7838cdfc8f77e54d8ca45eadceb20452d9f01e4bfade03e5dce27911b27e42"
NETWORK_TIMEOUT = httpx.Timeout(connect=15.0, read=120.0, write=120.0, pool=15.0) if httpx is not None else None
ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
MAX_IMAGE_BYTES = 20 * 1024 * 1024
INFERENCE_BACKEND_OPTIONS = ("Auto", "CPU", "GPU")
FILE_ENCRYPTION_MAGIC = b"KGGFILE1"
FILE_ENCRYPTION_CHUNK_SIZE = 4 * 1024 * 1024
INSECURE_PLAINTEXT_MAGIC = b"KGGPLAIN1"
KEY_WRAP_MAGIC = b"KGGKEY01"
KEY_WRAP_SALT_LEN = 16
KEY_WRAP_NONCE_LEN = 12
DEFAULT_IPFS_API = os.environ.get("KAYLAS_GARDEN_IPFS_API", "http://127.0.0.1:5001/api/v0")
DEFAULT_HIVE_API = os.environ.get("KAYLAS_GARDEN_HIVE_API", "https://api.hive.blog")
DEFAULT_TRUSTED_NODES = ("local-ipfs", "home-greenhouse", "community-relay-east")
DEFAULT_IPFS_REPO_SUBDIR = "ipfs-repo"
DEFAULT_IPFS_DAEMON_LOG = "ipfs-daemon.log"
DEFAULT_IPFS_MANAGED_BINARY_SUBDIR = "ipfs"
OQS_LIB_REPO = "https://github.com/open-quantum-safe/liboqs"
OQS_PYTHON_REPO = "https://github.com/open-quantum-safe/liboqs-python"
OQS_PYTHON_VCS = f"git+{OQS_PYTHON_REPO}.git"
OQS_BUILD_SCRIPT = "scripts/build_oqs.sh"
KUBO_INSTALL_SCRIPT = "scripts/install_kubo.sh"
NETWORK_MODE_OPTIONS = ("local-first", "cloud")
CURATED_OQS_KEMS = (
    "ML-KEM-512",
    "ML-KEM-768",
    "ML-KEM-1024",
    "FrodoKEM-640-SHAKE",
    "sntrup761",
)
CURATED_OQS_SIGNATURES = (
    "ML-DSA-44",
    "ML-DSA-65",
    "ML-DSA-87",
    "SLH-DSA-SHA2-128f",
    "SLH-DSA-SHAKE-128f",
)
OQS_PIP_REQUIREMENTS = (
    "pip",
    "setuptools",
    "wheel",
    "cmake",
    "ninja",
    "cffi",
    "pycparser",
    "nose2",
    OQS_PYTHON_VCS,
)
APP_PATHS: Optional["GardenPaths"] = None
CONTROL_CHARS = dict.fromkeys(range(0, 32))


@dataclass
class ModelSpec:
    key: str
    title: str
    family: str
    repo: str
    filename: str
    expected_sha256: str = ""
    supports_vision: bool = False
    purpose: str = ""


MODEL_CATALOG: Dict[str, ModelSpec] = {
    "garden_caretaker_llm": ModelSpec(
        key="garden_caretaker_llm",
        title="Garden Caretaker LLM",
        family="LiteRT-LM",
        repo=MODEL_REPO,
        filename=MODEL_FILE,
        expected_sha256=EXPECTED_HASH,
        supports_vision=True,
        purpose="Care advice, note summarization, and observation narratives.",
    ),
    "phytoscan_edge_vision": ModelSpec(
        key="phytoscan_edge_vision",
        title="PhytoScan Edge Vision",
        family="Local vision pipeline",
        repo="local://phytoscan-edge",
        filename="phytoscan-edge.tflite",
        supports_vision=True,
        purpose="Species hints, health detection, and change-over-time scoring.",
    ),
    "seasongraph_reasoner": ModelSpec(
        key="seasongraph_reasoner",
        title="SeasonGraph Reasoner",
        family="Rules + LiteRT-LM",
        repo="local://seasongraph",
        filename="seasongraph.json",
        purpose="Frost, seasonal timing, and intervention context.",
    ),
}


@dataclass
class SecurityProfile:
    key_exchange: str = "ML-KEM-768"
    signatures: str = "ML-DSA-65"
    symmetric: str = "AES-256-GCM"
    proof_scheme: str = "GeoPetal-v1"
    manifest_signing: str = "HMAC-SHA256 fallback"
    pq_ready: bool = False


@dataclass
class GardenPaths:
    root: Path
    models_dir: Path
    cache_dir: Path
    temp_dir: Path
    tools_dir: Path
    key_path: Path
    vault_path: Path
    secret_settings_path: Path
    settings_path: Path
    leafvault_dir: Path
    anchors_dir: Path
    sync_dir: Path
    reports_dir: Path
    ipfs_repo_dir: Path
    ipfs_daemon_pid_path: Path
    ipfs_daemon_log_path: Path
    ipfs_managed_dir: Path
    plain_model_path: Path
    encrypted_model_path: Path


@dataclass
class SyncIdentity:
    sync_id: str
    created_at: str
    display_name: str
    fingerprint: str
    device_label: str
    security: SecurityProfile
    public_key_hint: str = ""


@dataclass
class GeoPetalProof:
    region_hash: str
    coarse_label: str
    precision_meters: int
    latitude_blur: float
    longitude_blur: float


@dataclass
class HealthAssessment:
    vigor_score: float
    stress_risk: float
    pest_risk: float
    disease_risk: float
    confidence: float
    status: str
    summary: str


@dataclass
class ObservationAsset:
    asset_id: str
    asset_type: str
    cid: Optional[str]
    digest: str
    media_type: str
    local_path: str
    size_bytes: int
    encrypted: bool = True
    mfs_path: Optional[str] = None


@dataclass
class ObservationRecord:
    observation_id: str
    recorded_at: str
    observer_sync_id: str
    plant_id: str
    privacy_class: str
    note: str
    species_guess: str
    care_summary: str
    geoproof: Optional[GeoPetalProof]
    health: HealthAssessment
    metadata_cid: Optional[str]
    tags: List[str] = field(default_factory=list)
    assets: List[ObservationAsset] = field(default_factory=list)


@dataclass
class PlantPassport:
    plant_id: str
    name: str
    species: str
    date_added: str
    hardiness_zone: str
    privacy_class: str
    notes: str
    source: str = "kaylas-garden"
    profile_summary: str = ""
    sunlight: str = ""
    watering: str = ""
    soil: str = ""
    tags: List[str] = field(default_factory=list)
    primary_geoproof: Optional[GeoPetalProof] = None
    observations: List[ObservationRecord] = field(default_factory=list)


@dataclass
class PlantDiagnosis:
    diagnosis_id: str
    plant_id: str
    recorded_at: str
    observer_sync_id: str
    symptom_summary: str
    urgency: str
    confidence: float
    likely_causes: List[str]
    care_actions: List[str]
    prevention_tips: List[str]
    narrative: str
    tags: List[str] = field(default_factory=list)
    geoproof: Optional[GeoPetalProof] = None
    metadata_cid: Optional[str] = None
    checkpoint_id: Optional[str] = None


@dataclass
class HealthCheckin:
    checkin_id: str
    plant_id: str
    recorded_at: str
    observer_sync_id: str
    overall_status: str
    confidence: float
    note: str
    vigor_score: float
    hydration_score: float
    pest_pressure: float
    disease_pressure: float
    action_items: List[str]
    narrative: str
    tags: List[str] = field(default_factory=list)
    metadata_cid: Optional[str] = None
    checkpoint_id: Optional[str] = None


@dataclass
class SharedTechnique:
    technique_id: str
    plant_id: str
    created_at: str
    author_sync_id: str
    title: str
    plant_scope: str
    problem_focus: str
    summary: str
    steps: List[str]
    tags: List[str]
    privacy_class: str
    metadata_cid: Optional[str] = None
    checkpoint_id: Optional[str] = None
    sync_job_id: Optional[str] = None


@dataclass
class PlantUserPeer:
    peer_id: str
    created_at: str
    display_name: str
    hive_username: str
    ipfs_user_id: str
    pin_group: str
    notes: str
    status: str = "active"


@dataclass
class PeerPinGroup:
    group_id: str
    created_at: str
    name: str
    description: str
    privacy_class: str
    owner_sync_id: str
    tags: List[str] = field(default_factory=list)
    member_peer_ids: List[str] = field(default_factory=list)
    metadata_cid: Optional[str] = None
    checkpoint_id: Optional[str] = None


@dataclass
class PinGroupComment:
    comment_id: str
    group_id: str
    created_at: str
    author_sync_id: str
    author_label: str
    body: str
    plant_id: str = ""
    target_cids: List[str] = field(default_factory=list)
    metadata_cid: Optional[str] = None
    checkpoint_id: Optional[str] = None
    sync_job_id: Optional[str] = None


@dataclass
class PeerPinRequest:
    request_id: str
    group_id: str
    created_at: str
    requester_sync_id: str
    requester_label: str
    cid: str
    target_peer_ids: List[str]
    note: str
    local_pin_status: str
    metadata_cid: Optional[str] = None
    checkpoint_id: Optional[str] = None
    sync_job_id: Optional[str] = None


@dataclass
class LeafVaultManifest:
    plant_id: str
    bucket: str
    cids: List[str]
    manifest_hash: str
    signed_at: str
    signature: str


@dataclass
class HiveCheckpoint:
    checkpoint_id: str
    plant_id: str
    manifest_hash: str
    timestamp: str
    region_hash: str
    observation_cid: Optional[str]
    network: str = "hive"
    broadcast_status: str = "queued-local"
    tx_id: Optional[str] = None


@dataclass
class SyncJob:
    job_id: str
    plant_id: str
    created_at: str
    cids: List[str]
    targets: List[str]
    status: str
    mode: str = "local-first"


DEFAULT_SETTINGS = {
    "garden_name": "Kayla's Garden",
    "theme": "green",
    "location": "",
    "frost_dates": {},
    "privacy_default": "private",
    "network_mode": "local-first",
    "local_first_only": True,
    "cloud_mode": False,
    "inference_backend": "Auto",
    "auto_selected_inference_backend": "",
    "enable_native_image_input": True,
    "ipfs_enabled": False,
    "ipfs_api": DEFAULT_IPFS_API,
    "ipfs_bearer_token": "",
    "ipfs_mfs_root": "/kaylas-garden",
    "ipfs_pin_on_add": True,
    "ipfs_daemon_enabled": False,
    "ipfs_daemon_auto_install": False,
    "ipfs_daemon_auto_start": False,
    "ipfs_daemon_binary": "",
    "ipfs_daemon_repo": "",
    "ipfs_kubo_version": "",
    "ipfs_kubo_download_url": "",
    "hive_enabled": False,
    "hive_api": DEFAULT_HIVE_API,
    "hive_account": "",
    "hive_broadcast_enabled": False,
    "trusted_nodes": list(DEFAULT_TRUSTED_NODES),
    "bootstrap_complete": False,
}
SECRET_NETWORK_KEYS = (
    "ipfs_user_id",
    "ipfs_pin_surface",
    "ipfs_pin_surface_token",
    "ipfs_bearer_token",
    "hive_username",
    "hive_posting_key",
    "hive_active_key",
)
PLAINTEXT_SECRET_SETTING_KEYS = (
    "ipfs_bearer_token",
    "hive_account",
)


def now_iso() -> str:
    return datetime.now(tz=UTC).replace(microsecond=0).isoformat()


def sanitize_text(value: Any, *, max_chars: int = 4000) -> str:
    text = str(value or "").translate(CONTROL_CHARS).strip()
    if len(text) > max_chars:
        return text[:max_chars].rstrip()
    return text


def normalize_setting_choice(value: Any, options: Tuple[str, ...], default: str) -> str:
    text = sanitize_text(value, max_chars=32)
    if not text:
        return default
    for option in options:
        if text.lower() == option.lower():
            return option
    return default


def normalize_privacy_class(value: Any) -> str:
    clean = sanitize_text(value, max_chars=32).lower()
    if clean in {"private", "shared", "public"}:
        return clean
    return "private"


def normalize_network_mode(value: Any) -> str:
    clean = sanitize_text(value, max_chars=32).lower()
    if clean in NETWORK_MODE_OPTIONS:
        return clean
    return "local-first"


def cloud_mode_enabled(settings: Mapping[str, Any]) -> bool:
    return normalize_network_mode(settings.get("network_mode")) == "cloud" and bool(settings.get("cloud_mode"))


def ipfs_network_enabled(settings: Mapping[str, Any]) -> bool:
    return cloud_mode_enabled(settings) and bool(settings.get("ipfs_enabled"))


def hive_network_enabled(settings: Mapping[str, Any]) -> bool:
    return cloud_mode_enabled(settings) and bool(settings.get("hive_enabled"))


def httpx_available() -> bool:
    return httpx is not None


def process_is_running(pid: Optional[int]) -> bool:
    if pid is None or pid <= 0:
        return False
    try:
        os.kill(pid, 0)
    except OSError:
        return False
    return True


def human_size(value: int) -> str:
    units = ["B", "KB", "MB", "GB", "TB"]
    size = float(max(0, int(value)))
    unit = units[0]
    for unit in units:
        if size < 1024.0 or unit == units[-1]:
            break
        size /= 1024.0
    return f"{int(size)}B" if unit == "B" else f"{size:.1f}{unit}"


def mask_secret(value: Any, *, prefix: int = 2, suffix: int = 2) -> str:
    text = sanitize_text(value, max_chars=400)
    if not text:
        return ""
    if len(text) <= prefix + suffix:
        return "*" * len(text)
    return f"{text[:prefix]}{'*' * max(4, len(text) - prefix - suffix)}{text[-suffix:]}"


def _set_owner_only_permissions(path: Path, *, is_dir: bool = False) -> None:
    try:
        os.chmod(path, 0o700 if is_dir else 0o600)
    except Exception:
        pass


def safe_cleanup(paths: Iterable[Path]) -> None:
    for path in paths:
        try:
            if path.is_dir():
                shutil.rmtree(path, ignore_errors=True)
            elif path.exists():
                path.unlink()
        except Exception:
            pass


def _atomic_write_bytes(path: Path, data: bytes) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(path.suffix + f".tmp.{os.getpid()}.{threading.get_ident()}.{uuid.uuid4().hex}")
    try:
        tmp.write_bytes(data)
        tmp.replace(path)
        _set_owner_only_permissions(path)
    except OSError as exc:
        safe_cleanup([tmp])
        if exc.errno == errno.ENOSPC:
            raise RuntimeError(f"No space left on device near {path.parent}.") from exc
        raise
    except Exception:
        safe_cleanup([tmp])
        raise


def _atomic_write_via_handle(path: Path, writer: Callable[[Any], None]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(path.suffix + f".tmp.{os.getpid()}.{threading.get_ident()}.{uuid.uuid4().hex}")
    try:
        with tmp.open("wb") as handle:
            writer(handle)
        tmp.replace(path)
        _set_owner_only_permissions(path)
    finally:
        safe_cleanup([tmp])


def canonical_json(data: Any) -> bytes:
    return json.dumps(data, sort_keys=True, separators=(",", ":"), ensure_ascii=True).encode("utf-8")


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def sha256_text(value: str) -> str:
    return sha256_bytes(value.encode("utf-8"))


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def crypto_available() -> bool:
    return AESGCM is not None and Scrypt is not None


def aes_encrypt(data: bytes, key: bytes) -> bytes:
    if not crypto_available():
        return INSECURE_PLAINTEXT_MAGIC + data
    nonce = os.urandom(12)
    return nonce + AESGCM(key).encrypt(nonce, data, None)


def aes_decrypt(data: bytes, key: bytes) -> bytes:
    if data.startswith(INSECURE_PLAINTEXT_MAGIC):
        return data[len(INSECURE_PLAINTEXT_MAGIC) :]
    if not crypto_available():
        raise RuntimeError(f"cryptography is required for secure vault operations. Import error: {CRYPTO_IMPORT_ERROR}")
    if len(data) < 13:
        raise ValueError("Encrypted payload is too short.")
    nonce, payload = data[:12], data[12:]
    return AESGCM(key).decrypt(nonce, payload, None)


def derive_password_key(password: str, salt: bytes) -> bytes:
    if Scrypt is None:
        raise RuntimeError(f"cryptography is required for password-protected keys. Import error: {CRYPTO_IMPORT_ERROR}")
    return Scrypt(salt=salt, length=32, n=2**14, r=8, p=1).derive(password.encode("utf-8"))


def is_protected_key_blob(data: bytes) -> bool:
    return data.startswith(KEY_WRAP_MAGIC) and len(data) > len(KEY_WRAP_MAGIC) + KEY_WRAP_SALT_LEN + KEY_WRAP_NONCE_LEN


def protect_raw_key(raw_key: bytes, password: str) -> bytes:
    if AESGCM is None:
        raise RuntimeError(f"cryptography is required for password protection. Import error: {CRYPTO_IMPORT_ERROR}")
    clean_password = sanitize_text(password, max_chars=256)
    if len(clean_password) < 6:
        raise ValueError("Password must be at least 6 characters.")
    if len(raw_key) != 32:
        raise ValueError("Vault key must be 32 bytes.")
    salt = os.urandom(KEY_WRAP_SALT_LEN)
    nonce = os.urandom(KEY_WRAP_NONCE_LEN)
    wrap_key = derive_password_key(clean_password, salt)
    payload = AESGCM(wrap_key).encrypt(nonce, raw_key, KEY_WRAP_MAGIC)
    return KEY_WRAP_MAGIC + salt + nonce + payload


def unlock_protected_key(blob: bytes, password: str) -> bytes:
    if AESGCM is None:
        raise RuntimeError(f"cryptography is required for password protection. Import error: {CRYPTO_IMPORT_ERROR}")
    if not is_protected_key_blob(blob):
        raise ValueError("Key file is not password protected.")
    clean_password = sanitize_text(password, max_chars=256)
    if not clean_password:
        raise ValueError("Password is required.")
    offset = len(KEY_WRAP_MAGIC)
    salt = blob[offset : offset + KEY_WRAP_SALT_LEN]
    nonce_start = offset + KEY_WRAP_SALT_LEN
    nonce_end = nonce_start + KEY_WRAP_NONCE_LEN
    nonce = blob[nonce_start:nonce_end]
    payload = blob[nonce_end:]
    raw_key = AESGCM(derive_password_key(clean_password, salt)).decrypt(nonce, payload, KEY_WRAP_MAGIC)
    if len(raw_key) != 32:
        raise ValueError("Unlocked key length is invalid.")
    return raw_key


def encrypt_file(src: Path, dest: Path, key: bytes) -> None:
    if not crypto_available():
        _atomic_write_bytes(dest, INSECURE_PLAINTEXT_MAGIC + src.read_bytes())
        return
    aes = AESGCM(key)

    def writer(handle: Any) -> None:
        handle.write(FILE_ENCRYPTION_MAGIC)
        handle.write(struct.pack(">I", FILE_ENCRYPTION_CHUNK_SIZE))
        with src.open("rb") as source:
            while True:
                chunk = source.read(FILE_ENCRYPTION_CHUNK_SIZE)
                if not chunk:
                    break
                nonce = os.urandom(12)
                payload = aes.encrypt(nonce, chunk, None)
                handle.write(struct.pack(">I", len(payload)))
                handle.write(nonce)
                handle.write(payload)

    _atomic_write_via_handle(dest, writer)


def decrypt_file(src: Path, dest: Path, key: bytes) -> None:
    if not crypto_available():
        raw = src.read_bytes()
        if raw.startswith(INSECURE_PLAINTEXT_MAGIC):
            _atomic_write_bytes(dest, raw[len(INSECURE_PLAINTEXT_MAGIC) :])
        else:
            _atomic_write_bytes(dest, raw)
        return
    header_length = len(FILE_ENCRYPTION_MAGIC)
    with src.open("rb") as handle:
        header = handle.read(header_length)
        if header == FILE_ENCRYPTION_MAGIC:
            chunk_size_raw = handle.read(4)
            if len(chunk_size_raw) != 4:
                raise ValueError("Encrypted file header is truncated.")
            chunk_size = struct.unpack(">I", chunk_size_raw)[0]
            if chunk_size <= 0 or chunk_size > 64 * 1024 * 1024:
                raise ValueError("Encrypted file chunk size is invalid.")
            aes = AESGCM(key)

            def writer(out_handle: Any) -> None:
                while True:
                    payload_len_raw = handle.read(4)
                    if not payload_len_raw:
                        return
                    if len(payload_len_raw) != 4:
                        raise ValueError("Encrypted file payload length is truncated.")
                    payload_len = struct.unpack(">I", payload_len_raw)[0]
                    nonce = handle.read(12)
                    payload = handle.read(payload_len)
                    if len(nonce) != 12 or len(payload) != payload_len:
                        raise ValueError("Encrypted file payload is truncated.")
                    out_handle.write(aes.decrypt(nonce, payload, None))

            _atomic_write_via_handle(dest, writer)
            return

    _atomic_write_bytes(dest, aes_decrypt(src.read_bytes(), key))


def load_json_file(path: Path, default: Any) -> Any:
    if not path.exists():
        return default
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return default


def bucket_name_for_privacy(privacy_class: str) -> str:
    if privacy_class == "public":
        return "community/trees"
    if privacy_class == "shared":
        return "caretaking/heritage-trees"
    return "private/garden"


def set_app_paths(root: Union[str, Path]) -> GardenPaths:
    global APP_PATHS
    base = Path(root).expanduser()
    paths = GardenPaths(
        root=base,
        models_dir=base / "models",
        cache_dir=base / ".litert_cache",
        temp_dir=base / ".tmp",
        tools_dir=base / "tools",
        key_path=base / ".enc_key",
        vault_path=base / "garden_vault.json.aes",
        secret_settings_path=base / "network_secrets.json.aes",
        settings_path=base / "settings.json",
        leafvault_dir=base / "leafvault",
        anchors_dir=base / "anchors",
        sync_dir=base / "sync",
        reports_dir=base / "reports",
        ipfs_repo_dir=base / DEFAULT_IPFS_REPO_SUBDIR,
        ipfs_daemon_pid_path=base / "ipfs-daemon.pid",
        ipfs_daemon_log_path=base / "reports" / DEFAULT_IPFS_DAEMON_LOG,
        ipfs_managed_dir=base / "tools" / DEFAULT_IPFS_MANAGED_BINARY_SUBDIR,
        plain_model_path=base / "models" / MODEL_FILE,
        encrypted_model_path=base / "models" / f"{MODEL_FILE}.aes",
    )
    for directory in (
        paths.root,
        paths.models_dir,
        paths.cache_dir,
        paths.temp_dir,
        paths.tools_dir,
        paths.leafvault_dir,
        paths.anchors_dir,
        paths.sync_dir,
        paths.reports_dir,
        paths.ipfs_repo_dir,
        paths.ipfs_managed_dir,
    ):
        directory.mkdir(parents=True, exist_ok=True)
        _set_owner_only_permissions(directory, is_dir=True)
    APP_PATHS = paths
    return paths


def default_storage_root() -> Path:
    return REPO_ROOT / ".kaylas-garden-runtime"


def require_paths() -> GardenPaths:
    if APP_PATHS is None:
        return set_app_paths(default_storage_root())
    return APP_PATHS


def _tmp_path(prefix: str, suffix: str) -> Path:
    return require_paths().temp_dir / f"{prefix}.{os.getpid()}.{threading.get_ident()}.{uuid.uuid4().hex}{suffix}"


def load_settings(paths: Optional[GardenPaths] = None) -> Dict[str, Any]:
    current_paths = paths or require_paths()
    target = current_paths.settings_path
    raw = load_json_file(target, {})
    settings = dict(DEFAULT_SETTINGS)
    settings.update(raw if isinstance(raw, dict) else {})
    settings["network_mode"] = normalize_network_mode(settings.get("network_mode"))
    settings["local_first_only"] = bool(settings.get("local_first_only", True))
    settings["cloud_mode"] = bool(settings.get("cloud_mode", False))
    if settings["local_first_only"]:
        settings["network_mode"] = "local-first"
        settings["cloud_mode"] = False
    settings["inference_backend"] = normalize_setting_choice(settings.get("inference_backend"), INFERENCE_BACKEND_OPTIONS, "Auto")
    settings["auto_selected_inference_backend"] = normalize_setting_choice(
        settings.get("auto_selected_inference_backend"),
        ("", "CPU", "GPU"),
        "",
    )
    settings["privacy_default"] = normalize_privacy_class(settings.get("privacy_default"))
    settings["enable_native_image_input"] = bool(settings.get("enable_native_image_input", True))
    settings["ipfs_enabled"] = bool(settings.get("ipfs_enabled", False))
    settings["ipfs_api"] = sanitize_text(settings.get("ipfs_api") or DEFAULT_IPFS_API, max_chars=240)
    settings["ipfs_bearer_token"] = sanitize_text(settings.get("ipfs_bearer_token"), max_chars=400)
    settings["ipfs_mfs_root"] = sanitize_text(settings.get("ipfs_mfs_root") or "/kaylas-garden", max_chars=240) or "/kaylas-garden"
    settings["ipfs_pin_on_add"] = bool(settings.get("ipfs_pin_on_add", True))
    settings["ipfs_daemon_enabled"] = bool(settings.get("ipfs_daemon_enabled", False))
    settings["ipfs_daemon_auto_install"] = bool(settings.get("ipfs_daemon_auto_install", False))
    settings["ipfs_daemon_auto_start"] = bool(settings.get("ipfs_daemon_auto_start", False))
    settings["ipfs_daemon_binary"] = sanitize_text(settings.get("ipfs_daemon_binary"), max_chars=400)
    settings["ipfs_daemon_repo"] = sanitize_text(settings.get("ipfs_daemon_repo") or str(current_paths.ipfs_repo_dir), max_chars=400)
    settings["ipfs_kubo_version"] = sanitize_text(settings.get("ipfs_kubo_version"), max_chars=80)
    settings["ipfs_kubo_download_url"] = sanitize_text(settings.get("ipfs_kubo_download_url"), max_chars=400)
    settings["hive_enabled"] = bool(settings.get("hive_enabled", False))
    settings["hive_api"] = sanitize_text(settings.get("hive_api") or DEFAULT_HIVE_API, max_chars=240)
    settings["hive_account"] = sanitize_text(settings.get("hive_account"), max_chars=80)
    settings["hive_broadcast_enabled"] = bool(settings.get("hive_broadcast_enabled", False))
    settings["trusted_nodes"] = list(settings.get("trusted_nodes") or DEFAULT_TRUSTED_NODES)
    return settings


def save_settings(settings: Dict[str, Any], paths: Optional[GardenPaths] = None) -> None:
    merged = load_settings(paths)
    merged.update(settings)
    for key in PLAINTEXT_SECRET_SETTING_KEYS:
        merged[key] = ""
    _atomic_write_bytes((paths or require_paths()).settings_path, json.dumps(merged, indent=2).encode("utf-8"))


def validate_image_path(image_path: Union[str, Path]) -> Path:
    raw_path = Path(image_path).expanduser()
    if raw_path.is_symlink():
        raise ValueError("Symlinked images are not allowed.")
    path = raw_path.resolve(strict=True)
    if not path.is_file():
        raise ValueError("Image path is not a regular file.")
    if path.suffix.lower() not in ALLOWED_IMAGE_EXTENSIONS:
        raise ValueError(f"Unsupported image extension: {path.suffix.lower()}.")
    size = path.stat().st_size
    if size <= 0:
        raise ValueError("Image is empty.")
    if size > MAX_IMAGE_BYTES:
        raise ValueError(f"Image exceeds limit of {human_size(MAX_IMAGE_BYTES)}.")
    return path


class EncryptedGardenVault:
    def __init__(self, paths: Optional[GardenPaths] = None):
        self.paths = paths or require_paths()
        self.lock = RLock()
        self._cached_key: Optional[bytes] = None

    def get_or_create_key(self, password: Optional[str] = None) -> bytes:
        with self.lock:
            if self._cached_key is not None:
                return self._cached_key
            if self.paths.key_path.exists():
                blob = self.paths.key_path.read_bytes()
                self._cached_key = unlock_protected_key(blob, password) if is_protected_key_blob(blob) else blob
                return self._cached_key
            raw_key = os.urandom(32)
            blob = protect_raw_key(raw_key, password) if password else raw_key
            _atomic_write_bytes(self.paths.key_path, blob)
            self._cached_key = raw_key
            return raw_key

    def default_state(self) -> Dict[str, Any]:
        return {
            "version": "kaylas-garden-runtime-v1",
            "created_at": now_iso(),
            "garden": {
                "name": "Kayla's Garden",
                "theme": "green",
                "location": "",
                "frost_dates": {},
                "repo_bootstrap_at": "",
            },
            "security": asdict(
                SecurityProfile(
                    pq_ready=bool(oqs),
                    manifest_signing="ML-DSA-65" if oqs else "HMAC-SHA256 fallback",
                )
            ),
            "sync_identity": None,
            "plants": {},
            "manifests": {},
            "diagnoses": [],
            "health_checkins": [],
            "shared_techniques": [],
            "peer_users": [],
            "pin_groups": [],
            "pin_group_comments": [],
            "peer_pin_requests": [],
            "anchor_queue": [],
            "sync_queue": [],
            "reputation": {},
            "runtime_notes": {},
        }

    def load(self, password: Optional[str] = None) -> Dict[str, Any]:
        with self.lock:
            if not self.paths.vault_path.exists():
                return self.default_state()
            payload = aes_decrypt(self.paths.vault_path.read_bytes(), self.get_or_create_key(password=password))
            try:
                raw = json.loads(payload.decode("utf-8"))
            except Exception:
                return self.default_state()
            base = self.default_state()
            if isinstance(raw, dict):
                base.update({key: raw.get(key, value) for key, value in base.items()})
                if isinstance(raw.get("garden"), dict):
                    base["garden"].update(raw["garden"])
            return base

    def save(self, state: Dict[str, Any], password: Optional[str] = None) -> None:
        with self.lock:
            payload = json.dumps(state, indent=2).encode("utf-8")
            encrypted = aes_encrypt(payload, self.get_or_create_key(password=password))
            _atomic_write_bytes(self.paths.vault_path, encrypted)


class SecretSettingsVault:
    def __init__(self, key_provider: Callable[[], bytes], paths: Optional[GardenPaths] = None):
        self.key_provider = key_provider
        self.paths = paths or require_paths()
        self.lock = RLock()

    def default_secrets(self) -> Dict[str, str]:
        return {key: "" for key in SECRET_NETWORK_KEYS}

    def load(self) -> Dict[str, str]:
        with self.lock:
            if not self.paths.secret_settings_path.exists():
                return self.default_secrets()
            try:
                payload = aes_decrypt(self.paths.secret_settings_path.read_bytes(), self.key_provider())
                raw = json.loads(payload.decode("utf-8"))
            except Exception:
                return self.default_secrets()
            secrets = self.default_secrets()
            if isinstance(raw, dict):
                for key in SECRET_NETWORK_KEYS:
                    secrets[key] = sanitize_text(raw.get(key), max_chars=400 if "key" not in key else 800)
            return secrets

    def save(self, secrets: Mapping[str, Any]) -> Dict[str, str]:
        with self.lock:
            current = self.default_secrets()
            current.update(self.load())
            for key in SECRET_NETWORK_KEYS:
                if key in secrets:
                    current[key] = sanitize_text(secrets.get(key), max_chars=400 if "key" not in key else 800)
            encrypted = aes_encrypt(json.dumps(current, indent=2).encode("utf-8"), self.key_provider())
            _atomic_write_bytes(self.paths.secret_settings_path, encrypted)
            return current

    def status(self) -> Dict[str, Any]:
        secrets = self.load()
        return {
            "vault_path": str(self.paths.secret_settings_path),
            "stored_fields": {key: bool(secrets.get(key)) for key in SECRET_NETWORK_KEYS},
            "masked": {
                "ipfs_user_id": mask_secret(secrets.get("ipfs_user_id")),
                "ipfs_pin_surface": sanitize_text(secrets.get("ipfs_pin_surface"), max_chars=120),
                "hive_username": sanitize_text(secrets.get("hive_username"), max_chars=80),
                "hive_posting_key": mask_secret(secrets.get("hive_posting_key")),
            },
        }


def security_profile_from_dict(raw: Mapping[str, Any]) -> SecurityProfile:
    return SecurityProfile(
        key_exchange=sanitize_text(raw.get("key_exchange") or "ML-KEM-768", max_chars=64),
        signatures=sanitize_text(raw.get("signatures") or "ML-DSA-65", max_chars=64),
        symmetric=sanitize_text(raw.get("symmetric") or "AES-256-GCM", max_chars=64),
        proof_scheme=sanitize_text(raw.get("proof_scheme") or "GeoPetal-v1", max_chars=64),
        manifest_signing=sanitize_text(raw.get("manifest_signing") or "HMAC-SHA256 fallback", max_chars=64),
        pq_ready=bool(raw.get("pq_ready")),
    )


def sync_identity_from_dict(raw: Mapping[str, Any]) -> SyncIdentity:
    return SyncIdentity(
        sync_id=sanitize_text(raw.get("sync_id"), max_chars=64),
        created_at=sanitize_text(raw.get("created_at"), max_chars=64),
        display_name=sanitize_text(raw.get("display_name"), max_chars=120),
        fingerprint=sanitize_text(raw.get("fingerprint"), max_chars=128),
        device_label=sanitize_text(raw.get("device_label"), max_chars=120),
        security=security_profile_from_dict(raw.get("security") or {}),
        public_key_hint=sanitize_text(raw.get("public_key_hint"), max_chars=256),
    )


def geoproof_from_dict(raw: Optional[Mapping[str, Any]]) -> Optional[GeoPetalProof]:
    if not raw:
        return None
    return GeoPetalProof(
        region_hash=sanitize_text(raw.get("region_hash"), max_chars=128),
        coarse_label=sanitize_text(raw.get("coarse_label"), max_chars=64),
        precision_meters=int(raw.get("precision_meters") or 0),
        latitude_blur=float(raw.get("latitude_blur") or 0.0),
        longitude_blur=float(raw.get("longitude_blur") or 0.0),
    )


def health_from_dict(raw: Mapping[str, Any]) -> HealthAssessment:
    return HealthAssessment(
        vigor_score=float(raw.get("vigor_score") or 0.0),
        stress_risk=float(raw.get("stress_risk") or 0.0),
        pest_risk=float(raw.get("pest_risk") or 0.0),
        disease_risk=float(raw.get("disease_risk") or 0.0),
        confidence=float(raw.get("confidence") or 0.0),
        status=sanitize_text(raw.get("status"), max_chars=80),
        summary=sanitize_text(raw.get("summary"), max_chars=600),
    )


def asset_from_dict(raw: Mapping[str, Any]) -> ObservationAsset:
    return ObservationAsset(
        asset_id=sanitize_text(raw.get("asset_id"), max_chars=64),
        asset_type=sanitize_text(raw.get("asset_type"), max_chars=32),
        cid=sanitize_text(raw.get("cid"), max_chars=160) or None,
        digest=sanitize_text(raw.get("digest"), max_chars=128),
        media_type=sanitize_text(raw.get("media_type"), max_chars=80),
        local_path=sanitize_text(raw.get("local_path"), max_chars=400),
        size_bytes=int(raw.get("size_bytes") or 0),
        encrypted=bool(raw.get("encrypted", True)),
        mfs_path=sanitize_text(raw.get("mfs_path"), max_chars=320) or None,
    )


def observation_from_dict(raw: Mapping[str, Any]) -> ObservationRecord:
    return ObservationRecord(
        observation_id=sanitize_text(raw.get("observation_id"), max_chars=64),
        recorded_at=sanitize_text(raw.get("recorded_at"), max_chars=64),
        observer_sync_id=sanitize_text(raw.get("observer_sync_id"), max_chars=64),
        plant_id=sanitize_text(raw.get("plant_id"), max_chars=64),
        privacy_class=normalize_privacy_class(raw.get("privacy_class")),
        note=sanitize_text(raw.get("note"), max_chars=2000),
        species_guess=sanitize_text(raw.get("species_guess"), max_chars=160),
        care_summary=sanitize_text(raw.get("care_summary"), max_chars=1200),
        geoproof=geoproof_from_dict(raw.get("geoproof")),
        health=health_from_dict(raw.get("health") or {}),
        metadata_cid=sanitize_text(raw.get("metadata_cid"), max_chars=160) or None,
        tags=[sanitize_text(item, max_chars=40) for item in list(raw.get("tags") or []) if sanitize_text(item, max_chars=40)],
        assets=[asset_from_dict(item) for item in list(raw.get("assets") or []) if isinstance(item, dict)],
    )


def passport_from_dict(raw: Mapping[str, Any]) -> PlantPassport:
    return PlantPassport(
        plant_id=sanitize_text(raw.get("plant_id"), max_chars=64),
        name=sanitize_text(raw.get("name"), max_chars=120),
        species=sanitize_text(raw.get("species"), max_chars=160),
        date_added=sanitize_text(raw.get("date_added"), max_chars=64),
        hardiness_zone=sanitize_text(raw.get("hardiness_zone"), max_chars=64),
        privacy_class=normalize_privacy_class(raw.get("privacy_class")),
        notes=sanitize_text(raw.get("notes"), max_chars=4000),
        source=sanitize_text(raw.get("source") or "kaylas-garden", max_chars=120),
        profile_summary=sanitize_text(raw.get("profile_summary"), max_chars=1600),
        sunlight=sanitize_text(raw.get("sunlight"), max_chars=200),
        watering=sanitize_text(raw.get("watering"), max_chars=200),
        soil=sanitize_text(raw.get("soil"), max_chars=200),
        tags=[sanitize_text(item, max_chars=40) for item in list(raw.get("tags") or []) if sanitize_text(item, max_chars=40)],
        primary_geoproof=geoproof_from_dict(raw.get("primary_geoproof")),
        observations=[observation_from_dict(item) for item in list(raw.get("observations") or []) if isinstance(item, dict)],
    )


def diagnosis_from_dict(raw: Mapping[str, Any]) -> PlantDiagnosis:
    return PlantDiagnosis(
        diagnosis_id=sanitize_text(raw.get("diagnosis_id"), max_chars=64),
        plant_id=sanitize_text(raw.get("plant_id"), max_chars=64),
        recorded_at=sanitize_text(raw.get("recorded_at"), max_chars=64),
        observer_sync_id=sanitize_text(raw.get("observer_sync_id"), max_chars=64),
        symptom_summary=sanitize_text(raw.get("symptom_summary"), max_chars=2000),
        urgency=sanitize_text(raw.get("urgency") or "watch", max_chars=40),
        confidence=float(raw.get("confidence") or 0.0),
        likely_causes=[sanitize_text(item, max_chars=160) for item in list(raw.get("likely_causes") or []) if sanitize_text(item, max_chars=160)],
        care_actions=[sanitize_text(item, max_chars=200) for item in list(raw.get("care_actions") or []) if sanitize_text(item, max_chars=200)],
        prevention_tips=[sanitize_text(item, max_chars=200) for item in list(raw.get("prevention_tips") or []) if sanitize_text(item, max_chars=200)],
        narrative=sanitize_text(raw.get("narrative"), max_chars=4000),
        tags=[sanitize_text(item, max_chars=40) for item in list(raw.get("tags") or []) if sanitize_text(item, max_chars=40)],
        geoproof=geoproof_from_dict(raw.get("geoproof")),
        metadata_cid=sanitize_text(raw.get("metadata_cid"), max_chars=160) or None,
        checkpoint_id=sanitize_text(raw.get("checkpoint_id"), max_chars=80) or None,
    )


def health_checkin_from_dict(raw: Mapping[str, Any]) -> HealthCheckin:
    return HealthCheckin(
        checkin_id=sanitize_text(raw.get("checkin_id"), max_chars=64),
        plant_id=sanitize_text(raw.get("plant_id"), max_chars=64),
        recorded_at=sanitize_text(raw.get("recorded_at"), max_chars=64),
        observer_sync_id=sanitize_text(raw.get("observer_sync_id"), max_chars=64),
        overall_status=sanitize_text(raw.get("overall_status") or "watch", max_chars=40),
        confidence=float(raw.get("confidence") or 0.0),
        note=sanitize_text(raw.get("note"), max_chars=2000),
        vigor_score=float(raw.get("vigor_score") or 0.0),
        hydration_score=float(raw.get("hydration_score") or 0.0),
        pest_pressure=float(raw.get("pest_pressure") or 0.0),
        disease_pressure=float(raw.get("disease_pressure") or 0.0),
        action_items=[sanitize_text(item, max_chars=200) for item in list(raw.get("action_items") or []) if sanitize_text(item, max_chars=200)],
        narrative=sanitize_text(raw.get("narrative"), max_chars=4000),
        tags=[sanitize_text(item, max_chars=40) for item in list(raw.get("tags") or []) if sanitize_text(item, max_chars=40)],
        metadata_cid=sanitize_text(raw.get("metadata_cid"), max_chars=160) or None,
        checkpoint_id=sanitize_text(raw.get("checkpoint_id"), max_chars=80) or None,
    )


def shared_technique_from_dict(raw: Mapping[str, Any]) -> SharedTechnique:
    return SharedTechnique(
        technique_id=sanitize_text(raw.get("technique_id"), max_chars=64),
        plant_id=sanitize_text(raw.get("plant_id"), max_chars=64),
        created_at=sanitize_text(raw.get("created_at"), max_chars=64),
        author_sync_id=sanitize_text(raw.get("author_sync_id"), max_chars=64),
        title=sanitize_text(raw.get("title"), max_chars=160),
        plant_scope=sanitize_text(raw.get("plant_scope"), max_chars=160),
        problem_focus=sanitize_text(raw.get("problem_focus"), max_chars=200),
        summary=sanitize_text(raw.get("summary"), max_chars=2000),
        steps=[sanitize_text(item, max_chars=240) for item in list(raw.get("steps") or []) if sanitize_text(item, max_chars=240)],
        tags=[sanitize_text(item, max_chars=40) for item in list(raw.get("tags") or []) if sanitize_text(item, max_chars=40)],
        privacy_class=normalize_privacy_class(raw.get("privacy_class")),
        metadata_cid=sanitize_text(raw.get("metadata_cid"), max_chars=160) or None,
        checkpoint_id=sanitize_text(raw.get("checkpoint_id"), max_chars=80) or None,
        sync_job_id=sanitize_text(raw.get("sync_job_id"), max_chars=80) or None,
    )


def peer_user_from_dict(raw: Mapping[str, Any]) -> PlantUserPeer:
    return PlantUserPeer(
        peer_id=sanitize_text(raw.get("peer_id"), max_chars=64),
        created_at=sanitize_text(raw.get("created_at"), max_chars=64),
        display_name=sanitize_text(raw.get("display_name"), max_chars=160),
        hive_username=sanitize_text(raw.get("hive_username"), max_chars=80),
        ipfs_user_id=sanitize_text(raw.get("ipfs_user_id"), max_chars=160),
        pin_group=sanitize_text(raw.get("pin_group"), max_chars=160),
        notes=sanitize_text(raw.get("notes"), max_chars=1200),
        status=sanitize_text(raw.get("status") or "active", max_chars=40),
    )


def pin_group_from_dict(raw: Mapping[str, Any]) -> PeerPinGroup:
    return PeerPinGroup(
        group_id=sanitize_text(raw.get("group_id"), max_chars=64),
        created_at=sanitize_text(raw.get("created_at"), max_chars=64),
        name=sanitize_text(raw.get("name"), max_chars=160),
        description=sanitize_text(raw.get("description"), max_chars=2000),
        privacy_class=normalize_privacy_class(raw.get("privacy_class")),
        owner_sync_id=sanitize_text(raw.get("owner_sync_id"), max_chars=64),
        tags=[sanitize_text(item, max_chars=40) for item in list(raw.get("tags") or []) if sanitize_text(item, max_chars=40)],
        member_peer_ids=[sanitize_text(item, max_chars=64) for item in list(raw.get("member_peer_ids") or []) if sanitize_text(item, max_chars=64)],
        metadata_cid=sanitize_text(raw.get("metadata_cid"), max_chars=160) or None,
        checkpoint_id=sanitize_text(raw.get("checkpoint_id"), max_chars=80) or None,
    )


def pin_group_comment_from_dict(raw: Mapping[str, Any]) -> PinGroupComment:
    return PinGroupComment(
        comment_id=sanitize_text(raw.get("comment_id"), max_chars=64),
        group_id=sanitize_text(raw.get("group_id"), max_chars=64),
        created_at=sanitize_text(raw.get("created_at"), max_chars=64),
        author_sync_id=sanitize_text(raw.get("author_sync_id"), max_chars=64),
        author_label=sanitize_text(raw.get("author_label"), max_chars=160),
        body=sanitize_text(raw.get("body"), max_chars=4000),
        plant_id=sanitize_text(raw.get("plant_id"), max_chars=64),
        target_cids=[sanitize_text(item, max_chars=160) for item in list(raw.get("target_cids") or []) if sanitize_text(item, max_chars=160)],
        metadata_cid=sanitize_text(raw.get("metadata_cid"), max_chars=160) or None,
        checkpoint_id=sanitize_text(raw.get("checkpoint_id"), max_chars=80) or None,
        sync_job_id=sanitize_text(raw.get("sync_job_id"), max_chars=80) or None,
    )


def peer_pin_request_from_dict(raw: Mapping[str, Any]) -> PeerPinRequest:
    return PeerPinRequest(
        request_id=sanitize_text(raw.get("request_id"), max_chars=64),
        group_id=sanitize_text(raw.get("group_id"), max_chars=64),
        created_at=sanitize_text(raw.get("created_at"), max_chars=64),
        requester_sync_id=sanitize_text(raw.get("requester_sync_id"), max_chars=64),
        requester_label=sanitize_text(raw.get("requester_label"), max_chars=160),
        cid=sanitize_text(raw.get("cid"), max_chars=160),
        target_peer_ids=[sanitize_text(item, max_chars=64) for item in list(raw.get("target_peer_ids") or []) if sanitize_text(item, max_chars=64)],
        note=sanitize_text(raw.get("note"), max_chars=2000),
        local_pin_status=sanitize_text(raw.get("local_pin_status") or "queued-local", max_chars=80),
        metadata_cid=sanitize_text(raw.get("metadata_cid"), max_chars=160) or None,
        checkpoint_id=sanitize_text(raw.get("checkpoint_id"), max_chars=80) or None,
        sync_job_id=sanitize_text(raw.get("sync_job_id"), max_chars=80) or None,
    )


def manifest_from_dict(raw: Mapping[str, Any]) -> LeafVaultManifest:
    return LeafVaultManifest(
        plant_id=sanitize_text(raw.get("plant_id"), max_chars=64),
        bucket=sanitize_text(raw.get("bucket"), max_chars=120),
        cids=[sanitize_text(item, max_chars=160) for item in list(raw.get("cids") or []) if sanitize_text(item, max_chars=160)],
        manifest_hash=sanitize_text(raw.get("manifest_hash"), max_chars=128),
        signed_at=sanitize_text(raw.get("signed_at"), max_chars=64),
        signature=sanitize_text(raw.get("signature"), max_chars=256),
    )


def checkpoint_from_dict(raw: Mapping[str, Any]) -> HiveCheckpoint:
    return HiveCheckpoint(
        checkpoint_id=sanitize_text(raw.get("checkpoint_id"), max_chars=64),
        plant_id=sanitize_text(raw.get("plant_id"), max_chars=64),
        manifest_hash=sanitize_text(raw.get("manifest_hash"), max_chars=128),
        timestamp=sanitize_text(raw.get("timestamp"), max_chars=64),
        region_hash=sanitize_text(raw.get("region_hash"), max_chars=128),
        observation_cid=sanitize_text(raw.get("observation_cid"), max_chars=160) or None,
        network=sanitize_text(raw.get("network") or "hive", max_chars=32),
        broadcast_status=sanitize_text(raw.get("broadcast_status") or "queued-local", max_chars=32),
        tx_id=sanitize_text(raw.get("tx_id"), max_chars=128) or None,
    )


def sync_job_from_dict(raw: Mapping[str, Any]) -> SyncJob:
    return SyncJob(
        job_id=sanitize_text(raw.get("job_id"), max_chars=64),
        plant_id=sanitize_text(raw.get("plant_id"), max_chars=64),
        created_at=sanitize_text(raw.get("created_at"), max_chars=64),
        cids=[sanitize_text(item, max_chars=160) for item in list(raw.get("cids") or []) if sanitize_text(item, max_chars=160)],
        targets=[sanitize_text(item, max_chars=120) for item in list(raw.get("targets") or []) if sanitize_text(item, max_chars=120)],
        status=sanitize_text(raw.get("status") or "queued", max_chars=32),
        mode=normalize_network_mode(raw.get("mode")),
    )


def parse_month_day(raw: str, year: Optional[int] = None) -> Optional[date]:
    clean = sanitize_text(raw, max_chars=64)
    if not clean:
        return None
    target_year = year or datetime.now(tz=UTC).year
    for fmt in ("%B %d", "%b %d"):
        try:
            parsed = datetime.strptime(clean, fmt)
        except ValueError:
            continue
        return date(target_year, parsed.month, parsed.day)
    return None


def require_litert_lm() -> None:
    if litert_lm is None:
        detail = f" Import error: {LITERT_IMPORT_ERROR}" if LITERT_IMPORT_ERROR else ""
        raise RuntimeError("LiteRT-LM is not installed." + detail)


def _litert_backend_attr(*names: str) -> Any:
    require_litert_lm()
    for name in names:
        try:
            return getattr(litert_lm.Backend, name)
        except Exception:
            continue
    return None


def _litert_cpu_backend() -> Any:
    backend = _litert_backend_attr("CPU")
    if backend is None:
        raise RuntimeError("This LiteRT-LM build does not expose a CPU backend.")
    return backend


def _litert_gpu_backend() -> Any:
    backend = _litert_backend_attr("GPU", "WEBGPU", "WEB_GPU", "GPU_WEBGPU")
    if backend is None:
        available = ", ".join(name for name in dir(litert_lm.Backend) if not name.startswith("_"))
        raise RuntimeError(f"GPU backend not available in LiteRT-LM. Available: {available or 'unknown'}")
    return backend


def gpu_inference_looks_available() -> bool:
    if os.environ.get("KAYLAS_GARDEN_DISABLE_GPU_AUTO") == "1":
        return False
    if os.environ.get("KAYLAS_GARDEN_FORCE_GPU_AUTO") == "1":
        return True
    if os.path.exists("/dev/dri"):
        return any(Path("/dev/dri").glob("renderD*"))
    return any(Path(path).exists() for path in ("/dev/nvidia0", "/dev/nvidiactl"))


def response_to_text(response: Any) -> str:
    if not isinstance(response, dict):
        return sanitize_text(response, max_chars=4000)
    texts: List[str] = []
    for item in list(response.get("content") or []):
        if isinstance(item, dict) and item.get("type") == "text":
            texts.append(str(item.get("text") or ""))
    return sanitize_text("".join(texts), max_chars=4000)


def create_default_messages(system_text: Optional[str] = None) -> List[dict]:
    if not system_text:
        return []
    return [{"role": "system", "content": [{"type": "text", "text": system_text}]}]


def create_user_message(user_text: str, image_path: Optional[str] = None) -> Any:
    clean_text = sanitize_text(user_text, max_chars=9000)
    if not image_path:
        return clean_text
    safe_image_path = validate_image_path(image_path)
    return {
        "role": "user",
        "content": [
            {"type": "text", "text": clean_text},
            {"type": "image", "path": str(safe_image_path)},
        ],
    }


class LiteRTModelManager:
    def __init__(self, vault: EncryptedGardenVault, paths: Optional[GardenPaths] = None):
        self.paths = paths or require_paths()
        self.vault = vault

    def configured_model_supports_native_image_input(self) -> bool:
        lowered = MODEL_FILE.lower()
        return any(marker in lowered for marker in ("gemma-4", "gemma-3n", "multimodal", "vision"))

    def resolve_inference_backend_name(self) -> Tuple[str, bool]:
        settings = load_settings(self.paths)
        selected = normalize_setting_choice(settings.get("inference_backend"), INFERENCE_BACKEND_OPTIONS, "Auto")
        if selected != "Auto":
            return selected, False
        saved = normalize_setting_choice(settings.get("auto_selected_inference_backend"), ("", "CPU", "GPU"), "")
        if saved:
            return saved, True
        auto_selected = "GPU" if _litert_backend_attr("GPU", "WEBGPU", "WEB_GPU", "GPU_WEBGPU") and gpu_inference_looks_available() else "CPU"
        save_settings({"auto_selected_inference_backend": auto_selected}, self.paths)
        return auto_selected, True

    def backend_value_for_name(self, backend_name: str) -> Any:
        if backend_name == "GPU":
            return _litert_gpu_backend()
        return _litert_cpu_backend()

    def load_engine(self, model_path: Path, cache_dir: Path, *, enable_vision: bool = False):
        require_litert_lm()
        try:
            litert_lm.set_min_log_severity(litert_lm.LogSeverity.ERROR)
        except Exception:
            pass
        backend_name, auto_selected = self.resolve_inference_backend_name()
        try:
            backend_value = self.backend_value_for_name(backend_name)
        except RuntimeError:
            if auto_selected and backend_name == "GPU":
                save_settings({"auto_selected_inference_backend": "CPU"}, self.paths)
                backend_name = "CPU"
                backend_value = _litert_cpu_backend()
            else:
                raise
        kwargs = {"backend": backend_value, "cache_dir": str(cache_dir)}
        if enable_vision:
            kwargs["vision_backend"] = backend_value
        try:
            return litert_lm.Engine(str(model_path), **kwargs)
        except TypeError as exc:
            if enable_vision:
                raise RuntimeError("This LiteRT-LM build rejected native vision input.") from exc
            raise
        except Exception:
            if auto_selected and backend_name == "GPU":
                save_settings({"auto_selected_inference_backend": "CPU"}, self.paths)
                cpu_backend = _litert_cpu_backend()
                kwargs["backend"] = cpu_backend
                if enable_vision:
                    kwargs["vision_backend"] = cpu_backend
                return litert_lm.Engine(str(model_path), **kwargs)
            raise

    @contextmanager
    def temporary_cache(self):
        cache_path = self.paths.cache_dir / f"worker_{os.getpid()}_{time.time_ns()}"
        cache_path.mkdir(parents=True, exist_ok=False)
        try:
            yield cache_path
        finally:
            shutil.rmtree(cache_path, ignore_errors=True)

    @contextmanager
    def unlocked_model_path(self, password: Optional[str] = None):
        key = self.vault.get_or_create_key(password=password)
        if self.paths.encrypted_model_path.exists():
            temp_model = _tmp_path("garden_model", ".litertlm")
            decrypt_file(self.paths.encrypted_model_path, temp_model, key)
            try:
                yield temp_model
            finally:
                safe_cleanup([temp_model])
            return
        if self.paths.plain_model_path.exists():
            yield self.paths.plain_model_path
            return
        raise FileNotFoundError("The local Gemma LiteRT-LM model has not been downloaded yet.")

    def model_status(self) -> Dict[str, Any]:
        installed = self.paths.plain_model_path.exists() or self.paths.encrypted_model_path.exists()
        return {
            "installed": installed,
            "litert_installed": litert_lm is not None,
            "crypto_available": crypto_available(),
            "httpx_available": httpx_available(),
            "oqs_available": oqs is not None,
            "model_file": str(self.paths.encrypted_model_path if self.paths.encrypted_model_path.exists() else self.paths.plain_model_path),
            "catalog": {key: asdict(value) for key, value in MODEL_CATALOG.items()},
        }

    def download_primary_model(self, password: Optional[str] = None, reporter: Optional[Callable[[str, Any], None]] = None) -> str:
        key = self.vault.get_or_create_key(password=password)
        plain_temp = _tmp_path("garden_download", ".litertlm")
        encrypted_temp = _tmp_path("garden_sealed", ".litertlm.aes")
        try:
            if reporter:
                reporter("status", "Downloading Gemma LiteRT-LM model.")

            def on_progress(done: int, total: int) -> None:
                if reporter:
                    reporter("progress", (done / total) if total else 0.0)
                    reporter("status", f"Downloading model... {human_size(done)} of {human_size(total) if total else 'unknown'}")

            sha = self.download_model_httpx(MODEL_REPO + MODEL_FILE, plain_temp, EXPECTED_HASH, on_progress)
            encrypt_file(plain_temp, encrypted_temp, key)
            encrypted_temp.replace(self.paths.encrypted_model_path)
            _set_owner_only_permissions(self.paths.encrypted_model_path)
            safe_cleanup([self.paths.plain_model_path])
            if reporter:
                reporter("progress", 1.0)
                reporter("status", "Model downloaded and sealed.")
            return sha
        finally:
            safe_cleanup([plain_temp, encrypted_temp])

    def download_model_httpx(
        self,
        url: str,
        dest: Path,
        expected_sha: Optional[str] = None,
        progress_callback: Optional[Callable[[int, int], None]] = None,
    ) -> str:
        if httpx is None:
            raise RuntimeError(f"httpx is required for model downloads. Import error: {HTTPX_IMPORT_ERROR}")
        dest.parent.mkdir(parents=True, exist_ok=True)
        digest = hashlib.sha256()
        with httpx.stream("GET", url, follow_redirects=True, timeout=NETWORK_TIMEOUT) as response:
            response.raise_for_status()
            total = int(response.headers.get("Content-Length") or 0)
            tmp = dest.with_suffix(dest.suffix + f".download.{uuid.uuid4().hex}")
            done = 0
            try:
                with tmp.open("wb") as handle:
                    for chunk in response.iter_bytes(chunk_size=1024 * 256):
                        if not chunk:
                            break
                        handle.write(chunk)
                        digest.update(chunk)
                        done += len(chunk)
                        if progress_callback:
                            progress_callback(done, total)
                tmp.replace(dest)
            finally:
                safe_cleanup([tmp])
        sha = digest.hexdigest()
        if expected_sha and sha.lower() != expected_sha.lower():
            safe_cleanup([dest])
            raise ValueError(f"Downloaded model SHA mismatch. Expected {expected_sha}, got {sha}.")
        return sha

    def verify_primary_model(self, password: Optional[str] = None) -> Tuple[str, bool]:
        with self.unlocked_model_path(password=password) as model_path:
            sha = sha256_file(model_path)
        return sha, sha.lower() == EXPECTED_HASH.lower()

    def chat(
        self,
        prompt: str,
        *,
        system_prompt: Optional[str] = None,
        image_path: Optional[Union[str, Path]] = None,
        password: Optional[str] = None,
    ) -> str:
        if litert_lm is None:
            raise RuntimeError("LiteRT-LM is not installed.")
        safe_image_path = validate_image_path(image_path) if image_path else None
        settings = load_settings(self.paths)
        native_image_input = bool(settings.get("enable_native_image_input", True))
        enable_vision = bool(safe_image_path) and native_image_input and self.configured_model_supports_native_image_input()
        with self.unlocked_model_path(password=password) as model_path, self.temporary_cache() as cache_dir:
            engine = self.load_engine(model_path, cache_dir, enable_vision=enable_vision)
            with engine:
                messages = create_default_messages(system_prompt)
                with engine.create_conversation(messages=messages) as conversation:
                    return response_to_text(
                        conversation.send_message(create_user_message(sanitize_text(prompt, max_chars=12000), str(safe_image_path) if enable_vision else None))
                    )


class GeoPetalProofs:
    @staticmethod
    def build(latitude: Optional[float], longitude: Optional[float], *, precision_meters: int = 1200) -> Optional[GeoPetalProof]:
        if latitude is None or longitude is None:
            return None
        precision = max(100, int(precision_meters))
        decimals = 2 if precision <= 1200 else 1
        lat_blur = round(float(latitude), decimals)
        lon_blur = round(float(longitude), decimals)
        coarse_label = f"{lat_blur:.{decimals}f},{lon_blur:.{decimals}f}"
        region_hash = sha256_text(f"geopetal:{precision}:{coarse_label}")
        return GeoPetalProof(
            region_hash=region_hash,
            coarse_label=coarse_label,
            precision_meters=precision,
            latitude_blur=lat_blur,
            longitude_blur=lon_blur,
        )


class SeasonGraphEngine:
    def __init__(self, settings: Dict[str, Any]):
        self.settings = settings

    def seasonal_context(self, when: Optional[datetime] = None) -> Dict[str, Any]:
        current = when or datetime.now(tz=UTC)
        frost = self.settings.get("frost_dates") or {}
        spring = parse_month_day(str(frost.get("lastSpringFrost") or frost.get("last_spring_frost") or ""), current.year)
        fall = parse_month_day(str(frost.get("firstFallFrost") or frost.get("first_fall_frost") or ""), current.year)
        context: Dict[str, Any] = {
            "location": sanitize_text(self.settings.get("location"), max_chars=120),
            "today": current.date().isoformat(),
            "season": current.strftime("%B"),
        }
        if spring:
            context["days_since_last_spring_frost"] = (current.date() - spring).days
        if fall:
            context["days_until_first_fall_frost"] = (fall - current.date()).days
        if spring and fall:
            in_growing_window = spring <= current.date() <= fall
            context["growing_window"] = "active" if in_growing_window else "edge"
        return context


class PlantSyncIDService:
    def __init__(self, key_provider: Callable[[], bytes]):
        self.key_provider = key_provider

    def ensure_identity(self, state: Dict[str, Any], display_name: str) -> SyncIdentity:
        raw_identity = state.get("sync_identity")
        if isinstance(raw_identity, dict) and raw_identity.get("sync_id"):
            return sync_identity_from_dict(raw_identity)
        device_label = sanitize_text(os.environ.get("HOSTNAME") or os.environ.get("COMPUTERNAME") or "garden-node", max_chars=120)
        fingerprint = sha256_bytes(self.key_provider())[:32]
        security = SecurityProfile(
            pq_ready=bool(oqs),
            manifest_signing="ML-DSA-65" if oqs else "HMAC-SHA256 fallback",
        )
        public_key_hint = ""
        if oqs is not None:
            public_key_hint = "oqs-available"
        identity = SyncIdentity(
            sync_id=f"sync-{uuid.uuid4().hex}",
            created_at=now_iso(),
            display_name=sanitize_text(display_name, max_chars=120),
            fingerprint=fingerprint,
            device_label=device_label,
            security=security,
            public_key_hint=public_key_hint,
        )
        state["sync_identity"] = asdict(identity)
        state["security"] = asdict(security)
        return identity

    def sign(self, payload: Mapping[str, Any]) -> str:
        return hmac.new(self.key_provider(), canonical_json(payload), hashlib.sha256).hexdigest()


class OQSPQAdvisor:
    def __init__(self):
        self.build_script_path = (REPO_ROOT / OQS_BUILD_SCRIPT).resolve()

    def _enabled_kems(self) -> List[str]:
        if oqs is not None:
            try:
                return sorted(list(oqs.get_enabled_kem_mechanisms()))
            except Exception:
                pass
        return list(CURATED_OQS_KEMS)

    def _enabled_signatures(self) -> List[str]:
        if oqs is not None:
            try:
                return sorted(list(oqs.get_enabled_sig_mechanisms()))
            except Exception:
                pass
        return list(CURATED_OQS_SIGNATURES)

    def search(self, query: str) -> Dict[str, Any]:
        clean = sanitize_text(query, max_chars=80).lower()
        kems = [item for item in self._enabled_kems() if clean in item.lower()] if clean else self._enabled_kems()
        signatures = [item for item in self._enabled_signatures() if clean in item.lower()] if clean else self._enabled_signatures()
        return {
            "query": clean,
            "kems": kems,
            "signatures": signatures,
            "recommended_profile": {"key_exchange": "ML-KEM-768", "signatures": "ML-DSA-65"},
        }

    def status(self) -> Dict[str, Any]:
        return {
            "oqs_python_installed": oqs is not None,
            "oqs_import_error": sanitize_text(OQS_IMPORT_ERROR, max_chars=400) if OQS_IMPORT_ERROR else "",
            "liboqs_repo": OQS_LIB_REPO,
            "liboqs_python_repo": OQS_PYTHON_REPO,
            "liboqs_python_vcs": OQS_PYTHON_VCS,
            "build_script": str(self.build_script_path),
            "requirements_file": str((REPO_ROOT / "requirements-oqs.txt").resolve()),
            "pip_requirements": list(OQS_PIP_REQUIREMENTS),
            "official_install_commands": [
                f"git clone --depth=1 {OQS_LIB_REPO}",
                "cmake -S liboqs -B liboqs/build -DBUILD_SHARED_LIBS=ON",
                "cmake --build liboqs/build --parallel 8",
                "cmake --build liboqs/build --target install",
                f"git clone --depth=1 {OQS_PYTHON_REPO}",
                "cd liboqs-python && pip install .",
            ],
            "enabled_kems": self._enabled_kems(),
            "enabled_signatures": self._enabled_signatures(),
            "recommended_for_garden": {"sync_key_exchange": "ML-KEM-768", "manifest_signatures": "ML-DSA-65"},
        }


class ManagedIpfsDaemon:
    def __init__(self, settings_provider: Callable[[], Dict[str, Any]], paths: Optional[GardenPaths] = None):
        self.settings_provider = settings_provider
        self.paths = paths or require_paths()
        self.install_script = (REPO_ROOT / KUBO_INSTALL_SCRIPT).resolve()

    def _settings(self) -> Dict[str, Any]:
        return self.settings_provider()

    def enabled(self) -> bool:
        return bool(self._settings().get("ipfs_daemon_enabled", False))

    def auto_install_enabled(self) -> bool:
        return bool(self._settings().get("ipfs_daemon_auto_install", False))

    def auto_start_enabled(self) -> bool:
        return bool(self._settings().get("ipfs_daemon_auto_start", False))

    def repo_path(self) -> Path:
        configured = sanitize_text(self._settings().get("ipfs_daemon_repo") or str(self.paths.ipfs_repo_dir), max_chars=400)
        return Path(configured).expanduser()

    def managed_binary_path(self) -> Path:
        suffix = ".exe" if os.name == "nt" else ""
        return self.paths.ipfs_managed_dir / f"ipfs{suffix}"

    def resolved_binary_path(self) -> Optional[Path]:
        configured = sanitize_text(self._settings().get("ipfs_daemon_binary"), max_chars=400)
        candidates: List[Optional[Union[str, Path]]] = [
            configured or None,
            self.managed_binary_path(),
            shutil.which("ipfs"),
        ]
        for candidate in candidates:
            if not candidate:
                continue
            path = Path(candidate).expanduser()
            if path.exists() and path.is_file():
                return path
        return None

    def binary_exists(self) -> bool:
        return self.resolved_binary_path() is not None

    def _read_pid(self) -> Optional[int]:
        if not self.paths.ipfs_daemon_pid_path.exists():
            return None
        try:
            return int(self.paths.ipfs_daemon_pid_path.read_text(encoding="utf-8").strip())
        except Exception:
            return None

    def _write_pid(self, pid: int) -> None:
        _atomic_write_bytes(self.paths.ipfs_daemon_pid_path, f"{pid}\n".encode("utf-8"))

    def _clear_pid(self) -> None:
        safe_cleanup([self.paths.ipfs_daemon_pid_path])

    def running(self) -> bool:
        pid = self._read_pid()
        if not process_is_running(pid):
            self._clear_pid()
            return False
        return True

    def _run(self, args: List[str], *, env: Optional[Dict[str, str]] = None, timeout: int = 180) -> subprocess.CompletedProcess[str]:
        return subprocess.run(
            args,
            check=True,
            capture_output=True,
            text=True,
            timeout=timeout,
            env=env,
        )

    def _binary_env(self) -> Tuple[Path, Dict[str, str]]:
        binary = self.resolved_binary_path()
        if binary is None:
            raise FileNotFoundError("No IPFS binary is available yet. Enable managed install or provide an existing ipfs binary path.")
        env = os.environ.copy()
        env["IPFS_PATH"] = str(self.repo_path())
        return binary, env

    def install_instructions(self) -> Dict[str, Any]:
        settings = self._settings()
        return {
            "enabled": self.enabled(),
            "auto_install": self.auto_install_enabled(),
            "install_script": str(self.install_script),
            "managed_binary_path": str(self.managed_binary_path()),
            "repo_path": str(self.repo_path()),
            "binary_path": str(self.resolved_binary_path()) if self.resolved_binary_path() else "",
            "kubo_version": sanitize_text(settings.get("ipfs_kubo_version"), max_chars=80),
            "download_url": sanitize_text(settings.get("ipfs_kubo_download_url"), max_chars=400),
            "needs_user_enablement": not self.enabled(),
        }

    def install(self) -> Dict[str, Any]:
        if not self.enabled():
            raise RuntimeError("Managed IPFS daemon install is disabled. Turn on managed IPFS in Settings first.")
        if not self.install_script.exists():
            raise FileNotFoundError(f"Kubo install script is missing: {self.install_script}")
        env = os.environ.copy()
        version = sanitize_text(self._settings().get("ipfs_kubo_version"), max_chars=80)
        download_url = sanitize_text(self._settings().get("ipfs_kubo_download_url"), max_chars=400)
        if version:
            env["KUBO_VERSION"] = version
        if download_url:
            env["KUBO_TARBALL_URL"] = download_url
        result = self._run(["bash", str(self.install_script), str(self.paths.ipfs_managed_dir)], env=env)
        binary = self.resolved_binary_path()
        return {
            "installed": binary is not None and binary.exists(),
            "managed_binary_path": str(self.managed_binary_path()),
            "binary_path": str(binary) if binary else "",
            "stdout": sanitize_text(result.stdout, max_chars=6000),
        }

    def ensure_repo_initialized(self) -> Dict[str, Any]:
        repo = self.repo_path()
        repo.mkdir(parents=True, exist_ok=True)
        config_path = repo / "config"
        if config_path.exists():
            return {"initialized": True, "repo_path": str(repo), "config_path": str(config_path)}
        binary, env = self._binary_env()
        result = self._run([str(binary), "init", "--profile=server"], env=env)
        return {
            "initialized": config_path.exists(),
            "repo_path": str(repo),
            "config_path": str(config_path),
            "stdout": sanitize_text(result.stdout, max_chars=4000),
        }

    def start(self) -> Dict[str, Any]:
        if not self.enabled():
            raise RuntimeError("Managed IPFS daemon start is disabled. Turn on managed IPFS in Settings first.")
        if self.running():
            return self.status()
        if not self.binary_exists():
            if not self.auto_install_enabled():
                raise FileNotFoundError("No managed IPFS binary found. Enable auto-install or run the install action first.")
            self.install()
        self.ensure_repo_initialized()
        binary, env = self._binary_env()
        self.paths.ipfs_daemon_log_path.parent.mkdir(parents=True, exist_ok=True)
        with self.paths.ipfs_daemon_log_path.open("ab") as log_handle:
            process = subprocess.Popen(
                [str(binary), "daemon", "--migrate=true"],
                env=env,
                stdin=subprocess.DEVNULL,
                stdout=log_handle,
                stderr=subprocess.STDOUT,
                start_new_session=True,
            )
        self._write_pid(process.pid)
        for _ in range(24):
            if process.poll() is not None:
                self._clear_pid()
                break
            time.sleep(0.25)
            if self.running():
                return self.status()
        return self.status()

    def stop(self) -> Dict[str, Any]:
        pid = self._read_pid()
        if not process_is_running(pid):
            self._clear_pid()
            return self.status()
        try:
            if hasattr(os, "killpg"):
                os.killpg(os.getpgid(pid), signal.SIGTERM)  # type: ignore[arg-type]
            else:
                os.kill(pid, signal.SIGTERM)  # type: ignore[arg-type]
        except Exception:
            try:
                os.kill(pid, signal.SIGTERM)  # type: ignore[arg-type]
            except Exception:
                pass
        for _ in range(20):
            if not process_is_running(pid):
                break
            time.sleep(0.25)
        self._clear_pid()
        return self.status()

    def version(self) -> Dict[str, Any]:
        binary, env = self._binary_env()
        result = self._run([str(binary), "version", "--number"], env=env, timeout=30)
        return {"version": sanitize_text(result.stdout, max_chars=80), "binary_path": str(binary)}

    def status(self) -> Dict[str, Any]:
        binary = self.resolved_binary_path()
        repo = self.repo_path()
        running = self.running()
        status = {
            "enabled": self.enabled(),
            "auto_install": self.auto_install_enabled(),
            "auto_start": self.auto_start_enabled(),
            "binary_exists": binary is not None and binary.exists(),
            "binary_path": str(binary) if binary else "",
            "managed_binary_path": str(self.managed_binary_path()),
            "repo_path": str(repo),
            "repo_initialized": (repo / "config").exists(),
            "pid": self._read_pid(),
            "running": running,
            "log_path": str(self.paths.ipfs_daemon_log_path),
            "install_script": str(self.install_script),
        }
        if binary is not None and binary.exists():
            try:
                status.update(self.version())
            except Exception as exc:
                status["version_error"] = sanitize_text(exc, max_chars=240)
        return status


class IpfsKuboClient:
    def __init__(
        self,
        settings_provider: Callable[[], Dict[str, Any]],
        secret_provider: Optional[Callable[[], Dict[str, str]]] = None,
        paths: Optional[GardenPaths] = None,
    ):
        self.settings_provider = settings_provider
        self.secret_provider = secret_provider or (lambda: {})
        self.paths = paths or require_paths()

    def _settings(self) -> Dict[str, Any]:
        return self.settings_provider()

    def _secrets(self) -> Dict[str, str]:
        return dict(self.secret_provider() or {})

    def _api(self) -> str:
        return sanitize_text(self._settings().get("ipfs_api") or DEFAULT_IPFS_API, max_chars=240)

    def _headers(self) -> Dict[str, str]:
        secrets = self._secrets()
        token = sanitize_text(secrets.get("ipfs_bearer_token") or secrets.get("ipfs_pin_surface_token"), max_chars=400)
        return {"Authorization": f"Bearer {token}"} if token else {}

    def enabled(self) -> bool:
        return ipfs_network_enabled(self._settings()) and httpx_available()

    def _post(self, endpoint: str, *, params: Optional[Dict[str, Any]] = None, files: Any = None) -> Any:
        if httpx is None:
            raise RuntimeError(f"httpx is required for IPFS HTTP RPC. Import error: {HTTPX_IMPORT_ERROR}")
        response = httpx.post(
            f"{self._api().rstrip('/')}/{endpoint.lstrip('/')}",
            params=params,
            files=files,
            headers=self._headers(),
            timeout=NETWORK_TIMEOUT,
        )
        response.raise_for_status()
        return response

    def version(self) -> Dict[str, Any]:
        return self._post("version").json()

    def node_id(self) -> Dict[str, Any]:
        return self._post("id").json()

    def add_bytes(self, filename: str, payload: bytes) -> Dict[str, Any]:
        return self._post(
            "add",
            params={
                "pin": "true" if bool(self._settings().get("ipfs_pin_on_add", True)) else "false",
                "cid-version": "1",
            },
            files={"file": (filename, payload)},
        ).json()

    def cat(self, cid: str) -> bytes:
        return self._post("cat", params={"arg": cid}).content

    def pin_ls(self, cid: Optional[str] = None) -> Dict[str, Any]:
        params: Dict[str, Any] = {"type": "all"}
        if cid:
            params["arg"] = cid
        return self._post("pin/ls", params=params).json()

    def pin_add(self, cid: str) -> Dict[str, Any]:
        return self._post("pin/add", params={"arg": cid}).json()

    def files_mkdir(self, path: str) -> None:
        self._post("files/mkdir", params={"arg": path, "parents": "true", "cid-version": "1"})

    def files_write(self, path: str, payload: bytes) -> None:
        parent = str(Path(path).parent).replace("\\", "/")
        self.files_mkdir(parent)
        self._post(
            "files/write",
            params={"arg": path, "create": "true", "parents": "true", "truncate": "true", "cid-version": "1"},
            files={"file": ("blob", payload)},
        )

    def files_read(self, path: str) -> bytes:
        return self._post("files/read", params={"arg": path}).content

    def files_ls(self, path: str) -> Dict[str, Any]:
        return self._post("files/ls", params={"arg": path, "long": "true"}).json()

    def files_stat(self, path: str) -> Dict[str, Any]:
        return self._post("files/stat", params={"arg": path}).json()

    def files_flush(self, path: str) -> Dict[str, Any]:
        return self._post("files/flush", params={"arg": path}).json()

    def mirror_bytes(self, digest: str, filename: str, payload: bytes) -> Optional[str]:
        root = sanitize_text(self._settings().get("ipfs_mfs_root") or "/kaylas-garden", max_chars=240) or "/kaylas-garden"
        if not root.startswith("/"):
            root = f"/{root}"
        mfs_path = f"{root.rstrip('/')}/objects/{digest[:2]}/{digest}/{filename}"
        self.files_write(mfs_path, payload)
        self.files_flush(str(Path(mfs_path).parent).replace("\\", "/"))
        return mfs_path

    def status(self) -> Dict[str, Any]:
        settings = self._settings()
        status = {
            "httpx_available": httpx_available(),
            "enabled": self.enabled(),
            "network_mode": normalize_network_mode(settings.get("network_mode")),
            "local_first_only": bool(settings.get("local_first_only", True)),
            "cloud_mode": bool(settings.get("cloud_mode", False)),
            "ipfs_enabled": bool(settings.get("ipfs_enabled", False)),
            "api": self._api(),
            "mfs_root": sanitize_text(settings.get("ipfs_mfs_root") or "/kaylas-garden", max_chars=240),
            "ipfs_user_id": mask_secret(self._secrets().get("ipfs_user_id")),
            "pin_surface": sanitize_text(self._secrets().get("ipfs_pin_surface"), max_chars=120),
        }
        if not self.enabled():
            return status
        try:
            status["version"] = self.version()
            status["node"] = self.node_id()
            status["mfs"] = self.files_stat(status["mfs_root"])
        except Exception as exc:
            status["error"] = sanitize_text(exc, max_chars=400)
        return status


class HiveBlockchainClient:
    def __init__(
        self,
        settings_provider: Callable[[], Dict[str, Any]],
        secret_provider: Optional[Callable[[], Dict[str, str]]] = None,
        paths: Optional[GardenPaths] = None,
    ):
        self.settings_provider = settings_provider
        self.secret_provider = secret_provider or (lambda: {})
        self.paths = paths or require_paths()

    def _settings(self) -> Dict[str, Any]:
        return self.settings_provider()

    def _secrets(self) -> Dict[str, str]:
        return dict(self.secret_provider() or {})

    def _api(self) -> str:
        return sanitize_text(self._settings().get("hive_api") or DEFAULT_HIVE_API, max_chars=240)

    def _hive_username(self) -> str:
        return sanitize_text(self._secrets().get("hive_username") or self._settings().get("hive_account"), max_chars=80)

    def enabled(self) -> bool:
        return hive_network_enabled(self._settings()) and httpx_available()

    def json_rpc(self, method: str, params: Optional[Any] = None, *, request_id: int = 1) -> Any:
        if httpx is None:
            raise RuntimeError(f"httpx is required for Hive JSON-RPC. Import error: {HTTPX_IMPORT_ERROR}")
        payload: Dict[str, Any] = {"jsonrpc": "2.0", "method": method, "id": request_id}
        if params is not None:
            payload["params"] = params
        response = httpx.post(self._api(), json=payload, timeout=NETWORK_TIMEOUT)
        response.raise_for_status()
        body = response.json()
        if isinstance(body, dict) and body.get("error"):
            raise RuntimeError(json.dumps(body["error"], ensure_ascii=True))
        return body.get("result") if isinstance(body, dict) else body

    def get_dynamic_global_properties(self) -> Any:
        return self.json_rpc("condenser_api.get_dynamic_global_properties", [])

    def get_accounts(self, accounts: List[str]) -> Any:
        return self.json_rpc("condenser_api.get_accounts", [accounts])

    def get_transaction_status(self, tx_id: str) -> Any:
        return self.json_rpc("transaction_status_api.find_transaction", {"transaction_id": tx_id})

    def broadcast_transaction_synchronous(self, signed_transaction: Mapping[str, Any]) -> Any:
        return self.json_rpc("condenser_api.broadcast_transaction_synchronous", [dict(signed_transaction)])

    def prepare_checkpoint_operation(self, checkpoint: HiveCheckpoint) -> Dict[str, Any]:
        return {
            "id": "kaylas-garden",
            "required_auths": [],
            "required_posting_auths": [self._hive_username()] if self._hive_username() else [],
            "json": json.dumps(
                {"app": "kaylas-garden", "type": "bloomtrace-checkpoint", "checkpoint": asdict(checkpoint)},
                separators=(",", ":"),
                ensure_ascii=True,
            ),
        }

    def prepare_group_comment_operation(self, *, group_name: str, body: str, title: str = "") -> Dict[str, Any]:
        author = self._hive_username()
        group_slug = sanitize_text(group_name.lower().replace(" ", "-"), max_chars=80) or "plant-users"
        permlink = f"{group_slug}-{uuid.uuid4().hex[:10]}"
        return {
            "author": author,
            "parent_author": "",
            "parent_permlink": group_slug,
            "permlink": permlink,
            "title": sanitize_text(title, max_chars=120),
            "body": sanitize_text(body, max_chars=8000),
            "json_metadata": json.dumps({"app": "kaylas-garden", "type": "pin-group-comment", "group": group_slug}, separators=(",", ":"), ensure_ascii=True),
        }

    def status(self) -> Dict[str, Any]:
        settings = self._settings()
        status = {
            "httpx_available": httpx_available(),
            "enabled": self.enabled(),
            "network_mode": normalize_network_mode(settings.get("network_mode")),
            "local_first_only": bool(settings.get("local_first_only", True)),
            "cloud_mode": bool(settings.get("cloud_mode", False)),
            "hive_enabled": bool(settings.get("hive_enabled", False)),
            "broadcast_enabled": bool(settings.get("hive_broadcast_enabled", False)),
            "api": self._api(),
            "account": self._hive_username(),
            "posting_key_present": bool(self._secrets().get("hive_posting_key")),
        }
        if not self.enabled():
            return status
        try:
            status["dynamic_global_properties"] = self.get_dynamic_global_properties()
            if status["account"]:
                status["accounts"] = self.get_accounts([status["account"]])
        except Exception as exc:
            status["error"] = sanitize_text(exc, max_chars=400)
        return status


class LeafVaultBuckets:
    def __init__(
        self,
        key_provider: Callable[[], bytes],
        settings_provider: Callable[[], Dict[str, Any]],
        ipfs_client: IpfsKuboClient,
        paths: Optional[GardenPaths] = None,
    ):
        self.key_provider = key_provider
        self.settings_provider = settings_provider
        self.ipfs_client = ipfs_client
        self.paths = paths or require_paths()

    def _local_payload_path(self, digest: str, suffix: str) -> Path:
        shard = digest[:2]
        target_dir = self.paths.leafvault_dir / shard
        target_dir.mkdir(parents=True, exist_ok=True)
        _set_owner_only_permissions(target_dir, is_dir=True)
        return target_dir / f"{digest}{suffix}"

    def _ipfs_add_bytes(self, digest: str, filename: str, payload: bytes) -> Tuple[Optional[str], Optional[str]]:
        if not self.ipfs_client.enabled():
            return None, None
        try:
            data = self.ipfs_client.add_bytes(filename, payload)
            cid = sanitize_text(data.get("Hash"), max_chars=160) or None if isinstance(data, dict) else None
            mfs_path = self.ipfs_client.mirror_bytes(digest, filename, payload) if cid else None
            return cid, mfs_path
        except Exception:
            return None, None

    def store_bytes(self, payload: bytes, *, filename: str, media_type: str) -> ObservationAsset:
        digest = sha256_bytes(payload)
        encrypted = aes_encrypt(payload, self.key_provider())
        local_path = self._local_payload_path(digest, ".aes")
        _atomic_write_bytes(local_path, encrypted)
        cid, mfs_path = self._ipfs_add_bytes(digest, f"{filename}.aes", encrypted)
        if not cid:
            cid = f"synthetic-{digest}"
        return ObservationAsset(
            asset_id=f"asset-{uuid.uuid4().hex}",
            asset_type="object",
            cid=cid,
            digest=digest,
            media_type=media_type,
            local_path=str(local_path),
            size_bytes=len(encrypted),
            encrypted=True,
            mfs_path=mfs_path,
        )

    def store_json(self, payload: Mapping[str, Any], *, filename: str) -> ObservationAsset:
        return self.store_bytes(canonical_json(payload), filename=filename, media_type="application/json")

    def store_file(self, path: Union[str, Path]) -> ObservationAsset:
        image_path = validate_image_path(path)
        payload = image_path.read_bytes()
        asset = self.store_bytes(payload, filename=image_path.name, media_type=f"image/{image_path.suffix.lower().lstrip('.')}")
        asset.asset_type = "image"
        return asset

    def status(self) -> Dict[str, Any]:
        return {"leafvault_dir": str(self.paths.leafvault_dir), "ipfs": self.ipfs_client.status()}


class BloomTraceLedger:
    def __init__(self, hive_client: HiveBlockchainClient, settings_provider: Callable[[], Dict[str, Any]], paths: Optional[GardenPaths] = None):
        self.hive_client = hive_client
        self.settings_provider = settings_provider
        self.paths = paths or require_paths()

    def create_checkpoint(
        self,
        plant_id: str,
        manifest_hash: str,
        observation_cid: Optional[str],
        geoproof: Optional[GeoPetalProof],
    ) -> HiveCheckpoint:
        settings = self.settings_provider()
        broadcast_status = "queued-local"
        if hive_network_enabled(settings):
            broadcast_status = "prepared-cloud"
            if bool(settings.get("hive_broadcast_enabled", False)):
                broadcast_status = "awaiting-signed-transaction"
        return HiveCheckpoint(
            checkpoint_id=f"checkpoint-{uuid.uuid4().hex}",
            plant_id=plant_id,
            manifest_hash=manifest_hash,
            timestamp=now_iso(),
            region_hash=geoproof.region_hash if geoproof else "private-region",
            observation_cid=observation_cid,
            broadcast_status=broadcast_status,
        )

    def queue(self, checkpoint: HiveCheckpoint) -> Path:
        path = self.paths.anchors_dir / f"{checkpoint.checkpoint_id}.json"
        payload = {
            "checkpoint": asdict(checkpoint),
            "prepared_hive_operation": self.hive_client.prepare_checkpoint_operation(checkpoint),
        }
        _atomic_write_bytes(path, json.dumps(payload, indent=2).encode("utf-8"))
        return path

    def status(self) -> Dict[str, Any]:
        return {"anchors_dir": str(self.paths.anchors_dir), "hive": self.hive_client.status()}


class RootMeshSyncer:
    def __init__(self, settings_provider: Callable[[], Dict[str, Any]], paths: Optional[GardenPaths] = None):
        self.settings_provider = settings_provider
        self.paths = paths or require_paths()

    def queue(self, plant_id: str, cids: List[str]) -> SyncJob:
        settings = self.settings_provider()
        network_mode = normalize_network_mode(settings.get("network_mode"))
        status = "local-only"
        if ipfs_network_enabled(settings):
            status = "queued-cloud"
        elif bool(settings.get("cloud_mode", False)):
            status = "prepared-cloud"
        job = SyncJob(
            job_id=f"syncjob-{uuid.uuid4().hex}",
            plant_id=plant_id,
            created_at=now_iso(),
            cids=[item for item in cids if item],
            targets=[sanitize_text(item, max_chars=120) for item in list(settings.get("trusted_nodes") or DEFAULT_TRUSTED_NODES)],
            status=status,
            mode=network_mode,
        )
        path = self.paths.sync_dir / f"{job.job_id}.json"
        _atomic_write_bytes(path, json.dumps(asdict(job), indent=2).encode("utf-8"))
        return job

    def status(self) -> Dict[str, Any]:
        settings = self.settings_provider()
        return {
            "mode": normalize_network_mode(settings.get("network_mode")),
            "cloud_mode": bool(settings.get("cloud_mode", False)),
            "targets": [sanitize_text(item, max_chars=120) for item in list(settings.get("trusted_nodes") or DEFAULT_TRUSTED_NODES)],
            "sync_dir": str(self.paths.sync_dir),
        }


class GardenPromptStudio:
    def observation_system_prompt(self) -> str:
        return (
            "You are PhytoScan Edge running inside Kayla's Garden, a local-first plant intelligence system.\n"
            "You are optimized for Gemma 4 vision through LiteRT-LM and should treat every answer as a careful inference task.\n"
            "Your job is to help a plant owner understand likely plant state from image evidence, the plant profile, seasonal timing, "
            "recent history, and symptom notes.\n\n"
            "Behavior rules:\n"
            "1. Use the provided plant profile, observation timeline, health packet, seasonal context, and image evidence together.\n"
            "2. Be explicit about uncertainty. Say likely, possible, or less likely when evidence is incomplete.\n"
            "3. Never invent visual details. If the image is unclear, say so.\n"
            "4. Prioritize practical gardening actions: moisture checks, pest inspection, airflow, pruning, soil checks, staging, and follow-up timing.\n"
            "5. Compare against the plant's recent history when it helps explain change over time.\n"
            "6. Keep advice concrete, plant-specific, and local-first. Do not mention Azure.\n"
            "7. Avoid medical framing, doom language, or overclaiming disease certainty from one image.\n\n"
            "Output goals:\n"
            "- Summarize the current state.\n"
            "- Name the highest priority next checks.\n"
            "- Suggest what to photograph or inspect next time.\n"
            "- Keep the answer dense with signal and easy to act on."
        )

    def observation_prompt(
        self,
        passport: PlantPassport,
        note: str,
        season_context: Mapping[str, Any],
        health: HealthAssessment,
        tags: List[str],
        history_summary: str,
    ) -> str:
        return (
            "Analyze this plant observation using the full local context below.\n\n"
            "Plant identity:\n"
            f"- Name: {passport.name}\n"
            f"- Species: {passport.species or 'Unknown'}\n"
            f"- Hardiness zone: {passport.hardiness_zone or 'Unknown'}\n"
            f"- Profile summary: {passport.profile_summary or passport.notes or 'No profile summary yet.'}\n"
            f"- Sunlight: {passport.sunlight or 'Unknown'}\n"
            f"- Watering: {passport.watering or 'Unknown'}\n"
            f"- Soil: {passport.soil or 'Unknown'}\n"
            f"- Tags: {', '.join(passport.tags) or 'none'}\n\n"
            "Current observation:\n"
            f"- Symptom or note: {sanitize_text(note, max_chars=1200)}\n"
            f"- Seasonal context: {json.dumps(dict(season_context), ensure_ascii=True)}\n"
            f"- Heuristic health packet: {json.dumps(asdict(health), ensure_ascii=True)}\n"
            f"- Current derived tags: {', '.join(tags) or 'none'}\n\n"
            "Recent plant history:\n"
            f"{history_summary}\n\n"
            "Respond in this exact section order with short headings:\n"
            "Current State:\n"
            "Top Priorities:\n"
            "What To Compare Next:\n"
            "Confidence Notes:\n"
            "Keep it under 220 words."
        )

    def care_brief_system_prompt(self) -> str:
        return (
            "You are the Garden Caretaker LLM in Kayla's Garden.\n"
            "You provide concise but expert follow-up guidance grounded in local plant history, recent image-informed observations, "
            "seasonal context, and practical gardening technique.\n"
            "Prefer concrete next actions over generic education. Mention uncertainty when context is incomplete. Never mention Azure."
        )

    def care_brief_prompt(
        self,
        passport: PlantPassport,
        latest_observation_json: str,
        season_context: Mapping[str, Any],
        history_summary: str,
        question: str,
    ) -> str:
        return (
            "Prepare a targeted plant care brief.\n\n"
            "Plant profile:\n"
            f"- Name: {passport.name}\n"
            f"- Species: {passport.species or 'Unknown'}\n"
            f"- Hardiness zone: {passport.hardiness_zone or 'Unknown'}\n"
            f"- Profile summary: {passport.profile_summary or passport.notes or 'No profile summary yet.'}\n"
            f"- Sunlight: {passport.sunlight or 'Unknown'}\n"
            f"- Watering: {passport.watering or 'Unknown'}\n"
            f"- Soil: {passport.soil or 'Unknown'}\n"
            f"- Tags: {', '.join(passport.tags) or 'none'}\n\n"
            "Time and environment:\n"
            f"- Seasonal context: {json.dumps(dict(season_context), ensure_ascii=True)}\n\n"
            "Latest observation payload:\n"
            f"{latest_observation_json}\n\n"
            "Recent history summary:\n"
            f"{history_summary}\n\n"
            f"User question: {sanitize_text(question, max_chars=500)}\n\n"
            "Respond with these sections:\n"
            "Immediate Focus:\n"
            "This Week:\n"
            "Watch For:\n"
            "Why This Matters:\n"
            "Keep the answer under 220 words."
        )

    def plant_guide_system_prompt(self) -> str:
        return (
            "You are Chat With A Plant Guide inside Kayla's Garden.\n"
            "You are a long-context, plant-specific reasoning assistant designed to work with Gemma 4 vision through LiteRT-LM.\n"
            "You have access to a plant passport, the observation timeline, recent image metadata and local paths, health check-ins, "
            "community technique cards, seasonal context, and optionally a current plant image supplied by the user.\n\n"
            "Core mission:\n"
            "Help the grower reason about what is happening with this specific plant over time, compare today's state to the plant's known past, "
            "and propose practical next actions.\n\n"
            "Reasoning discipline:\n"
            "1. Treat each answer as a plant case review, not a generic gardening FAQ.\n"
            "2. Use plant history heavily. Look for trend changes, repeat symptoms, progression, recovery, or seasonal shifts.\n"
            "3. If an image is attached, use visible evidence from that image and compare it against the timeline context.\n"
            "4. If no image is attached, say that your conclusions rely on history and written notes.\n"
            "5. Separate likely explanations from speculative ones.\n"
            "6. Prefer stepwise inspection plans: what to look at first, what to measure, what to photograph next, what to prune, what to isolate.\n"
            "7. When possible, connect observations to watering rhythm, sunlight exposure, airflow, container size, pests, disease pressure, frost timing, and recent interventions.\n"
            "8. If community techniques are provided, reference them as shared patterns rather than guaranteed fixes.\n"
            "9. Do not mention Azure, cloud-only inference, or unavailable tools.\n"
            "10. Avoid claiming certainty from one photo.\n\n"
            "Output style:\n"
            "- High-signal, practical, and grounded.\n"
            "- Use short labeled sections.\n"
            "- Include a trend view, current interpretation, next inspection steps, and a concrete follow-up plan.\n"
            "- Keep it under 350 words unless the user explicitly asks for more."
        )

    def plant_guide_prompt(
        self,
        passport: PlantPassport,
        question: str,
        season_context: Mapping[str, Any],
        history_summary: str,
        techniques_summary: str,
        health_checkin_summary: str,
        image_history_summary: str,
    ) -> str:
        return (
            "Review this plant as a persistent living record and answer the user's question.\n\n"
            "Plant passport:\n"
            f"- Name: {passport.name}\n"
            f"- Species: {passport.species or 'Unknown'}\n"
            f"- Hardiness zone: {passport.hardiness_zone or 'Unknown'}\n"
            f"- Privacy class: {passport.privacy_class}\n"
            f"- Profile summary: {passport.profile_summary or passport.notes or 'No profile summary yet.'}\n"
            f"- Sunlight: {passport.sunlight or 'Unknown'}\n"
            f"- Watering: {passport.watering or 'Unknown'}\n"
            f"- Soil: {passport.soil or 'Unknown'}\n"
            f"- Tags: {', '.join(passport.tags) or 'none'}\n\n"
            "Seasonal context:\n"
            f"{json.dumps(dict(season_context), ensure_ascii=True)}\n\n"
            "Observation timeline summary:\n"
            f"{history_summary}\n\n"
            "Health check-ins:\n"
            f"{health_checkin_summary}\n\n"
            "Historical image inventory:\n"
            f"{image_history_summary}\n\n"
            "Shared technique cards:\n"
            f"{techniques_summary}\n\n"
            f"User question: {sanitize_text(question, max_chars=1000)}\n\n"
            "Respond with these sections in order:\n"
            "Trend View:\n"
            "Current Interpretation:\n"
            "Most Likely Explanations:\n"
            "Next Inspections:\n"
            "Action Plan:\n"
            "Follow-up Capture Plan:\n"
            "Confidence Notes:\n"
        )

    def diagnosis_system_prompt(self) -> str:
        return (
            "You are the Plant Problem Diagnosis engine inside Kayla's Garden.\n"
            "You review one plant case using long-context LiteRT-LM reasoning and Gemma 4 vision when an image is present.\n"
            "You must balance caution with usefulness: infer what is likely, what else could explain it, and what should be checked next.\n\n"
            "Rules:\n"
            "1. Use the plant passport, season context, symptom note, history, and image evidence together.\n"
            "2. Distinguish stress, pest pressure, disease pressure, nutrient or watering issues, and environmental shocks.\n"
            "3. Do not overclaim certainty from one image.\n"
            "4. Provide inspection steps before recommending major intervention.\n"
            "5. Keep advice actionable for a home gardener.\n"
            "6. Never mention Azure.\n"
            "7. Prefer likely-cause ranking and practical containment steps."
        )

    def diagnosis_prompt(
        self,
        passport: PlantPassport,
        symptom_note: str,
        season_context: Mapping[str, Any],
        history_summary: str,
        health_checkin_summary: str,
        techniques_summary: str,
        health: HealthAssessment,
    ) -> str:
        return (
            "Diagnose this plant issue from the full case file.\n\n"
            "Plant passport:\n"
            f"- Name: {passport.name}\n"
            f"- Species: {passport.species or 'Unknown'}\n"
            f"- Hardiness zone: {passport.hardiness_zone or 'Unknown'}\n"
            f"- Profile summary: {passport.profile_summary or passport.notes or 'No profile summary yet.'}\n"
            f"- Sunlight: {passport.sunlight or 'Unknown'}\n"
            f"- Watering: {passport.watering or 'Unknown'}\n"
            f"- Soil: {passport.soil or 'Unknown'}\n"
            f"- Tags: {', '.join(passport.tags) or 'none'}\n\n"
            "Current case:\n"
            f"- Symptom summary: {sanitize_text(symptom_note, max_chars=1200)}\n"
            f"- Season context: {json.dumps(dict(season_context), ensure_ascii=True)}\n"
            f"- Heuristic health packet: {json.dumps(asdict(health), ensure_ascii=True)}\n\n"
            "Observation history:\n"
            f"{history_summary}\n\n"
            "Health check-ins:\n"
            f"{health_checkin_summary}\n\n"
            "Shared techniques:\n"
            f"{techniques_summary}\n\n"
            "Respond with these sections in order:\n"
            "Urgency:\n"
            "Most Likely Causes:\n"
            "Immediate Actions:\n"
            "What To Inspect Next:\n"
            "Prevention Notes:\n"
            "Confidence Notes:\n"
        )

    def health_checkin_system_prompt(self) -> str:
        return (
            "You are the Health Check-In narrator for Kayla's Garden.\n"
            "Write focused, plant-specific check-in summaries grounded in recent notes, image evidence when present, season timing, and plant history.\n"
            "Turn observations into a compact snapshot a grower can revisit later. Never mention Azure."
        )

    def health_checkin_prompt(
        self,
        passport: PlantPassport,
        note: str,
        season_context: Mapping[str, Any],
        history_summary: str,
        health: HealthAssessment,
    ) -> str:
        return (
            "Create a plant health check-in summary.\n\n"
            "Plant passport:\n"
            f"- Name: {passport.name}\n"
            f"- Species: {passport.species or 'Unknown'}\n"
            f"- Profile summary: {passport.profile_summary or passport.notes or 'No profile summary yet.'}\n"
            f"- Tags: {', '.join(passport.tags) or 'none'}\n\n"
            "Current note:\n"
            f"- {sanitize_text(note, max_chars=1200)}\n"
            f"- Season context: {json.dumps(dict(season_context), ensure_ascii=True)}\n"
            f"- Heuristic health packet: {json.dumps(asdict(health), ensure_ascii=True)}\n\n"
            "Recent history:\n"
            f"{history_summary}\n\n"
            "Respond with these sections:\n"
            "Snapshot:\n"
            "Watch Next:\n"
            "Action Items:\n"
            "Confidence Notes:\n"
        )


class CanopyReputation:
    @staticmethod
    def record(state: Dict[str, Any], observer_sync_id: str, privacy_class: str) -> None:
        reputation = state.setdefault("reputation", {})
        actor = reputation.setdefault(observer_sync_id, {"observations": 0, "public_anchors": 0, "score": 0})
        actor["observations"] = int(actor.get("observations") or 0) + 1
        if privacy_class == "public":
            actor["public_anchors"] = int(actor.get("public_anchors") or 0) + 1
        actor["score"] = min(100, actor["observations"] * 5 + actor["public_anchors"] * 10)


class PhytoScanEdge:
    def __init__(self, model_manager: LiteRTModelManager, prompt_studio: Optional[GardenPromptStudio] = None):
        self.model_manager = model_manager
        self.prompt_studio = prompt_studio or GardenPromptStudio()
        self.species_keywords = {
            "pea": "Pisum sativum",
            "rosemary": "Salvia rosmarinus",
            "tomato": "Solanum lycopersicum",
            "basil": "Ocimum basilicum",
            "oak": "Quercus",
            "maple": "Acer",
        }
        self.profile_hints = {
            "pea": {
                "sunlight": "Full sun to partial shade",
                "watering": "Keep soil evenly moist",
                "soil": "Fertile, well-draining loam",
                "tags": ["cool-season", "trellis", "edible"],
            },
            "rosemary": {
                "sunlight": "Full sun",
                "watering": "Water deeply and let soil dry slightly between drinks",
                "soil": "Fast-draining, sandy soil",
                "tags": ["herb", "drought-tolerant", "pollinator-friendly"],
            },
            "tomato": {
                "sunlight": "Full sun",
                "watering": "Steady deep watering 2-3 times each week",
                "soil": "Rich, well-draining soil with compost",
                "tags": ["fruiting", "warm-season", "staking"],
            },
            "basil": {
                "sunlight": "Full sun",
                "watering": "Consistent moisture without soggy roots",
                "soil": "Rich, loose potting mix",
                "tags": ["herb", "container", "companion"],
            },
            "oak": {
                "sunlight": "Full sun",
                "watering": "Deep soak during drought stress",
                "soil": "Deep, well-draining native soil",
                "tags": ["tree", "heritage", "long-lived"],
            },
            "maple": {
                "sunlight": "Full sun to partial shade",
                "watering": "Extra water during establishment and heat",
                "soil": "Moist, well-draining soil",
                "tags": ["tree", "shade", "seasonal-color"],
            },
        }

    def _guess_species(self, passport: PlantPassport, note: str, image_name: str) -> str:
        if passport.species:
            return passport.species
        haystack = f"{passport.name} {note} {image_name}".lower()
        for keyword, species in self.species_keywords.items():
            if keyword in haystack:
                return species
        return passport.name or "Unknown plant"

    def _heuristic_health(self, note: str) -> HealthAssessment:
        lowered = note.lower()
        stress = 0.15
        pest = 0.08
        disease = 0.08
        vigor = 0.82
        if any(word in lowered for word in ("yellow", "wilt", "droop", "stress", "dry")):
            stress += 0.35
            vigor -= 0.20
        if any(word in lowered for word in ("aphid", "mite", "beetle", "pest", "bugs")):
            pest += 0.45
            vigor -= 0.15
        if any(word in lowered for word in ("spot", "rot", "mildew", "fung", "blight")):
            disease += 0.45
            vigor -= 0.18
        if any(word in lowered for word in ("lush", "healthy", "new growth", "flowering", "vigorous")):
            vigor += 0.10
        vigor = max(0.05, min(0.99, vigor))
        stress = max(0.01, min(0.99, stress))
        pest = max(0.01, min(0.99, pest))
        disease = max(0.01, min(0.99, disease))
        status = "watch"
        if stress >= 0.60 or pest >= 0.60 or disease >= 0.60:
            status = "needs-attention"
        elif vigor >= 0.85 and max(stress, pest, disease) < 0.30:
            status = "thriving"
        summary = (
            f"Vigor {vigor:.2f}; stress {stress:.2f}; pest risk {pest:.2f}; "
            f"disease risk {disease:.2f}. Review watering, airflow, and leaf condition."
        )
        return HealthAssessment(
            vigor_score=round(vigor, 3),
            stress_risk=round(stress, 3),
            pest_risk=round(pest, 3),
            disease_risk=round(disease, 3),
            confidence=0.55,
            status=status,
            summary=summary,
        )

    def _fallback_care_summary(self, passport: PlantPassport, note: str, season: Mapping[str, Any], health: HealthAssessment) -> str:
        parts = [
            f"{passport.name} is tracked as {passport.species or 'an unknown species'}.",
            f"Current health status looks {health.status}.",
        ]
        if season.get("days_until_first_fall_frost") is not None:
            parts.append(f"Days until first fall frost: {season['days_until_first_fall_frost']}.")
        if season.get("days_since_last_spring_frost") is not None:
            parts.append(f"Days since last spring frost: {season['days_since_last_spring_frost']}.")
        if note:
            parts.append(f"Latest note: {sanitize_text(note, max_chars=220)}")
        parts.append("Next step: compare moisture, check new growth, and log another photo after the next visible change.")
        return " ".join(parts)

    def _profile_template(self, species_guess: str) -> Dict[str, Any]:
        lowered = species_guess.lower()
        for keyword, template in self.profile_hints.items():
            if keyword in lowered:
                return dict(template)
        return {
            "sunlight": "Bright light with species-specific adjustments",
            "watering": "Check moisture before watering and avoid extremes",
            "soil": "Well-draining soil matched to the plant",
            "tags": ["garden", "observed", "local-first"],
        }

    def _build_tags(
        self,
        passport: PlantPassport,
        note: str,
        species_guess: str,
        health: HealthAssessment,
        season_context: Mapping[str, Any],
    ) -> List[str]:
        tokens = {
            sanitize_text(passport.name.lower().replace(" ", "-"), max_chars=24),
            sanitize_text(species_guess.split(" ")[0].lower(), max_chars=24),
            sanitize_text(health.status.lower(), max_chars=24),
            sanitize_text(str(season_context.get("season", "")).lower(), max_chars=24),
        }
        lowered = note.lower()
        if "flower" in lowered or "bloom" in lowered:
            tokens.add("flowering")
        if "fruit" in lowered or "harvest" in lowered:
            tokens.add("fruiting")
        if "yellow" in lowered or "wilt" in lowered:
            tokens.add("stress")
        if "aphid" in lowered or "pest" in lowered or "mite" in lowered:
            tokens.add("pest-watch")
        if "spot" in lowered or "mildew" in lowered or "rot" in lowered:
            tokens.add("disease-watch")
        tokens.update(self._profile_template(species_guess)["tags"])
        return sorted(token for token in tokens if token and token != "unknown")

    def analyze(
        self,
        passport: PlantPassport,
        *,
        note: str,
        image_path: Optional[Union[str, Path]],
        season_context: Mapping[str, Any],
        history_summary: str = "No prior observations recorded.",
        password: Optional[str] = None,
    ) -> Tuple[str, HealthAssessment, List[str], Dict[str, str], str]:
        image_name = Path(image_path).name if image_path else ""
        species_guess = self._guess_species(passport, note, image_name)
        health = self._heuristic_health(note)
        tags = self._build_tags(passport, note, species_guess, health, season_context)
        template = self._profile_template(species_guess)
        prompt = self.prompt_studio.observation_prompt(
            PlantPassport(
                plant_id=passport.plant_id,
                name=passport.name,
                species=species_guess,
                date_added=passport.date_added,
                hardiness_zone=passport.hardiness_zone,
                privacy_class=passport.privacy_class,
                notes=passport.notes,
                source=passport.source,
                profile_summary=passport.profile_summary,
                sunlight=passport.sunlight,
                watering=passport.watering,
                soil=passport.soil,
                tags=list(passport.tags),
                primary_geoproof=passport.primary_geoproof,
                observations=list(passport.observations),
            ),
            sanitize_text(note, max_chars=1000),
            season_context,
            health,
            tags,
            history_summary,
        )
        try:
            summary = self.model_manager.chat(
                prompt,
                system_prompt=self.prompt_studio.observation_system_prompt(),
                image_path=image_path,
                password=password,
            )
        except Exception:
            summary = self._fallback_care_summary(passport, note, season_context, health)
        profile_patch = {
            "profile_summary": summary,
            "sunlight": passport.sunlight or template["sunlight"],
            "watering": passport.watering or template["watering"],
            "soil": passport.soil or template["soil"],
        }
        return species_guess, health, tags, profile_patch, summary


class KaylasGardenRuntime:
    def __init__(self, root: Optional[Union[str, Path]] = None, password: Optional[str] = None):
        self.paths = set_app_paths(root or default_storage_root())
        self.password = password
        self.vault = EncryptedGardenVault(self.paths)
        self.state = self.vault.load(password=password)
        self.settings = load_settings(self.paths)
        self.identity_service = PlantSyncIDService(lambda: self.vault.get_or_create_key(password=password))
        self.secret_vault = SecretSettingsVault(lambda: self.vault.get_or_create_key(password=password), self.paths)
        self.secret_settings = self.secret_vault.load()
        self._migrate_plaintext_secrets()
        self.identity = self.identity_service.ensure_identity(self.state, self.settings.get("garden_name") or "Kayla's Garden")
        self.oqs_advisor = OQSPQAdvisor()
        self.model_manager = LiteRTModelManager(self.vault, self.paths)
        self.prompts = GardenPromptStudio()
        self.season_engine = SeasonGraphEngine(self.settings)
        self.ipfs_daemon = ManagedIpfsDaemon(lambda: load_settings(self.paths), self.paths)
        self.ipfs = IpfsKuboClient(lambda: load_settings(self.paths), lambda: self.secret_settings, self.paths)
        self.hive = HiveBlockchainClient(lambda: load_settings(self.paths), lambda: self.secret_settings, self.paths)
        self.leafvault = LeafVaultBuckets(
            lambda: self.vault.get_or_create_key(password=password),
            lambda: load_settings(self.paths),
            self.ipfs,
            self.paths,
        )
        self.ledger = BloomTraceLedger(self.hive, lambda: load_settings(self.paths), self.paths)
        self.syncer = RootMeshSyncer(lambda: load_settings(self.paths), self.paths)
        self.phyto = PhytoScanEdge(self.model_manager, self.prompts)
        self._apply_settings_to_state()
        self._maybe_auto_start_ipfs_daemon()

    def _migrate_plaintext_secrets(self) -> None:
        migrated: Dict[str, str] = {}
        if not self.secret_settings.get("ipfs_bearer_token") and self.settings.get("ipfs_bearer_token"):
            migrated["ipfs_bearer_token"] = sanitize_text(self.settings.get("ipfs_bearer_token"), max_chars=400)
        if not self.secret_settings.get("hive_username") and self.settings.get("hive_account"):
            migrated["hive_username"] = sanitize_text(self.settings.get("hive_account"), max_chars=80)
        if not migrated:
            return
        self.secret_settings = self.secret_vault.save(migrated)
        save_settings({"ipfs_bearer_token": "", "hive_account": ""}, self.paths)
        self.settings = load_settings(self.paths)

    def _apply_settings_to_state(self) -> None:
        self.state["garden"]["name"] = sanitize_text(self.settings.get("garden_name") or "Kayla's Garden", max_chars=120)
        self.state["garden"]["theme"] = sanitize_text(self.settings.get("theme") or "green", max_chars=32)
        self.state["garden"]["location"] = sanitize_text(self.settings.get("location"), max_chars=120)
        self.state["garden"]["frost_dates"] = dict(self.settings.get("frost_dates") or {})
        self.state["garden"]["network_mode"] = normalize_network_mode(self.settings.get("network_mode"))
        self.state["garden"]["cloud_mode"] = bool(self.settings.get("cloud_mode", False))
        self.state["garden"]["local_first_only"] = bool(self.settings.get("local_first_only", True))
        self.state["garden"]["ipfs_daemon_enabled"] = bool(self.settings.get("ipfs_daemon_enabled", False))

    def reload_settings(self) -> None:
        self.settings = load_settings(self.paths)
        self.secret_settings = self.secret_vault.load()
        self.season_engine = SeasonGraphEngine(self.settings)
        self._apply_settings_to_state()

    def _maybe_auto_start_ipfs_daemon(self) -> None:
        if not bool(self.settings.get("ipfs_daemon_enabled", False)):
            return
        if not bool(self.settings.get("ipfs_daemon_auto_start", False)):
            return
        try:
            self.ipfs_daemon.start()
        except Exception as exc:
            self.state.setdefault("runtime_notes", {})["ipfs_daemon_auto_start_error"] = sanitize_text(exc, max_chars=400)

    def save(self) -> None:
        self.vault.save(self.state, password=self.password)

    def save_network_secrets(self, secrets: Mapping[str, Any]) -> Dict[str, Any]:
        self.secret_settings = self.secret_vault.save(secrets)
        return self.secret_vault.status()

    def network_secret_status(self) -> Dict[str, Any]:
        return self.secret_vault.status()

    def bootstrap_repository_data(self, *, force: bool = False) -> Dict[str, Any]:
        plants_path = REPO_ROOT / "data" / "plants.json"
        repo_settings_path = REPO_ROOT / "data" / "settings.json"
        if self.state["garden"].get("repo_bootstrap_at") and not force:
            return {"bootstrapped": False, "reason": "already-initialized"}
        repo_settings = load_json_file(repo_settings_path, {})
        if isinstance(repo_settings, dict):
            merged_settings = {
                "garden_name": "Kayla's Garden",
                "location": sanitize_text(repo_settings.get("location"), max_chars=120),
                "theme": sanitize_text(repo_settings.get("theme") or "green", max_chars=32),
                "frost_dates": dict(repo_settings.get("frostDates") or {}),
                "bootstrap_complete": True,
            }
            save_settings(merged_settings, self.paths)
            self.settings = load_settings(self.paths)
            self._apply_settings_to_state()
        repo_plants = load_json_file(plants_path, [])
        imported = 0
        if isinstance(repo_plants, list):
            for raw in repo_plants:
                if not isinstance(raw, dict):
                    continue
                plant_id = sanitize_text(raw.get("id") or f"plant-{uuid.uuid4().hex}", max_chars=64)
                existing = self.state["plants"].get(plant_id)
                if existing and not force:
                    continue
                care = raw.get("careInfo") or {}
                hardiness = sanitize_text(care.get("hardinessZone"), max_chars=64)
                general_notes = sanitize_text(care.get("generalNotes"), max_chars=1200)
                passport = PlantPassport(
                    plant_id=plant_id,
                    name=sanitize_text(raw.get("name"), max_chars=120),
                    species=sanitize_text(raw.get("species"), max_chars=160),
                    date_added=sanitize_text(raw.get("dateAdded") or now_iso(), max_chars=64),
                    hardiness_zone=hardiness,
                    privacy_class="private",
                    notes=general_notes,
                    source="repo:data/plants.json",
                    profile_summary=general_notes,
                    sunlight=sanitize_text(care.get("sunlight"), max_chars=200),
                    watering=sanitize_text(care.get("wateringSchedule"), max_chars=200),
                    soil=sanitize_text(care.get("soilType"), max_chars=200),
                    tags=[
                        sanitize_text(passport_tag, max_chars=40)
                        for passport_tag in (
                            [passport_name for passport_name in [raw.get("name")] if passport_name]
                            + list(care.get("companionPlants") or [])[:2]
                            + list(care.get("commonPests") or [])[:2]
                        )
                        if sanitize_text(passport_tag, max_chars=40)
                    ],
                    observations=[],
                )
                for entry in list(raw.get("entries") or []):
                    if not isinstance(entry, dict):
                        continue
                    note = sanitize_text(entry.get("note"), max_chars=1000)
                    health = self.phyto._heuristic_health(note)
                    entry_tags = self.phyto._build_tags(passport, note, passport.species or passport.name, health, self.season_engine.seasonal_context())
                    assets: List[ObservationAsset] = []
                    for image in list(entry.get("images") or []):
                        if not isinstance(image, dict):
                            continue
                        filename = sanitize_text(image.get("filename"), max_chars=160)
                        upload_path = REPO_ROOT / "public" / "uploads" / filename
                        digest = sha256_text(filename + str(image.get("uploadedAt") or ""))
                        size = upload_path.stat().st_size if upload_path.exists() else 0
                        assets.append(
                            ObservationAsset(
                                asset_id=sanitize_text(image.get("id") or f"asset-{uuid.uuid4().hex}", max_chars=64),
                                asset_type="image",
                                cid=None,
                                digest=digest,
                                media_type=f"image/{Path(filename).suffix.lower().lstrip('.') or 'unknown'}",
                                local_path=str(upload_path),
                                size_bytes=size,
                                encrypted=False,
                            )
                        )
                    observation = ObservationRecord(
                        observation_id=sanitize_text(entry.get("id") or f"obs-{uuid.uuid4().hex}", max_chars=64),
                        recorded_at=sanitize_text(entry.get("date") or now_iso(), max_chars=64),
                        observer_sync_id=self.identity.sync_id,
                        plant_id=passport.plant_id,
                        privacy_class="private",
                        note=note,
                        species_guess=passport.species or passport.name,
                        care_summary=self.phyto._fallback_care_summary(passport, note, self.season_engine.seasonal_context(), health),
                        geoproof=None,
                        health=health,
                        metadata_cid=None,
                        tags=entry_tags,
                        assets=assets,
                    )
                    passport.observations.append(observation)
                cids = [asset.cid for obs in passport.observations for asset in obs.assets if asset.cid]
                manifest_payload = {"plant_id": passport.plant_id, "bucket": bucket_name_for_privacy(passport.privacy_class), "cids": cids}
                manifest = LeafVaultManifest(
                    plant_id=passport.plant_id,
                    bucket=manifest_payload["bucket"],
                    cids=cids,
                    manifest_hash=sha256_bytes(canonical_json(manifest_payload)),
                    signed_at=now_iso(),
                    signature=self.identity_service.sign(manifest_payload),
                )
                self.state["plants"][passport.plant_id] = asdict(passport)
                self.state["manifests"][passport.plant_id] = asdict(manifest)
                imported += 1
        self.state["garden"]["repo_bootstrap_at"] = now_iso()
        self.save()
        return {"bootstrapped": True, "imported_plants": imported}

    def list_plants(self) -> List[PlantPassport]:
        return [passport_from_dict(item) for item in self.state.get("plants", {}).values() if isinstance(item, dict)]

    def get_passport(self, plant_id: str) -> PlantPassport:
        raw = self.state.get("plants", {}).get(plant_id)
        if not isinstance(raw, dict):
            raise KeyError(f"Unknown plant_id: {plant_id}")
        return passport_from_dict(raw)

    def _diagnoses_for_plant(self, plant_id: str) -> List[PlantDiagnosis]:
        return [
            diagnosis_from_dict(item)
            for item in list(self.state.get("diagnoses") or [])
            if isinstance(item, dict) and sanitize_text(item.get("plant_id"), max_chars=64) == plant_id
        ]

    def _health_checkins_for_plant(self, plant_id: str) -> List[HealthCheckin]:
        return [
            health_checkin_from_dict(item)
            for item in list(self.state.get("health_checkins") or [])
            if isinstance(item, dict) and sanitize_text(item.get("plant_id"), max_chars=64) == plant_id
        ]

    def _shared_techniques_for_passport(self, passport: PlantPassport) -> List[SharedTechnique]:
        matches: List[SharedTechnique] = []
        name_key = sanitize_text(passport.name, max_chars=160).lower()
        species_key = sanitize_text(passport.species, max_chars=160).lower()
        for raw in list(self.state.get("shared_techniques") or []):
            if not isinstance(raw, dict):
                continue
            technique = shared_technique_from_dict(raw)
            scope = technique.plant_scope.lower()
            if technique.plant_id == passport.plant_id or scope in {"all", name_key, species_key}:
                matches.append(technique)
        return matches

    def _observation_history_block(self, passport: PlantPassport, *, limit: int = 6) -> str:
        if not passport.observations:
            return "No prior observations recorded."
        lines = []
        for observation in passport.observations[-limit:]:
            lines.append(
                (
                    f"- {observation.recorded_at}: status={observation.health.status}, "
                    f"vigor={observation.health.vigor_score:.2f}, "
                    f"note={sanitize_text(observation.note, max_chars=180)}, "
                    f"tags={', '.join(observation.tags) or 'none'}, "
                    f"images={sum(1 for asset in observation.assets if asset.asset_type == 'image')}"
                )
            )
        return "\n".join(lines)

    def _health_checkin_summary(self, passport: PlantPassport, *, limit: int = 6) -> str:
        records = self._health_checkins_for_plant(passport.plant_id)
        if not records:
            return "No health check-ins recorded."
        return "\n".join(
            (
                f"- {record.recorded_at}: status={record.overall_status}, "
                f"vigor={record.vigor_score:.2f}, hydration={record.hydration_score:.2f}, "
                f"note={sanitize_text(record.note, max_chars=180)}"
            )
            for record in records[-limit:]
        )

    def _shared_techniques_summary(self, passport: PlantPassport, *, limit: int = 6) -> str:
        techniques = self._shared_techniques_for_passport(passport)
        if not techniques:
            return "No shared techniques recorded for this plant yet."
        return "\n".join(
            (
                f"- {item.created_at}: {item.title} | focus={item.problem_focus or 'general care'} | "
                f"tags={', '.join(item.tags) or 'none'} | summary={sanitize_text(item.summary, max_chars=180)}"
            )
            for item in techniques[-limit:]
        )

    def _image_history_summary(self, passport: PlantPassport, *, limit: int = 6) -> str:
        image_lines: List[str] = []
        for observation in passport.observations:
            image_assets = [asset for asset in observation.assets if asset.asset_type == "image"]
            if not image_assets:
                continue
            asset_names = ", ".join(Path(asset.local_path).name for asset in image_assets[:2])
            image_lines.append(
                (
                    f"- {observation.recorded_at}: {len(image_assets)} image asset(s), "
                    f"status={observation.health.status}, note={sanitize_text(observation.note, max_chars=140)}, "
                    f"assets={asset_names}"
                )
            )
        if not image_lines:
            return "No historical plant images stored."
        return "\n".join(image_lines[-limit:])

    def _latest_image_asset(self, passport: PlantPassport) -> Optional[ObservationAsset]:
        for observation in reversed(passport.observations):
            for asset in reversed(observation.assets):
                if asset.asset_type == "image":
                    return asset
        return None

    @contextmanager
    def _vision_image_context(self, passport: PlantPassport, image_path: Optional[Union[str, Path]] = None):
        if image_path:
            yield str(validate_image_path(image_path)), "live-upload"
            return
        asset = self._latest_image_asset(passport)
        if asset is None:
            yield None, "history-unavailable"
            return
        source_path = Path(asset.local_path)
        if not source_path.exists():
            yield None, "history-missing"
            return
        suffix_map = {"jpeg": ".jpg", "jpg": ".jpg", "png": ".png", "webp": ".webp"}
        media_suffix = suffix_map.get(asset.media_type.split("/")[-1].lower(), ".png")
        temp_path = _tmp_path("plant_vision", media_suffix)
        try:
            if asset.encrypted:
                decrypt_file(source_path, temp_path, self.vault.get_or_create_key(password=self.password))
            else:
                shutil.copy2(source_path, temp_path)
            yield str(temp_path), f"history:{asset.asset_id}"
        finally:
            safe_cleanup([temp_path])

    def _fallback_plant_guide_response(
        self,
        passport: PlantPassport,
        question: str,
        history_summary: str,
        health_checkin_summary: str,
        techniques_summary: str,
        image_source: str,
    ) -> str:
        latest = passport.observations[-1] if passport.observations else None
        latest_status = latest.health.status if latest else "unknown"
        return (
            "Trend View:\n"
            f"{passport.name} has {len(passport.observations)} logged observations and the latest status is {latest_status}.\n\n"
            "Current Interpretation:\n"
            f"I am answering from the local plant record with image source '{image_source}'. Latest notes suggest {sanitize_text(latest.note if latest else passport.notes, max_chars=220) or 'limited recent symptom detail'}.\n\n"
            "Most Likely Explanations:\n"
            "Look first at moisture rhythm, light exposure, pest presence on leaf undersides, and recent weather shifts.\n\n"
            "Next Inspections:\n"
            "Check soil moisture 1-2 inches down, compare oldest and newest leaves, inspect stems and leaf undersides, and capture a close image of any damaged tissue.\n\n"
            "Action Plan:\n"
            f"Question in focus: {sanitize_text(question, max_chars=240)}\n"
            f"History: {history_summary}\n"
            f"Health check-ins: {health_checkin_summary}\n"
            f"Shared techniques: {techniques_summary}\n\n"
            "Follow-up Capture Plan:\n"
            "Photograph the same plant angle, a close leaf detail, and the soil/root zone after the next visible change.\n\n"
            "Confidence Notes:\n"
            "This fallback answer is based on local history and heuristics because the LiteRT model was unavailable."
        )

    def _heuristic_diagnosis_packet(self, note: str, health: HealthAssessment) -> Dict[str, Any]:
        lowered = note.lower()
        likely_causes: List[str] = []
        actions: List[str] = []
        prevention: List[str] = []
        if any(word in lowered for word in ("yellow", "wilt", "droop", "dry")):
            likely_causes.append("Watering imbalance or root-zone stress")
            actions.append("Check soil moisture depth before watering again")
            prevention.append("Keep a steadier watering rhythm and mulch exposed soil if appropriate")
        if any(word in lowered for word in ("aphid", "mite", "pest", "bugs", "beetle")):
            likely_causes.append("Active pest pressure on foliage or stems")
            actions.append("Inspect leaf undersides and isolate heavily infested growth if needed")
            prevention.append("Repeat scouting on the same plant surfaces every few days")
        if any(word in lowered for word in ("spot", "mildew", "rot", "blight", "fung")):
            likely_causes.append("Possible fungal or bacterial disease pressure")
            actions.append("Improve airflow and avoid wetting foliage late in the day")
            prevention.append("Sanitize pruning tools and remove heavily affected debris")
        if not likely_causes:
            likely_causes.append("Environmental stress or a developing care imbalance")
            actions.append("Compare light, watering, airflow, and root space against recent history")
            prevention.append("Keep consistent observation intervals with images from the same angle")
        if health.stress_risk >= 0.65 or health.pest_risk >= 0.65 or health.disease_risk >= 0.65:
            urgency = "high"
        elif max(health.stress_risk, health.pest_risk, health.disease_risk) >= 0.40:
            urgency = "medium"
        else:
            urgency = "watch"
        return {
            "urgency": urgency,
            "likely_causes": likely_causes[:3],
            "care_actions": list(dict.fromkeys(actions))[:4],
            "prevention_tips": list(dict.fromkeys(prevention))[:4],
        }

    def _heuristic_action_items(self, health: HealthAssessment) -> List[str]:
        items = ["Compare new growth to older leaves and capture another image from the same angle."]
        if health.stress_risk >= 0.45:
            items.insert(0, "Check moisture at root depth before the next watering.")
        if health.pest_risk >= 0.45:
            items.append("Inspect leaf undersides and stem joints for clustered pests or eggs.")
        if health.disease_risk >= 0.45:
            items.append("Check for spreading lesions, mildew, or stem softening and improve airflow.")
        return list(dict.fromkeys(items))[:4]

    def ipfs_daemon_status(self) -> Dict[str, Any]:
        return self.ipfs_daemon.status()

    def install_ipfs_daemon(self) -> Dict[str, Any]:
        result = self.ipfs_daemon.install()
        self.reload_settings()
        self.save()
        return result

    def start_ipfs_daemon(self) -> Dict[str, Any]:
        result = self.ipfs_daemon.start()
        self.reload_settings()
        self.save()
        return result

    def stop_ipfs_daemon(self) -> Dict[str, Any]:
        result = self.ipfs_daemon.stop()
        self.reload_settings()
        self.save()
        return result

    def activity_timeline(self, *, limit: int = 24) -> Dict[str, Any]:
        events: List[Dict[str, Any]] = []
        for plant in self.list_plants():
            for observation in plant.observations:
                events.append(
                    {
                        "timestamp": observation.recorded_at,
                        "event_type": "observation",
                        "plant_id": plant.plant_id,
                        "plant_name": plant.name,
                        "summary": sanitize_text(observation.note, max_chars=180),
                        "status": observation.health.status,
                        "tags": list(observation.tags),
                    }
                )
        for diagnosis in list(self.state.get("diagnoses") or []):
            if isinstance(diagnosis, dict):
                parsed = diagnosis_from_dict(diagnosis)
                passport = self.get_passport(parsed.plant_id)
                events.append(
                    {
                        "timestamp": parsed.recorded_at,
                        "event_type": "diagnosis",
                        "plant_id": parsed.plant_id,
                        "plant_name": passport.name,
                        "summary": sanitize_text(parsed.symptom_summary, max_chars=180),
                        "status": parsed.urgency,
                        "tags": list(parsed.tags),
                    }
                )
        for checkin in list(self.state.get("health_checkins") or []):
            if isinstance(checkin, dict):
                parsed = health_checkin_from_dict(checkin)
                passport = self.get_passport(parsed.plant_id)
                events.append(
                    {
                        "timestamp": parsed.recorded_at,
                        "event_type": "health-checkin",
                        "plant_id": parsed.plant_id,
                        "plant_name": passport.name,
                        "summary": sanitize_text(parsed.note, max_chars=180),
                        "status": parsed.overall_status,
                        "tags": list(parsed.tags),
                    }
                )
        for technique in list(self.state.get("shared_techniques") or []):
            if isinstance(technique, dict):
                parsed = shared_technique_from_dict(technique)
                passport = self.get_passport(parsed.plant_id)
                events.append(
                    {
                        "timestamp": parsed.created_at,
                        "event_type": "shared-technique",
                        "plant_id": parsed.plant_id,
                        "plant_name": passport.name,
                        "summary": sanitize_text(parsed.title, max_chars=180),
                        "status": parsed.privacy_class,
                        "tags": list(parsed.tags),
                    }
                )
        for comment in list(self.state.get("pin_group_comments") or []):
            if isinstance(comment, dict):
                parsed = pin_group_comment_from_dict(comment)
                events.append(
                    {
                        "timestamp": parsed.created_at,
                        "event_type": "pin-group-comment",
                        "plant_id": parsed.plant_id,
                        "plant_name": self.get_passport(parsed.plant_id).name if parsed.plant_id and parsed.plant_id in self.state.get("plants", {}) else "Community",
                        "summary": sanitize_text(parsed.body, max_chars=180),
                        "status": parsed.group_id,
                        "tags": list(parsed.target_cids)[:3],
                    }
                )
        for request in list(self.state.get("peer_pin_requests") or []):
            if isinstance(request, dict):
                parsed = peer_pin_request_from_dict(request)
                events.append(
                    {
                        "timestamp": parsed.created_at,
                        "event_type": "peer-pin-request",
                        "plant_id": "",
                        "plant_name": "Community",
                        "summary": sanitize_text(parsed.note or parsed.cid, max_chars=180),
                        "status": parsed.local_pin_status,
                        "tags": [parsed.cid] if parsed.cid else [],
                    }
                )
        events.sort(key=lambda item: sanitize_text(item.get("timestamp"), max_chars=64), reverse=True)
        return {"generated_at": now_iso(), "items": events[:limit]}

    def watchlist_report(self) -> Dict[str, Any]:
        report: List[Dict[str, Any]] = []
        season = self.season_engine.seasonal_context()
        for plant in self.list_plants():
            score = 0
            reasons: List[str] = []
            latest = plant.observations[-1] if plant.observations else None
            diagnoses = self._diagnoses_for_plant(plant.plant_id)
            latest_diagnosis = diagnoses[-1] if diagnoses else None
            checkins = self._health_checkins_for_plant(plant.plant_id)
            latest_checkin = checkins[-1] if checkins else None
            if latest is None:
                score += 35
                reasons.append("No observations logged yet.")
            else:
                if latest.health.status == "needs-attention":
                    score += 45
                    reasons.append("Latest observation flagged needs-attention.")
                elif latest.health.status == "watch":
                    score += 20
                    reasons.append("Latest observation is still in watch mode.")
            if latest_diagnosis is not None:
                urgency = latest_diagnosis.urgency.lower()
                if urgency == "high":
                    score += 40
                    reasons.append("Recent diagnosis marked high urgency.")
                elif urgency == "medium":
                    score += 22
                    reasons.append("Recent diagnosis marked medium urgency.")
            if latest_checkin is None:
                score += 15
                reasons.append("No health check-in recorded yet.")
            elif latest_checkin.overall_status == "needs-attention":
                score += 25
                reasons.append("Latest health check-in still needs attention.")
            elif latest_checkin.overall_status == "watch":
                score += 10
                reasons.append("Latest health check-in is in watch mode.")
            if not plant.primary_geoproof:
                reasons.append("No GeoPetal proof captured yet.")
            report.append(
                {
                    "plant_id": plant.plant_id,
                    "plant_name": plant.name,
                    "priority_score": min(score, 100),
                    "latest_status": latest.health.status if latest else "no-observations",
                    "latest_checkin_status": latest_checkin.overall_status if latest_checkin else "no-checkin",
                    "latest_diagnosis_urgency": latest_diagnosis.urgency if latest_diagnosis else "none",
                    "recommended_next_step": reasons[0] if reasons else "Keep capturing steady plant history.",
                    "reasons": reasons[:4],
                }
            )
        report.sort(key=lambda item: int(item.get("priority_score") or 0), reverse=True)
        return {"generated_at": now_iso(), "season_context": season, "watchlist": report}

    def greenhouse_digest(self) -> Dict[str, Any]:
        watchlist = self.watchlist_report()
        activity = self.activity_timeline(limit=12)
        return {
            "generated_at": now_iso(),
            "garden_name": self.state.get("garden", {}).get("name", "Kayla's Garden"),
            "season_context": self.season_engine.seasonal_context(),
            "top_watchlist": list(watchlist.get("watchlist") or [])[:5],
            "recent_activity": list(activity.get("items") or [])[:12],
            "network_mode": self.network_status(),
        }

    def add_plant(
        self,
        *,
        name: str,
        species: str,
        hardiness_zone: str = "",
        notes: str = "",
        privacy_class: Optional[str] = None,
    ) -> PlantPassport:
        passport = PlantPassport(
            plant_id=f"plant-{uuid.uuid4().hex}",
            name=sanitize_text(name, max_chars=120),
            species=sanitize_text(species, max_chars=160),
            date_added=now_iso(),
            hardiness_zone=sanitize_text(hardiness_zone, max_chars=64),
            privacy_class=normalize_privacy_class(privacy_class or self.settings.get("privacy_default")),
            notes=sanitize_text(notes, max_chars=2000),
            tags=[sanitize_text(name, max_chars=40).lower().replace(" ", "-")] if sanitize_text(name, max_chars=40) else [],
        )
        manifest_payload = {"plant_id": passport.plant_id, "bucket": bucket_name_for_privacy(passport.privacy_class), "cids": []}
        manifest = LeafVaultManifest(
            plant_id=passport.plant_id,
            bucket=manifest_payload["bucket"],
            cids=[],
            manifest_hash=sha256_bytes(canonical_json(manifest_payload)),
            signed_at=now_iso(),
            signature=self.identity_service.sign(manifest_payload),
        )
        self.state["plants"][passport.plant_id] = asdict(passport)
        self.state["manifests"][passport.plant_id] = asdict(manifest)
        self.save()
        return passport

    def _updated_manifest(self, passport: PlantPassport, metadata_asset: ObservationAsset, extra_assets: List[ObservationAsset]) -> LeafVaultManifest:
        existing = self.state.get("manifests", {}).get(passport.plant_id) or {}
        current = manifest_from_dict(existing) if isinstance(existing, dict) else LeafVaultManifest(
            plant_id=passport.plant_id,
            bucket=bucket_name_for_privacy(passport.privacy_class),
            cids=[],
            manifest_hash="",
            signed_at=now_iso(),
            signature="",
        )
        cids = list(current.cids)
        for asset in [metadata_asset] + list(extra_assets):
            if asset.cid and asset.cid not in cids:
                cids.append(asset.cid)
        payload = {"plant_id": passport.plant_id, "bucket": current.bucket, "cids": cids}
        return LeafVaultManifest(
            plant_id=passport.plant_id,
            bucket=current.bucket,
            cids=cids,
            manifest_hash=sha256_bytes(canonical_json(payload)),
            signed_at=now_iso(),
            signature=self.identity_service.sign(payload),
        )

    def record_observation(
        self,
        *,
        plant_id: str,
        note: str,
        image_path: Optional[Union[str, Path]] = None,
        latitude: Optional[float] = None,
        longitude: Optional[float] = None,
        privacy_class: Optional[str] = None,
        extra_tags: Optional[List[str]] = None,
    ) -> Dict[str, Any]:
        passport = self.get_passport(plant_id)
        effective_privacy = normalize_privacy_class(privacy_class or passport.privacy_class)
        season = self.season_engine.seasonal_context()
        history_summary = self._observation_history_block(passport)
        species_guess, health, auto_tags, profile_patch, care_summary = self.phyto.analyze(
            passport,
            note=sanitize_text(note, max_chars=1200),
            image_path=image_path,
            season_context=season,
            history_summary=history_summary,
            password=self.password,
        )
        geoproof = GeoPetalProofs.build(latitude, longitude)
        manual_tags = [
            sanitize_text(item, max_chars=40).lower().replace(" ", "-")
            for item in list(extra_tags or [])
            if sanitize_text(item, max_chars=40)
        ]
        merged_tags = sorted(set(auto_tags + manual_tags + list(passport.tags or [])))
        assets: List[ObservationAsset] = []
        if image_path:
            assets.append(self.leafvault.store_file(image_path))
        observation_payload = {
            "plant_id": passport.plant_id,
            "recorded_at": now_iso(),
            "privacy_class": effective_privacy,
            "species_guess": species_guess,
            "note": sanitize_text(note, max_chars=1200),
            "care_summary": care_summary,
            "health": asdict(health),
            "geoproof": asdict(geoproof) if geoproof else None,
            "tags": merged_tags,
            "profile": profile_patch,
            "asset_cids": [asset.cid for asset in assets if asset.cid],
            "season_context": season,
        }
        metadata_asset = self.leafvault.store_json(observation_payload, filename=f"{passport.plant_id}-observation")
        observation = ObservationRecord(
            observation_id=f"obs-{uuid.uuid4().hex}",
            recorded_at=observation_payload["recorded_at"],
            observer_sync_id=self.identity.sync_id,
            plant_id=passport.plant_id,
            privacy_class=effective_privacy,
            note=observation_payload["note"],
            species_guess=species_guess,
            care_summary=care_summary,
            geoproof=geoproof,
            health=health,
            metadata_cid=metadata_asset.cid,
            tags=merged_tags,
            assets=assets,
        )
        passport.observations.append(observation)
        passport.privacy_class = effective_privacy
        passport.species = passport.species or species_guess
        passport.profile_summary = profile_patch["profile_summary"]
        passport.sunlight = profile_patch["sunlight"]
        passport.watering = profile_patch["watering"]
        passport.soil = profile_patch["soil"]
        passport.tags = merged_tags
        passport.primary_geoproof = geoproof or passport.primary_geoproof
        manifest = self._updated_manifest(passport, metadata_asset, assets)
        checkpoint = self.ledger.create_checkpoint(passport.plant_id, manifest.manifest_hash, metadata_asset.cid, geoproof)
        self.ledger.queue(checkpoint)
        sync_job = self.syncer.queue(passport.plant_id, [asset.cid for asset in [metadata_asset] + assets if asset.cid])
        self.state["plants"][passport.plant_id] = asdict(passport)
        self.state["manifests"][passport.plant_id] = asdict(manifest)
        self.state.setdefault("anchor_queue", []).append(asdict(checkpoint))
        self.state.setdefault("sync_queue", []).append(asdict(sync_job))
        CanopyReputation.record(self.state, self.identity.sync_id, effective_privacy)
        self.save()
        return {
            "observation": asdict(observation),
            "metadata_asset": asdict(metadata_asset),
            "manifest": asdict(manifest),
            "checkpoint": asdict(checkpoint),
            "prepared_hive_operation": self.hive.prepare_checkpoint_operation(checkpoint),
            "sync_job": asdict(sync_job),
            "network_mode": normalize_network_mode(self.settings.get("network_mode")),
        }

    def care_brief(self, plant_id: str, *, question: str = "What should I watch next?") -> Dict[str, Any]:
        passport = self.get_passport(plant_id)
        latest = passport.observations[-1] if passport.observations else None
        season = self.season_engine.seasonal_context()
        prompt = self.prompts.care_brief_prompt(
            passport,
            json.dumps(asdict(latest), ensure_ascii=True) if latest else "none",
            season,
            self._observation_history_block(passport),
            question,
        )
        try:
            answer = self.model_manager.chat(
                prompt,
                system_prompt=self.prompts.care_brief_system_prompt(),
                password=self.password,
            )
        except Exception:
            answer = self.phyto._fallback_care_summary(passport, latest.note if latest else passport.notes, season, latest.health if latest else self.phyto._heuristic_health(passport.notes))
        return {"plant_id": plant_id, "brief": answer}

    def plant_guide_chat(
        self,
        plant_id: str,
        *,
        question: str,
        image_path: Optional[Union[str, Path]] = None,
    ) -> Dict[str, Any]:
        passport = self.get_passport(plant_id)
        season = self.season_engine.seasonal_context()
        history_summary = self._observation_history_block(passport)
        health_checkin_summary = self._health_checkin_summary(passport)
        techniques_summary = self._shared_techniques_summary(passport)
        image_history_summary = self._image_history_summary(passport)
        prompt = self.prompts.plant_guide_prompt(
            passport,
            question,
            season,
            history_summary,
            techniques_summary,
            health_checkin_summary,
            image_history_summary,
        )
        with self._vision_image_context(passport, image_path=image_path) as (vision_image_path, image_source):
            try:
                answer = self.model_manager.chat(
                    prompt,
                    system_prompt=self.prompts.plant_guide_system_prompt(),
                    image_path=vision_image_path,
                    password=self.password,
                )
            except Exception:
                answer = self._fallback_plant_guide_response(
                    passport,
                    question,
                    history_summary,
                    health_checkin_summary,
                    techniques_summary,
                    image_source,
                )
        return {
            "plant_id": plant_id,
            "question": sanitize_text(question, max_chars=1000),
            "image_source": image_source,
            "guide": answer,
        }

    def diagnose_plant_problem(
        self,
        *,
        plant_id: str,
        symptom_note: str,
        image_path: Optional[Union[str, Path]] = None,
        latitude: Optional[float] = None,
        longitude: Optional[float] = None,
        extra_tags: Optional[List[str]] = None,
    ) -> Dict[str, Any]:
        passport = self.get_passport(plant_id)
        season = self.season_engine.seasonal_context()
        health = self.phyto._heuristic_health(symptom_note)
        history_summary = self._observation_history_block(passport)
        health_checkin_summary = self._health_checkin_summary(passport)
        techniques_summary = self._shared_techniques_summary(passport)
        diagnosis_prompt = self.prompts.diagnosis_prompt(
            passport,
            symptom_note,
            season,
            history_summary,
            health_checkin_summary,
            techniques_summary,
            health,
        )
        with self._vision_image_context(passport, image_path=image_path) as (vision_image_path, image_source):
            try:
                narrative = self.model_manager.chat(
                    diagnosis_prompt,
                    system_prompt=self.prompts.diagnosis_system_prompt(),
                    image_path=vision_image_path,
                    password=self.password,
                )
            except Exception:
                narrative = (
                    "Urgency:\n"
                    f"{self._heuristic_diagnosis_packet(symptom_note, health)['urgency']}\n\n"
                    "Most Likely Causes:\n"
                    + "\n".join(f"- {item}" for item in self._heuristic_diagnosis_packet(symptom_note, health)["likely_causes"])
                    + "\n\nImmediate Actions:\n"
                    + "\n".join(f"- {item}" for item in self._heuristic_diagnosis_packet(symptom_note, health)["care_actions"])
                    + "\n\nWhat To Inspect Next:\n"
                    "Compare newer growth, leaf undersides, stems, and the root-zone moisture profile.\n\n"
                    "Prevention Notes:\n"
                    + "\n".join(f"- {item}" for item in self._heuristic_diagnosis_packet(symptom_note, health)["prevention_tips"])
                    + "\n\nConfidence Notes:\nThis diagnosis fallback is heuristic because the LiteRT model was unavailable."
                )
        packet = self._heuristic_diagnosis_packet(symptom_note, health)
        geoproof = GeoPetalProofs.build(latitude, longitude)
        tags = sorted(
            set(
                self.phyto._build_tags(passport, symptom_note, passport.species or passport.name, health, season)
                + [
                    sanitize_text(item, max_chars=40).lower().replace(" ", "-")
                    for item in list(extra_tags or [])
                    if sanitize_text(item, max_chars=40)
                ]
            )
        )
        diagnosis_payload = {
            "plant_id": passport.plant_id,
            "recorded_at": now_iso(),
            "observer_sync_id": self.identity.sync_id,
            "symptom_summary": sanitize_text(symptom_note, max_chars=1200),
            "urgency": packet["urgency"],
            "confidence": health.confidence,
            "likely_causes": packet["likely_causes"],
            "care_actions": packet["care_actions"],
            "prevention_tips": packet["prevention_tips"],
            "narrative": narrative,
            "tags": tags,
            "season_context": season,
            "geoproof": asdict(geoproof) if geoproof else None,
            "image_source": image_source,
        }
        metadata_asset = self.leafvault.store_json(diagnosis_payload, filename=f"{passport.plant_id}-diagnosis")
        checkpoint = self.ledger.create_checkpoint(passport.plant_id, metadata_asset.digest, metadata_asset.cid, geoproof)
        self.ledger.queue(checkpoint)
        sync_job = self.syncer.queue(passport.plant_id, [metadata_asset.cid] if metadata_asset.cid else [])
        diagnosis = PlantDiagnosis(
            diagnosis_id=f"dx-{uuid.uuid4().hex}",
            plant_id=passport.plant_id,
            recorded_at=diagnosis_payload["recorded_at"],
            observer_sync_id=self.identity.sync_id,
            symptom_summary=diagnosis_payload["symptom_summary"],
            urgency=packet["urgency"],
            confidence=health.confidence,
            likely_causes=packet["likely_causes"],
            care_actions=packet["care_actions"],
            prevention_tips=packet["prevention_tips"],
            narrative=narrative,
            tags=tags,
            geoproof=geoproof,
            metadata_cid=metadata_asset.cid,
            checkpoint_id=checkpoint.checkpoint_id,
        )
        self.state.setdefault("diagnoses", []).append(asdict(diagnosis))
        self.state.setdefault("anchor_queue", []).append(asdict(checkpoint))
        self.state.setdefault("sync_queue", []).append(asdict(sync_job))
        CanopyReputation.record(self.state, self.identity.sync_id, passport.privacy_class)
        self.save()
        return {
            "diagnosis": asdict(diagnosis),
            "metadata_asset": asdict(metadata_asset),
            "checkpoint": asdict(checkpoint),
            "prepared_hive_operation": self.hive.prepare_checkpoint_operation(checkpoint),
            "sync_job": asdict(sync_job),
        }

    def record_health_checkin(
        self,
        *,
        plant_id: str,
        note: str,
        image_path: Optional[Union[str, Path]] = None,
        extra_tags: Optional[List[str]] = None,
    ) -> Dict[str, Any]:
        passport = self.get_passport(plant_id)
        season = self.season_engine.seasonal_context()
        health = self.phyto._heuristic_health(note or passport.notes)
        prompt = self.prompts.health_checkin_prompt(
            passport,
            note,
            season,
            self._observation_history_block(passport),
            health,
        )
        with self._vision_image_context(passport, image_path=image_path) as (vision_image_path, image_source):
            try:
                narrative = self.model_manager.chat(
                    prompt,
                    system_prompt=self.prompts.health_checkin_system_prompt(),
                    image_path=vision_image_path,
                    password=self.password,
                )
            except Exception:
                narrative = self.phyto._fallback_care_summary(passport, note or passport.notes, season, health)
        action_items = self._heuristic_action_items(health)
        tags = sorted(
            set(
                list(passport.tags)
                + [
                    sanitize_text(item, max_chars=40).lower().replace(" ", "-")
                    for item in list(extra_tags or [])
                    if sanitize_text(item, max_chars=40)
                ]
            )
        )
        payload = {
            "plant_id": passport.plant_id,
            "recorded_at": now_iso(),
            "observer_sync_id": self.identity.sync_id,
            "overall_status": health.status,
            "confidence": health.confidence,
            "note": sanitize_text(note, max_chars=1200),
            "vigor_score": health.vigor_score,
            "hydration_score": round(max(0.01, 1.0 - health.stress_risk), 3),
            "pest_pressure": health.pest_risk,
            "disease_pressure": health.disease_risk,
            "action_items": action_items,
            "narrative": narrative,
            "tags": tags,
            "season_context": season,
            "image_source": image_source,
        }
        metadata_asset = self.leafvault.store_json(payload, filename=f"{passport.plant_id}-checkin")
        checkpoint = self.ledger.create_checkpoint(passport.plant_id, metadata_asset.digest, metadata_asset.cid, passport.primary_geoproof)
        self.ledger.queue(checkpoint)
        sync_job = self.syncer.queue(passport.plant_id, [metadata_asset.cid] if metadata_asset.cid else [])
        checkin = HealthCheckin(
            checkin_id=f"checkin-{uuid.uuid4().hex}",
            plant_id=passport.plant_id,
            recorded_at=payload["recorded_at"],
            observer_sync_id=self.identity.sync_id,
            overall_status=health.status,
            confidence=health.confidence,
            note=payload["note"],
            vigor_score=health.vigor_score,
            hydration_score=payload["hydration_score"],
            pest_pressure=health.pest_risk,
            disease_pressure=health.disease_risk,
            action_items=action_items,
            narrative=narrative,
            tags=tags,
            metadata_cid=metadata_asset.cid,
            checkpoint_id=checkpoint.checkpoint_id,
        )
        self.state.setdefault("health_checkins", []).append(asdict(checkin))
        self.state.setdefault("anchor_queue", []).append(asdict(checkpoint))
        self.state.setdefault("sync_queue", []).append(asdict(sync_job))
        CanopyReputation.record(self.state, self.identity.sync_id, passport.privacy_class)
        self.save()
        return {
            "health_checkin": asdict(checkin),
            "metadata_asset": asdict(metadata_asset),
            "checkpoint": asdict(checkpoint),
            "prepared_hive_operation": self.hive.prepare_checkpoint_operation(checkpoint),
            "sync_job": asdict(sync_job),
        }

    def share_technique(
        self,
        *,
        plant_id: str,
        title: str,
        problem_focus: str,
        summary: str,
        steps: List[str],
        tags: Optional[List[str]] = None,
        privacy_class: Optional[str] = None,
    ) -> Dict[str, Any]:
        passport = self.get_passport(plant_id)
        effective_privacy = normalize_privacy_class(privacy_class or passport.privacy_class)
        clean_steps = [sanitize_text(item, max_chars=240) for item in steps if sanitize_text(item, max_chars=240)]
        clean_tags = sorted(
            set(
                list(passport.tags)
                + [
                    sanitize_text(item, max_chars=40).lower().replace(" ", "-")
                    for item in list(tags or [])
                    if sanitize_text(item, max_chars=40)
                ]
            )
        )
        payload = {
            "plant_id": passport.plant_id,
            "created_at": now_iso(),
            "author_sync_id": self.identity.sync_id,
            "title": sanitize_text(title, max_chars=160),
            "plant_scope": sanitize_text(passport.species or passport.name or "all", max_chars=160),
            "problem_focus": sanitize_text(problem_focus, max_chars=200),
            "summary": sanitize_text(summary, max_chars=2000),
            "steps": clean_steps,
            "tags": clean_tags,
            "privacy_class": effective_privacy,
            "season_context": self.season_engine.seasonal_context(),
        }
        metadata_asset = self.leafvault.store_json(payload, filename=f"{passport.plant_id}-technique")
        checkpoint = self.ledger.create_checkpoint(passport.plant_id, metadata_asset.digest, metadata_asset.cid, passport.primary_geoproof)
        self.ledger.queue(checkpoint)
        sync_job = self.syncer.queue(passport.plant_id, [metadata_asset.cid] if metadata_asset.cid else [])
        technique = SharedTechnique(
            technique_id=f"technique-{uuid.uuid4().hex}",
            plant_id=passport.plant_id,
            created_at=payload["created_at"],
            author_sync_id=self.identity.sync_id,
            title=payload["title"],
            plant_scope=payload["plant_scope"],
            problem_focus=payload["problem_focus"],
            summary=payload["summary"],
            steps=clean_steps,
            tags=clean_tags,
            privacy_class=effective_privacy,
            metadata_cid=metadata_asset.cid,
            checkpoint_id=checkpoint.checkpoint_id,
            sync_job_id=sync_job.job_id,
        )
        self.state.setdefault("shared_techniques", []).append(asdict(technique))
        self.state.setdefault("anchor_queue", []).append(asdict(checkpoint))
        self.state.setdefault("sync_queue", []).append(asdict(sync_job))
        CanopyReputation.record(self.state, self.identity.sync_id, effective_privacy)
        self.save()
        return {
            "shared_technique": asdict(technique),
            "metadata_asset": asdict(metadata_asset),
            "checkpoint": asdict(checkpoint),
            "prepared_hive_operation": self.hive.prepare_checkpoint_operation(checkpoint),
            "sync_job": asdict(sync_job),
        }

    def list_peer_users(self) -> List[PlantUserPeer]:
        return [peer_user_from_dict(item) for item in list(self.state.get("peer_users") or []) if isinstance(item, dict)]

    def list_pin_groups(self) -> List[PeerPinGroup]:
        return [pin_group_from_dict(item) for item in list(self.state.get("pin_groups") or []) if isinstance(item, dict)]

    def _resolve_pin_group(self, group_ref: str) -> Optional[PeerPinGroup]:
        clean = sanitize_text(group_ref, max_chars=160)
        if not clean:
            return None
        for group in self.list_pin_groups():
            if group.group_id == clean or group.name.lower() == clean.lower():
                return group
        return None

    def add_peer_user(
        self,
        *,
        display_name: str,
        hive_username: str = "",
        ipfs_user_id: str = "",
        pin_group: str = "",
        notes: str = "",
    ) -> Dict[str, Any]:
        peer = PlantUserPeer(
            peer_id=f"peer-{uuid.uuid4().hex}",
            created_at=now_iso(),
            display_name=sanitize_text(display_name, max_chars=160),
            hive_username=sanitize_text(hive_username, max_chars=80),
            ipfs_user_id=sanitize_text(ipfs_user_id, max_chars=160),
            pin_group=sanitize_text(pin_group, max_chars=160),
            notes=sanitize_text(notes, max_chars=1200),
            status="active",
        )
        self.state.setdefault("peer_users", []).append(asdict(peer))
        self.save()
        return {"peer_user": asdict(peer)}

    def create_pin_group(
        self,
        *,
        name: str,
        description: str = "",
        privacy_class: str = "shared",
        tags: Optional[List[str]] = None,
        member_peer_ids: Optional[List[str]] = None,
    ) -> Dict[str, Any]:
        group = PeerPinGroup(
            group_id=f"group-{uuid.uuid4().hex}",
            created_at=now_iso(),
            name=sanitize_text(name, max_chars=160),
            description=sanitize_text(description, max_chars=2000),
            privacy_class=normalize_privacy_class(privacy_class),
            owner_sync_id=self.identity.sync_id,
            tags=[
                sanitize_text(item, max_chars=40).lower().replace(" ", "-")
                for item in list(tags or [])
                if sanitize_text(item, max_chars=40)
            ],
            member_peer_ids=[
                sanitize_text(item, max_chars=64)
                for item in list(member_peer_ids or [])
                if sanitize_text(item, max_chars=64)
            ],
        )
        payload = asdict(group)
        metadata_asset = self.leafvault.store_json(payload, filename=f"{group.group_id}-pin-group")
        checkpoint = self.ledger.create_checkpoint("community", metadata_asset.digest, metadata_asset.cid, None)
        self.ledger.queue(checkpoint)
        sync_job = self.syncer.queue("community", [metadata_asset.cid] if metadata_asset.cid else [])
        group.metadata_cid = metadata_asset.cid
        group.checkpoint_id = checkpoint.checkpoint_id
        self.state.setdefault("pin_groups", []).append(asdict(group))
        self.state.setdefault("anchor_queue", []).append(asdict(checkpoint))
        self.state.setdefault("sync_queue", []).append(asdict(sync_job))
        self.save()
        return {
            "pin_group": asdict(group),
            "metadata_asset": asdict(metadata_asset),
            "checkpoint": asdict(checkpoint),
            "prepared_hive_operation": self.hive.prepare_checkpoint_operation(checkpoint),
            "sync_job": asdict(sync_job),
        }

    def post_pin_group_comment(
        self,
        *,
        group_ref: str,
        body: str,
        plant_id: str = "",
        target_cids: Optional[List[str]] = None,
    ) -> Dict[str, Any]:
        group = self._resolve_pin_group(group_ref)
        if group is None:
            created = self.create_pin_group(name=group_ref or "plant-users", privacy_class="shared")
            group = pin_group_from_dict(created["pin_group"])
        comment = PinGroupComment(
            comment_id=f"comment-{uuid.uuid4().hex}",
            group_id=group.group_id,
            created_at=now_iso(),
            author_sync_id=self.identity.sync_id,
            author_label=self.identity.display_name,
            body=sanitize_text(body, max_chars=4000),
            plant_id=sanitize_text(plant_id, max_chars=64),
            target_cids=[
                sanitize_text(item, max_chars=160)
                for item in list(target_cids or [])
                if sanitize_text(item, max_chars=160)
            ],
        )
        payload = asdict(comment)
        payload["group_name"] = group.name
        metadata_asset = self.leafvault.store_json(payload, filename=f"{group.group_id}-comment")
        checkpoint = self.ledger.create_checkpoint("community", metadata_asset.digest, metadata_asset.cid, None)
        self.ledger.queue(checkpoint)
        sync_job = self.syncer.queue("community", [metadata_asset.cid] if metadata_asset.cid else [])
        comment.metadata_cid = metadata_asset.cid
        comment.checkpoint_id = checkpoint.checkpoint_id
        comment.sync_job_id = sync_job.job_id
        self.state.setdefault("pin_group_comments", []).append(asdict(comment))
        self.state.setdefault("anchor_queue", []).append(asdict(checkpoint))
        self.state.setdefault("sync_queue", []).append(asdict(sync_job))
        CanopyReputation.record(self.state, self.identity.sync_id, group.privacy_class)
        self.save()
        return {
            "pin_group_comment": asdict(comment),
            "group": asdict(group),
            "metadata_asset": asdict(metadata_asset),
            "checkpoint": asdict(checkpoint),
            "prepared_hive_comment": self.hive.prepare_group_comment_operation(group_name=group.name, body=comment.body),
            "sync_job": asdict(sync_job),
        }

    def request_peer_pin(
        self,
        *,
        group_ref: str,
        cid: str,
        target_peer_ids: Optional[List[str]] = None,
        note: str = "",
    ) -> Dict[str, Any]:
        group = self._resolve_pin_group(group_ref)
        if group is None:
            created = self.create_pin_group(name=group_ref or "plant-users", privacy_class="shared")
            group = pin_group_from_dict(created["pin_group"])
        clean_cid = sanitize_text(cid, max_chars=160)
        local_pin_status = "queued-local"
        if clean_cid and self.ipfs.enabled():
            try:
                self.ipfs.pin_add(clean_cid)
                local_pin_status = "pinned-local"
            except Exception as exc:
                local_pin_status = f"pin-error:{sanitize_text(exc, max_chars=80)}"
        request = PeerPinRequest(
            request_id=f"pinreq-{uuid.uuid4().hex}",
            group_id=group.group_id,
            created_at=now_iso(),
            requester_sync_id=self.identity.sync_id,
            requester_label=self.identity.display_name,
            cid=clean_cid,
            target_peer_ids=[
                sanitize_text(item, max_chars=64)
                for item in list(target_peer_ids or [])
                if sanitize_text(item, max_chars=64)
            ],
            note=sanitize_text(note, max_chars=2000),
            local_pin_status=local_pin_status,
        )
        payload = asdict(request)
        payload["group_name"] = group.name
        metadata_asset = self.leafvault.store_json(payload, filename=f"{group.group_id}-pin-request")
        checkpoint = self.ledger.create_checkpoint("community", metadata_asset.digest, metadata_asset.cid, None)
        self.ledger.queue(checkpoint)
        sync_job = self.syncer.queue("community", [clean_cid, metadata_asset.cid] if metadata_asset.cid else [clean_cid])
        request.metadata_cid = metadata_asset.cid
        request.checkpoint_id = checkpoint.checkpoint_id
        request.sync_job_id = sync_job.job_id
        self.state.setdefault("peer_pin_requests", []).append(asdict(request))
        self.state.setdefault("anchor_queue", []).append(asdict(checkpoint))
        self.state.setdefault("sync_queue", []).append(asdict(sync_job))
        self.save()
        return {
            "peer_pin_request": asdict(request),
            "group": asdict(group),
            "metadata_asset": asdict(metadata_asset),
            "checkpoint": asdict(checkpoint),
            "sync_job": asdict(sync_job),
        }

    def community_summary(self) -> Dict[str, Any]:
        peers = self.list_peer_users()
        groups = self.list_pin_groups()
        comments = [pin_group_comment_from_dict(item) for item in list(self.state.get("pin_group_comments") or []) if isinstance(item, dict)]
        pin_requests = [peer_pin_request_from_dict(item) for item in list(self.state.get("peer_pin_requests") or []) if isinstance(item, dict)]
        return {
            "generated_at": now_iso(),
            "peer_count": len(peers),
            "group_count": len(groups),
            "peers": [asdict(item) for item in peers[-12:]],
            "groups": [asdict(item) for item in groups[-12:]],
            "recent_comments": [asdict(item) for item in comments[-12:]],
            "recent_pin_requests": [asdict(item) for item in pin_requests[-12:]],
        }

    def network_status(self) -> Dict[str, Any]:
        return {
            "mode": {
                "network_mode": normalize_network_mode(self.settings.get("network_mode")),
                "local_first_only": bool(self.settings.get("local_first_only", True)),
                "cloud_mode": bool(self.settings.get("cloud_mode", False)),
                "ipfs_enabled": bool(self.settings.get("ipfs_enabled", False)),
                "hive_enabled": bool(self.settings.get("hive_enabled", False)),
                "hive_broadcast_enabled": bool(self.settings.get("hive_broadcast_enabled", False)),
            },
            "leafvault": self.leafvault.status(),
            "ipfs_daemon": self.ipfs_daemon_status(),
            "bloomtrace": self.ledger.status(),
            "rootmesh": self.syncer.status(),
            "secret_vault": self.network_secret_status(),
            "oqs": self.oqs_advisor.status(),
            "pending_anchor_records": len(list(self.state.get("anchor_queue") or [])),
            "pending_sync_records": len(list(self.state.get("sync_queue") or [])),
        }

    def summary(self) -> Dict[str, Any]:
        plants = self.list_plants()
        anchor_queue = [checkpoint_from_dict(item) for item in self.state.get("anchor_queue", []) if isinstance(item, dict)]
        sync_queue = [sync_job_from_dict(item) for item in self.state.get("sync_queue", []) if isinstance(item, dict)]
        manifests = {
            plant_id: manifest_from_dict(raw)
            for plant_id, raw in self.state.get("manifests", {}).items()
            if isinstance(raw, dict)
        }
        return {
            "garden": self.state.get("garden"),
            "sync_identity": asdict(self.identity),
            "plants": [
                {
                    "plant_id": plant.plant_id,
                    "name": plant.name,
                    "species": plant.species,
                    "privacy_class": plant.privacy_class,
                    "tags": plant.tags,
                    "profile_summary": plant.profile_summary,
                    "observations": len(plant.observations),
                    "latest_status": plant.observations[-1].health.status if plant.observations else "no-observations",
                    "manifest_cids": len(manifests.get(plant.plant_id, LeafVaultManifest("", "", [], "", "", "")).cids),
                }
                for plant in plants
            ],
            "anchor_queue_depth": len(anchor_queue),
            "sync_queue_depth": len(sync_queue),
            "diagnosis_count": len(list(self.state.get("diagnoses") or [])),
            "health_checkin_count": len(list(self.state.get("health_checkins") or [])),
            "shared_technique_count": len(list(self.state.get("shared_techniques") or [])),
            "peer_user_count": len(list(self.state.get("peer_users") or [])),
            "pin_group_count": len(list(self.state.get("pin_groups") or [])),
            "top_watchlist": self.watchlist_report()["watchlist"][:3],
            "community_summary": self.community_summary(),
            "model_status": self.model_manager.model_status(),
            "network_status": self.network_status(),
        }


def print_json(payload: Any) -> None:
    print(json.dumps(payload, indent=2, ensure_ascii=True))


if ctk is not None:
    class GardenApp(ctk.CTk):
        def __init__(self, runtime: KaylasGardenRuntime):
            super().__init__()
            self.runtime = runtime
            self.selected_image_path: Optional[str] = None
            self.selected_guide_image_path: Optional[str] = None
            self.selected_lab_image_path: Optional[str] = None
            self.plant_lookup: Dict[str, str] = {}
            self.status_var = tk.StringVar(value="Garden runtime ready.")
            self.observe_plant_var = tk.StringVar(value="")
            self.care_plant_var = tk.StringVar(value="")
            self.guide_plant_var = tk.StringVar(value="")
            self.lab_plant_var = tk.StringVar(value="")
            self.community_plant_var = tk.StringVar(value="")
            self.guide_thread_var = tk.StringVar(value="")
            self.network_mode_var = tk.StringVar(value="local-first")
            self.local_first_var = tk.StringVar(value="on")
            self.cloud_mode_var = tk.StringVar(value="off")
            self.ipfs_enabled_var = tk.StringVar(value="off")
            self.ipfs_daemon_enabled_var = tk.StringVar(value="off")
            self.ipfs_daemon_auto_install_var = tk.StringVar(value="off")
            self.ipfs_daemon_auto_start_var = tk.StringVar(value="off")
            self.hive_enabled_var = tk.StringVar(value="off")
            self.hive_broadcast_var = tk.StringVar(value="off")

            self.title("Kayla's Garden Studio")
            self.geometry("1420x940")
            self.minsize(1180, 820)
            self.grid_columnconfigure(1, weight=1)
            self.grid_rowconfigure(0, weight=1)

            self._build_sidebar()
            self._build_tabs()
            self.tabs.set("Start Here")
            self.refresh_all()

        def _build_sidebar(self) -> None:
            sidebar = ctk.CTkFrame(self, width=320, corner_radius=0)
            sidebar.grid(row=0, column=0, sticky="nsew")
            sidebar.grid_rowconfigure(99, weight=1)

            ctk.CTkLabel(
                sidebar,
                text="Kayla's Garden",
                font=ctk.CTkFont(size=26, weight="bold"),
            ).grid(row=0, column=0, padx=20, pady=(24, 6), sticky="w")
            ctk.CTkLabel(
                sidebar,
                text="Local-first plant intelligence with better chat surfaces, IPFS publishing lanes, and Hive trust anchors.",
                wraplength=270,
                justify="left",
                text_color="#B7D7B0",
            ).grid(row=1, column=0, padx=20, pady=(0, 18), sticky="w")

            self.identity_label = ctk.CTkLabel(sidebar, text="", wraplength=270, justify="left")
            self.identity_label.grid(row=2, column=0, padx=20, pady=(0, 16), sticky="w")

            ctk.CTkButton(sidebar, text="Refresh", command=self.refresh_all).grid(row=3, column=0, padx=20, pady=6, sticky="ew")
            ctk.CTkButton(sidebar, text="Start Here", command=lambda: self.tabs.set("Start Here")).grid(row=4, column=0, padx=20, pady=6, sticky="ew")
            ctk.CTkButton(sidebar, text="Plant Health Chat", command=lambda: self.tabs.set("Guide")).grid(row=5, column=0, padx=20, pady=6, sticky="ew")
            ctk.CTkButton(sidebar, text="Network Surface", command=lambda: self.tabs.set("Network Surface")).grid(row=6, column=0, padx=20, pady=6, sticky="ew")
            ctk.CTkButton(sidebar, text="Trust Lab", command=lambda: self.tabs.set("Trust Lab")).grid(row=7, column=0, padx=20, pady=6, sticky="ew")
            ctk.CTkButton(sidebar, text="Bootstrap Repo Data", command=self.on_bootstrap).grid(row=8, column=0, padx=20, pady=6, sticky="ew")
            ctk.CTkButton(sidebar, text="Verify LiteRT Model", command=self.on_verify_model).grid(row=9, column=0, padx=20, pady=6, sticky="ew")
            ctk.CTkButton(sidebar, text="Download LiteRT Model", command=self.on_download_model).grid(row=10, column=0, padx=20, pady=6, sticky="ew")

            self.sidebar_metrics = self._make_textbox(sidebar, height=220)
            self.sidebar_metrics.grid(row=11, column=0, padx=20, pady=(16, 10), sticky="nsew")

            ctk.CTkLabel(
                sidebar,
                textvariable=self.status_var,
                wraplength=270,
                justify="left",
                text_color="#D6E8CF",
            ).grid(row=100, column=0, padx=20, pady=(12, 24), sticky="sw")

        def _make_textbox(self, parent: Any, height: int = 180) -> Any:
            box = ctk.CTkTextbox(
                parent,
                height=height,
                corner_radius=16,
                border_width=1,
                border_color=("#D7E7D7", "#35553D"),
            )
            textbox = getattr(box, "_textbox", None)
            if textbox is not None:
                textbox.configure(wrap="word", padx=12, pady=12, spacing1=2, spacing3=4)
            return box

        def _make_section_text(self, parent: Any, title: str, body: str, row: int, column: int = 0, *, height: int = 180) -> Any:
            card = ctk.CTkFrame(parent)
            card.grid(row=row, column=column, padx=18, pady=(0, 16), sticky="nsew")
            card.grid_columnconfigure(0, weight=1)
            card.grid_rowconfigure(1, weight=1)
            ctk.CTkLabel(card, text=title, font=ctk.CTkFont(size=18, weight="bold")).grid(
                row=0, column=0, padx=16, pady=(16, 10), sticky="w"
            )
            box = self._make_textbox(card, height=height)
            box.grid(row=1, column=0, padx=16, pady=(0, 16), sticky="nsew")
            self._set_text(box, body)
            return box

        def _field_label(self, parent: Any, row: int, title: str, description: str = "") -> None:
            ctk.CTkLabel(parent, text=title, font=ctk.CTkFont(size=14, weight="bold")).grid(
                row=row, column=0, padx=18, pady=(10, 2), sticky="w"
            )
            if description:
                ctk.CTkLabel(
                    parent,
                    text=description,
                    wraplength=420,
                    justify="left",
                    text_color=("#556B57", "#B7D7B0"),
                ).grid(row=row + 1, column=0, padx=18, pady=(0, 4), sticky="w")

        def _kv_lines(self, pairs: Iterable[Tuple[str, Any]]) -> str:
            return "\n".join(f"{label}: {value}" for label, value in pairs)

        def _build_tabs(self) -> None:
            self.tabs = ctk.CTkTabview(self)
            self.tabs.grid(row=0, column=1, sticky="nsew", padx=18, pady=18)
            self.tabs.add("Start Here")
            self.tabs.add("Dashboard")
            self.tabs.add("Plants")
            self.tabs.add("Observe")
            self.tabs.add("Guide")
            self.tabs.add("Care Lab")
            self.tabs.add("Network Surface")
            self.tabs.add("Trust Lab")
            self.tabs.add("Community")
            self.tabs.add("Insights")
            self.tabs.add("Settings")
            self.tabs.add("Models")

            self._build_start_here_tab(self.tabs.tab("Start Here"))
            self._build_dashboard_tab(self.tabs.tab("Dashboard"))
            self._build_plants_tab(self.tabs.tab("Plants"))
            self._build_observe_tab(self.tabs.tab("Observe"))
            self._build_guide_tab(self.tabs.tab("Guide"))
            self._build_care_lab_tab(self.tabs.tab("Care Lab"))
            self._build_network_surface_tab(self.tabs.tab("Network Surface"))
            self._build_trust_lab_tab(self.tabs.tab("Trust Lab"))
            self._build_community_tab(self.tabs.tab("Community"))
            self._build_insights_tab(self.tabs.tab("Insights"))
            self._build_network_tab(self.tabs.tab("Settings"))
            self._build_models_tab(self.tabs.tab("Models"))

        def _build_start_here_tab(self, tab: Any) -> None:
            tab.grid_columnconfigure(0, weight=3)
            tab.grid_columnconfigure(1, weight=2)
            tab.grid_rowconfigure(0, weight=1)

            left = ctk.CTkFrame(tab)
            left.grid(row=0, column=0, padx=18, pady=18, sticky="nsew")
            left.grid_columnconfigure(0, weight=1)
            left.grid_rowconfigure(3, weight=1)

            ctk.CTkLabel(left, text="Start Here", font=ctk.CTkFont(size=26, weight="bold")).grid(
                row=0, column=0, padx=18, pady=(18, 8), sticky="w"
            )
            ctk.CTkLabel(
                left,
                text="Set up the local vault first, then connect IPFS and Hive when you are ready to publish signed evidence outside the device.",
                wraplength=760,
                justify="left",
                text_color="#B7D7B0",
            ).grid(row=1, column=0, padx=18, pady=(0, 14), sticky="w")
            quick = ctk.CTkFrame(left)
            quick.grid(row=2, column=0, padx=18, pady=(0, 16), sticky="ew")
            for idx in range(4):
                quick.grid_columnconfigure(idx, weight=1)
            ctk.CTkButton(quick, text="Open Settings", command=lambda: self.tabs.set("Settings")).grid(row=0, column=0, padx=(0, 8), sticky="ew")
            ctk.CTkButton(quick, text="Add First Plant", command=lambda: self.tabs.set("Plants")).grid(row=0, column=1, padx=8, sticky="ew")
            ctk.CTkButton(quick, text="Publish Observation", command=lambda: self.tabs.set("Observe")).grid(row=0, column=2, padx=8, sticky="ew")
            ctk.CTkButton(quick, text="Open Trust Lab", command=lambda: self.tabs.set("Trust Lab")).grid(row=0, column=3, padx=(8, 0), sticky="ew")
            self.start_here_text = self._make_textbox(left, height=520)
            self.start_here_text.grid(row=3, column=0, padx=18, pady=(0, 18), sticky="nsew")

            right = ctk.CTkFrame(tab)
            right.grid(row=0, column=1, padx=(0, 18), pady=18, sticky="nsew")
            right.grid_columnconfigure(0, weight=1)
            right.grid_rowconfigure(1, weight=1)
            right.grid_rowconfigure(3, weight=1)
            ctk.CTkLabel(right, text="Setup Checklist", font=ctk.CTkFont(size=20, weight="bold")).grid(
                row=0, column=0, padx=18, pady=(18, 10), sticky="w"
            )
            self.start_checklist_text = self._make_textbox(right, height=220)
            self.start_checklist_text.grid(row=1, column=0, padx=18, pady=(0, 16), sticky="nsew")
            ctk.CTkLabel(right, text="Publish Lanes", font=ctk.CTkFont(size=18, weight="bold")).grid(
                row=2, column=0, padx=18, pady=(0, 10), sticky="w"
            )
            self.start_publish_lanes_text = self._make_textbox(right, height=220)
            self.start_publish_lanes_text.grid(row=3, column=0, padx=18, pady=(0, 18), sticky="nsew")

        def _build_dashboard_tab(self, tab: Any) -> None:
            tab.grid_columnconfigure(0, weight=3)
            tab.grid_columnconfigure(1, weight=2)
            tab.grid_rowconfigure(1, weight=1)

            ctk.CTkLabel(tab, text="Garden Overview", font=ctk.CTkFont(size=24, weight="bold")).grid(
                row=0, column=0, padx=18, pady=(18, 8), sticky="w"
            )
            ctk.CTkLabel(
                tab,
                text="Operational view of the garden: readiness, recent activity, queues, and where the next useful action lives.",
                wraplength=820,
                justify="left",
                text_color="#B7D7B0",
            ).grid(row=0, column=1, padx=(0, 18), pady=(18, 8), sticky="e")
            self.dashboard_summary = self._make_textbox(tab, height=540)
            self.dashboard_summary.grid(row=1, column=0, padx=18, pady=(0, 18), sticky="nsew")

            right = ctk.CTkFrame(tab)
            right.grid(row=1, column=1, padx=(0, 18), pady=(0, 18), sticky="nsew")
            right.grid_rowconfigure(1, weight=1)
            right.grid_columnconfigure(0, weight=1)

            ctk.CTkLabel(right, text="Anchor + Sync Queue", font=ctk.CTkFont(size=18, weight="bold")).grid(
                row=0, column=0, padx=18, pady=(18, 10), sticky="w"
            )
            self.dashboard_queue = self._make_textbox(right, height=540)
            self.dashboard_queue.grid(row=1, column=0, padx=18, pady=(0, 18), sticky="nsew")

        def _build_plants_tab(self, tab: Any) -> None:
            tab.grid_columnconfigure(0, weight=2)
            tab.grid_columnconfigure(1, weight=3)
            tab.grid_rowconfigure(1, weight=1)

            form = ctk.CTkFrame(tab)
            form.grid(row=0, column=0, rowspan=2, padx=18, pady=18, sticky="nsew")
            form.grid_columnconfigure(0, weight=1)

            ctk.CTkLabel(form, text="Create Plant Passport", font=ctk.CTkFont(size=20, weight="bold")).grid(
                row=0, column=0, padx=18, pady=(18, 6), sticky="w"
            )
            ctk.CTkLabel(
                form,
                text="A plant passport is the long-lived record for one plant or bed. Add rough context now; you can refine details later as evidence grows.",
                wraplength=420,
                justify="left",
                text_color="#B7D7B0",
            ).grid(row=1, column=0, padx=18, pady=(0, 8), sticky="w")

            self._field_label(form, 2, "Plant name", "Short label used everywhere in threads, observations, and exports.")
            self.plant_name_entry = ctk.CTkEntry(form, placeholder_text="Tomato bed A / Aloe on porch / Lemon tree")
            self.plant_name_entry.grid(row=4, column=0, padx=18, pady=6, sticky="ew")
            self._field_label(form, 5, "Species or broad type", "Use the common name if you do not know the cultivar yet.")
            self.plant_species_entry = ctk.CTkEntry(form, placeholder_text="Tomato, pothos, basil, citrus...")
            self.plant_species_entry.grid(row=7, column=0, padx=18, pady=6, sticky="ew")
            self._field_label(form, 8, "Hardiness zone", "Optional. Helps later when you compare care and seasonal risk.")
            self.plant_zone_entry = ctk.CTkEntry(form, placeholder_text="9b / 6a / greenhouse / indoor")
            self.plant_zone_entry.grid(row=10, column=0, padx=18, pady=6, sticky="ew")
            self._field_label(form, 11, "Context notes", "Capture bed location, light, watering habits, transplant history, or anything that will matter six weeks from now.")
            self.plant_notes_box = self._make_textbox(form, height=150)
            self.plant_notes_box.grid(row=13, column=0, padx=18, pady=6, sticky="ew")
            self.plant_notes_box.insert("1.0", "Example:\n- East raised bed\n- Afternoon sun only\n- Transplanted 5 days ago\n- Soil dries fast near the walkway")
            self._field_label(form, 14, "Privacy class", "Private stays local. Shared is intended for trusted peers. Public is suitable for broader evidence surfaces.")
            self.plant_privacy_menu = ctk.CTkOptionMenu(form, values=["private", "shared", "public"])
            self.plant_privacy_menu.grid(row=16, column=0, padx=18, pady=6, sticky="ew")
            ctk.CTkButton(form, text="Add Plant Passport", command=self.on_add_plant).grid(
                row=17, column=0, padx=18, pady=(12, 18), sticky="ew"
            )

            right = ctk.CTkFrame(tab)
            right.grid(row=0, column=1, rowspan=2, padx=(0, 18), pady=18, sticky="nsew")
            right.grid_columnconfigure(0, weight=1)
            right.grid_rowconfigure(1, weight=1)
            right.grid_rowconfigure(6, weight=1)

            ctk.CTkLabel(right, text="Plant Passports", font=ctk.CTkFont(size=20, weight="bold")).grid(
                row=0, column=0, padx=18, pady=(18, 10), sticky="w"
            )
            self.plants_text = self._make_textbox(right, height=320)
            self.plants_text.grid(row=1, column=0, padx=18, pady=(0, 16), sticky="nsew")

            self._field_label(right, 2, "Generate a care brief", "Pick one plant and ask for the next inspection plan, watering checkpoints, or risk summary.")
            self.care_picker = ctk.CTkOptionMenu(right, variable=self.care_plant_var, values=["No plants yet"])
            self.care_picker.grid(row=4, column=0, padx=18, pady=6, sticky="ew")
            self.care_question_entry = ctk.CTkEntry(right, placeholder_text="What should I watch over the next 3 days?")
            self.care_question_entry.grid(row=5, column=0, padx=18, pady=6, sticky="ew")
            ctk.CTkButton(right, text="Generate Care Brief", command=self.on_care_brief).grid(
                row=6, column=0, padx=18, pady=(6, 10), sticky="new"
            )
            self.care_text = self._make_textbox(right, height=220)
            self.care_text.grid(row=7, column=0, padx=18, pady=(0, 18), sticky="nsew")

        def _build_observe_tab(self, tab: Any) -> None:
            tab.grid_columnconfigure(0, weight=2)
            tab.grid_columnconfigure(1, weight=3)
            tab.grid_rowconfigure(1, weight=1)

            form = ctk.CTkFrame(tab)
            form.grid(row=0, column=0, rowspan=2, padx=18, pady=18, sticky="nsew")
            form.grid_columnconfigure(0, weight=1)

            ctk.CTkLabel(form, text="Observation Studio", font=ctk.CTkFont(size=20, weight="bold")).grid(
                row=0, column=0, padx=18, pady=(18, 6), sticky="w"
            )
            ctk.CTkLabel(
                form,
                text="Capture one field observation at a time. The goal is a replayable evidence record: what plant, where, what changed, and how certain you are.",
                wraplength=420,
                justify="left",
                text_color="#B7D7B0",
            ).grid(row=1, column=0, padx=18, pady=(0, 8), sticky="w")
            self._field_label(form, 2, "Target plant", "Attach the observation to an existing passport so timelines and chat threads can reuse it.")
            self.observe_picker = ctk.CTkOptionMenu(form, variable=self.observe_plant_var, values=["No plants yet"])
            self.observe_picker.grid(row=4, column=0, padx=18, pady=6, sticky="ew")
            self._field_label(form, 5, "Latitude", "Optional. Leave blank if you do not want location context stored.")
            self.observe_lat_entry = ctk.CTkEntry(form, placeholder_text="37.4219")
            self.observe_lat_entry.grid(row=7, column=0, padx=18, pady=6, sticky="ew")
            self._field_label(form, 8, "Longitude", "Optional. Used only when you want GeoPetal-style coarse location proof.")
            self.observe_lon_entry = ctk.CTkEntry(form, placeholder_text="-122.0840")
            self.observe_lon_entry.grid(row=10, column=0, padx=18, pady=6, sticky="ew")
            self._field_label(form, 11, "Manual tags", "Examples: mildew, transplant-shock, aphids, flowering, drought-stress.")
            self.observe_tags_entry = ctk.CTkEntry(form, placeholder_text="yellowing, lower-leaves, humid-week")
            self.observe_tags_entry.grid(row=13, column=0, padx=18, pady=6, sticky="ew")
            self._field_label(form, 14, "Observation privacy", "Use the privacy lane that matches how widely this evidence may be shared.")
            self.observe_privacy_menu = ctk.CTkOptionMenu(form, values=["private", "shared", "public"])
            self.observe_privacy_menu.grid(row=16, column=0, padx=18, pady=6, sticky="ew")
            self._field_label(form, 17, "Observation note", "Write what you can actually see, smell, measure, or compare to earlier visits.")
            self.observe_note_box = self._make_textbox(form, height=220)
            self.observe_note_box.grid(row=19, column=0, padx=18, pady=6, sticky="ew")
            self.observe_note_box.insert("1.0", "Example:\n- Spots started 2 days ago\n- Only on older leaves\n- Soil still moist\n- Recent weather: warm + humid\n- No visible insect trails yet")
            ctk.CTkButton(form, text="Choose Plant Image", command=self.on_pick_image).grid(
                row=20, column=0, padx=18, pady=(8, 6), sticky="ew"
            )
            self.image_path_label = ctk.CTkLabel(form, text="No image selected", wraplength=320, justify="left")
            self.image_path_label.grid(row=21, column=0, padx=18, pady=(0, 8), sticky="w")
            ctk.CTkButton(form, text="Identify + Publish to LeafVault", command=self.on_publish_observation).grid(
                row=22, column=0, padx=18, pady=(8, 18), sticky="ew"
            )

            right = ctk.CTkFrame(tab)
            right.grid(row=0, column=1, rowspan=2, padx=(0, 18), pady=18, sticky="nsew")
            right.grid_columnconfigure(0, weight=1)
            right.grid_rowconfigure(1, weight=1)

            ctk.CTkLabel(right, text="Published Observation", font=ctk.CTkFont(size=20, weight="bold")).grid(
                row=0, column=0, padx=18, pady=(18, 10), sticky="w"
            )
            self.observe_result = self._make_textbox(right, height=660)
            self.observe_result.grid(row=1, column=0, padx=18, pady=(0, 18), sticky="nsew")

        def _build_guide_tab(self, tab: Any) -> None:
            tab.grid_columnconfigure(0, weight=2)
            tab.grid_columnconfigure(1, weight=4)
            tab.grid_rowconfigure(0, weight=1)

            left = ctk.CTkFrame(tab)
            left.grid(row=0, column=0, padx=18, pady=18, sticky="nsew")
            left.grid_columnconfigure(0, weight=1)
            left.grid_rowconfigure(7, weight=1)

            ctk.CTkLabel(left, text="Plant Health Chat", font=ctk.CTkFont(size=22, weight="bold")).grid(
                row=0, column=0, padx=18, pady=(18, 8), sticky="w"
            )
            ctk.CTkLabel(
                left,
                text="A longer-running, thread-based diagnostic surface. Keep separate threads for recovery, disease investigation, propagation, or public case-note drafting.",
                wraplength=360,
                justify="left",
                text_color="#B7D7B0",
            ).grid(row=1, column=0, padx=18, pady=(0, 12), sticky="w")
            self.guide_picker = ctk.CTkOptionMenu(left, variable=self.guide_plant_var, values=["No plants yet"], command=lambda _=None: self._refresh_guide_threads_ui())
            self.guide_picker.grid(row=2, column=0, padx=18, pady=6, sticky="ew")

            thread_row = ctk.CTkFrame(left, fg_color="transparent")
            thread_row.grid(row=3, column=0, padx=18, pady=6, sticky="ew")
            thread_row.grid_columnconfigure(0, weight=1)
            thread_row.grid_columnconfigure(1, weight=0)
            self.guide_thread_picker = ctk.CTkOptionMenu(thread_row, variable=self.guide_thread_var, values=["Start a thread"], command=lambda _=None: self._refresh_guide_threads_ui())
            self.guide_thread_picker.grid(row=0, column=0, padx=(0, 8), sticky="ew")
            ctk.CTkButton(thread_row, text="New Thread", width=110, command=self.on_new_guide_thread).grid(row=0, column=1, sticky="ew")

            self.guide_thread_summary = self._make_textbox(left, height=150)
            self.guide_thread_summary.grid(row=4, column=0, padx=18, pady=(8, 10), sticky="ew")

            ctk.CTkLabel(left, text="Prompt Composer", font=ctk.CTkFont(size=17, weight="bold")).grid(
                row=5, column=0, padx=18, pady=(0, 8), sticky="w"
            )
            self.guide_question_box = self._make_textbox(left, height=180)
            self.guide_question_box.grid(row=6, column=0, padx=18, pady=6, sticky="ew")
            self.guide_question_box.insert(
                "1.0",
                "Tell me what changed since the last photos, what looks most likely right now, and what I should inspect next.",
            )
            controls = ctk.CTkFrame(left, fg_color="transparent")
            controls.grid(row=7, column=0, padx=18, pady=(8, 12), sticky="ew")
            controls.grid_columnconfigure(0, weight=1)
            controls.grid_columnconfigure(1, weight=1)
            controls.grid_columnconfigure(2, weight=1)
            ctk.CTkButton(controls, text="Attach Context Image", command=self.on_pick_guide_image).grid(row=0, column=0, padx=(0, 8), sticky="ew")
            ctk.CTkButton(controls, text="Send To Thread", command=self.on_chat_with_plant).grid(row=0, column=1, padx=8, sticky="ew")
            ctk.CTkButton(controls, text="Create Draft Thread", command=self.on_new_guide_thread).grid(row=0, column=2, padx=(8, 0), sticky="ew")
            self.guide_image_path_label = ctk.CTkLabel(left, text="No current guide image selected", wraplength=360, justify="left")
            self.guide_image_path_label.grid(row=8, column=0, padx=18, pady=(0, 18), sticky="w")

            right = ctk.CTkFrame(tab)
            right.grid(row=0, column=1, padx=(0, 18), pady=18, sticky="nsew")
            right.grid_columnconfigure(0, weight=1)
            right.grid_rowconfigure(1, weight=1)
            right.grid_rowconfigure(3, weight=0)
            right.grid_rowconfigure(5, weight=0)

            ctk.CTkLabel(right, text="Active Thread", font=ctk.CTkFont(size=20, weight="bold")).grid(
                row=0, column=0, padx=18, pady=(18, 10), sticky="w"
            )
            self.guide_result = self._make_textbox(right, height=430)
            self.guide_result.grid(row=1, column=0, padx=18, pady=(0, 16), sticky="nsew")
            ctk.CTkLabel(right, text="Suggested Next Prompts", font=ctk.CTkFont(size=18, weight="bold")).grid(
                row=2, column=0, padx=18, pady=(0, 10), sticky="w"
            )
            self.guide_suggestions = self._make_textbox(right, height=150)
            self.guide_suggestions.grid(row=3, column=0, padx=18, pady=(0, 18), sticky="ew")

        def _build_network_surface_tab(self, tab: Any) -> None:
            tab.grid_columnconfigure(0, weight=3)
            tab.grid_columnconfigure(1, weight=2)
            tab.grid_rowconfigure(0, weight=1)

            left = ctk.CTkFrame(tab)
            left.grid(row=0, column=0, padx=18, pady=18, sticky="nsew")
            left.grid_columnconfigure(0, weight=1)
            left.grid_rowconfigure(1, weight=1)
            ctk.CTkLabel(left, text="IPFS + Hive Surface", font=ctk.CTkFont(size=24, weight="bold")).grid(
                row=0, column=0, padx=18, pady=(18, 8), sticky="w"
            )
            self.network_surface_text = self._make_textbox(left)
            self.network_surface_text.grid(row=1, column=0, padx=18, pady=(0, 18), sticky="nsew")

            right = ctk.CTkFrame(tab)
            right.grid(row=0, column=1, padx=(0, 18), pady=18, sticky="nsew")
            right.grid_columnconfigure(0, weight=1)
            right.grid_rowconfigure(1, weight=1)
            right.grid_rowconfigure(3, weight=1)
            ctk.CTkLabel(right, text="Trust Feed", font=ctk.CTkFont(size=20, weight="bold")).grid(
                row=0, column=0, padx=18, pady=(18, 10), sticky="w"
            )
            self.network_surface_feed = self._make_textbox(right, height=220)
            self.network_surface_feed.grid(row=1, column=0, padx=18, pady=(0, 16), sticky="nsew")
            ctk.CTkLabel(right, text="Design Tracks", font=ctk.CTkFont(size=18, weight="bold")).grid(
                row=2, column=0, padx=18, pady=(0, 10), sticky="w"
            )
            self.network_surface_design = self._make_textbox(right, height=220)
            self.network_surface_design.grid(row=3, column=0, padx=18, pady=(0, 18), sticky="nsew")

        def _build_care_lab_tab(self, tab: Any) -> None:
            tab.grid_columnconfigure(0, weight=2)
            tab.grid_columnconfigure(1, weight=3)
            tab.grid_rowconfigure(0, weight=1)

            left = ctk.CTkFrame(tab)
            left.grid(row=0, column=0, padx=18, pady=18, sticky="nsew")
            left.grid_columnconfigure(0, weight=1)

            ctk.CTkLabel(left, text="Diagnosis + Health Check-Ins", font=ctk.CTkFont(size=20, weight="bold")).grid(
                row=0, column=0, padx=18, pady=(18, 8), sticky="w"
            )
            ctk.CTkLabel(
                left,
                text="The Care Lab turns observations into action. Run a diagnosis when something changes fast; save check-ins to track whether the plant is improving or degrading.",
                wraplength=420,
                justify="left",
                text_color="#B7D7B0",
            ).grid(row=1, column=0, padx=18, pady=(0, 8), sticky="w")
            self._field_label(left, 2, "Plant", "Choose the passport this diagnosis or check-in belongs to.")
            self.lab_picker = ctk.CTkOptionMenu(left, variable=self.lab_plant_var, values=["No plants yet"])
            self.lab_picker.grid(row=4, column=0, padx=18, pady=6, sticky="ew")
            self._field_label(left, 5, "Case tags", "Use structured tags so similar issues can be grouped later.")
            self.lab_tags_entry = ctk.CTkEntry(left, placeholder_text="fungal-risk, watering, pests, recovery")
            self.lab_tags_entry.grid(row=7, column=0, padx=18, pady=6, sticky="ew")
            self._field_label(left, 8, "Diagnosis request", "Describe symptom pattern, spread speed, what changed recently, and what evidence is missing.")
            self.diagnosis_note_box = self._make_textbox(left, height=180)
            self.diagnosis_note_box.grid(row=10, column=0, padx=18, pady=6, sticky="ew")
            self.diagnosis_note_box.insert("1.0", "Example:\n- White powder started on lower leaves\n- Spread after 3 humid nights\n- Upper growth still looks normal\n- Need help separating mildew from residue")
            ctk.CTkButton(left, text="Choose Diagnosis Image", command=self.on_pick_lab_image).grid(
                row=11, column=0, padx=18, pady=(8, 6), sticky="ew"
            )
            self.lab_image_path_label = ctk.CTkLabel(left, text="No diagnosis/check-in image selected", wraplength=320, justify="left")
            self.lab_image_path_label.grid(row=12, column=0, padx=18, pady=(0, 8), sticky="w")
            ctk.CTkButton(left, text="Run Problem Diagnosis", command=self.on_diagnose_problem).grid(
                row=13, column=0, padx=18, pady=(8, 16), sticky="ew"
            )
            self._field_label(left, 14, "Health check-in note", "Use this after treatment or routine inspection to record whether the plant is recovering.")
            self.checkin_note_box = self._make_textbox(left, height=140)
            self.checkin_note_box.grid(row=16, column=0, padx=18, pady=6, sticky="ew")
            self.checkin_note_box.insert("1.0", "Example:\n- New growth looks clean\n- Spots have stopped spreading\n- Topsoil still wet by evening\n- Recheck underside of leaves tomorrow")
            ctk.CTkButton(left, text="Save Health Check-In", command=self.on_record_health_checkin).grid(
                row=17, column=0, padx=18, pady=(8, 18), sticky="ew"
            )

            right = ctk.CTkFrame(tab)
            right.grid(row=0, column=1, padx=(0, 18), pady=18, sticky="nsew")
            right.grid_columnconfigure(0, weight=1)
            right.grid_rowconfigure(11, weight=1)

            ctk.CTkLabel(right, text="Shared Technique Card", font=ctk.CTkFont(size=20, weight="bold")).grid(
                row=0, column=0, padx=18, pady=(18, 8), sticky="w"
            )
            ctk.CTkLabel(
                right,
                text="Convert a successful response into a reusable technique. These cards can later be anchored, reviewed, and cited in public evidence flows.",
                wraplength=520,
                justify="left",
                text_color="#B7D7B0",
            ).grid(row=1, column=0, padx=18, pady=(0, 8), sticky="w")
            self._field_label(right, 2, "Technique title", "Name the pattern, not just the plant. Example: prune + airflow reset for early mildew.")
            self.technique_title_entry = ctk.CTkEntry(right, placeholder_text="Technique title")
            self.technique_title_entry.grid(row=4, column=0, padx=18, pady=6, sticky="ew")
            self._field_label(right, 5, "Problem focus", "What problem or condition this technique is meant to address.")
            self.technique_problem_entry = ctk.CTkEntry(right, placeholder_text="powdery mildew / transplant shock / droop after heat")
            self.technique_problem_entry.grid(row=7, column=0, padx=18, pady=6, sticky="ew")
            self._field_label(right, 8, "Technique tags", "Structured tags make it easier to search across future technique cards.")
            self.technique_tags_entry = ctk.CTkEntry(right, placeholder_text="airflow, prune, isolate, humidity")
            self.technique_tags_entry.grid(row=10, column=0, padx=18, pady=6, sticky="ew")
            self.technique_privacy_menu = ctk.CTkOptionMenu(right, values=["private", "shared", "public"])
            self.technique_privacy_menu.grid(row=11, column=0, padx=18, pady=6, sticky="ew")
            self._field_label(right, 12, "Summary", "When it helped, what constraints matter, and what signs would make you stop using it.")
            self.technique_summary_box = self._make_textbox(right, height=120)
            self.technique_summary_box.grid(row=14, column=0, padx=18, pady=6, sticky="ew")
            self.technique_summary_box.insert("1.0", "Example:\nWorked when symptoms were early and airflow was poor. Avoid if tissue is already collapsing or sun exposure is extreme.")
            self._field_label(right, 15, "Steps", "One step per line so the card can later be rendered as a checklist or reversible playbook.")
            self.technique_steps_box = self._make_textbox(right, height=120)
            self.technique_steps_box.grid(row=17, column=0, padx=18, pady=6, sticky="ew")
            self.technique_steps_box.insert("1.0", "Inspect underside of leaves\nRemove worst-hit leaves\nIncrease spacing / airflow\nRe-check after 24 hours")
            ctk.CTkButton(right, text="Publish Shared Technique", command=self.on_publish_technique).grid(
                row=18, column=0, padx=18, pady=(8, 10), sticky="new"
            )
            self.care_lab_result = self._make_textbox(right, height=220)
            self.care_lab_result.grid(row=19, column=0, padx=18, pady=(0, 18), sticky="nsew")

        def _build_insights_tab(self, tab: Any) -> None:
            tab.grid_columnconfigure(0, weight=2)
            tab.grid_columnconfigure(1, weight=3)
            tab.grid_rowconfigure(0, weight=1)

            left = ctk.CTkFrame(tab)
            left.grid(row=0, column=0, padx=18, pady=18, sticky="nsew")
            left.grid_columnconfigure(0, weight=1)
            left.grid_rowconfigure(1, weight=1)
            left.grid_rowconfigure(3, weight=1)
            ctk.CTkLabel(left, text="Garden Digest", font=ctk.CTkFont(size=20, weight="bold")).grid(
                row=0, column=0, padx=18, pady=(18, 10), sticky="w"
            )
            self.insights_digest = self._make_textbox(left, height=220)
            self.insights_digest.grid(row=1, column=0, padx=18, pady=(0, 16), sticky="nsew")
            ctk.CTkLabel(left, text="Watchlist", font=ctk.CTkFont(size=18, weight="bold")).grid(
                row=2, column=0, padx=18, pady=(0, 10), sticky="w"
            )
            self.insights_watchlist = self._make_textbox(left, height=320)
            self.insights_watchlist.grid(row=3, column=0, padx=18, pady=(0, 18), sticky="nsew")

            right = ctk.CTkFrame(tab)
            right.grid(row=0, column=1, padx=(0, 18), pady=18, sticky="nsew")
            right.grid_columnconfigure(0, weight=1)
            right.grid_rowconfigure(1, weight=1)
            ctk.CTkLabel(right, text="Activity Timeline", font=ctk.CTkFont(size=20, weight="bold")).grid(
                row=0, column=0, padx=18, pady=(18, 10), sticky="w"
            )
            self.insights_activity = self._make_textbox(right, height=620)
            self.insights_activity.grid(row=1, column=0, padx=18, pady=(0, 18), sticky="nsew")

        def _build_trust_lab_tab(self, tab: Any) -> None:
            tab.grid_columnconfigure(0, weight=2)
            tab.grid_columnconfigure(1, weight=3)
            tab.grid_rowconfigure(0, weight=1)

            left = ctk.CTkFrame(tab)
            left.grid(row=0, column=0, padx=18, pady=18, sticky="nsew")
            left.grid_columnconfigure(0, weight=1)
            left.grid_rowconfigure(1, weight=1)
            left.grid_rowconfigure(3, weight=1)
            ctk.CTkLabel(left, text="Trust Lab", font=ctk.CTkFont(size=22, weight="bold")).grid(
                row=0, column=0, padx=18, pady=(18, 10), sticky="w"
            )
            self.trust_lab_blueprint = self._make_textbox(left, height=260)
            self.trust_lab_blueprint.grid(row=1, column=0, padx=18, pady=(0, 16), sticky="nsew")
            ctk.CTkLabel(left, text="Information Stake", font=ctk.CTkFont(size=18, weight="bold")).grid(
                row=2, column=0, padx=18, pady=(0, 10), sticky="w"
            )
            self.trust_lab_stake = self._make_textbox(left, height=220)
            self.trust_lab_stake.grid(row=3, column=0, padx=18, pady=(0, 18), sticky="nsew")

            right = ctk.CTkFrame(tab)
            right.grid(row=0, column=1, padx=(0, 18), pady=18, sticky="nsew")
            right.grid_columnconfigure(0, weight=1)
            right.grid_rowconfigure(1, weight=1)
            right.grid_rowconfigure(3, weight=1)
            ctk.CTkLabel(right, text="Claim Lifecycle", font=ctk.CTkFont(size=20, weight="bold")).grid(
                row=0, column=0, padx=18, pady=(18, 10), sticky="w"
            )
            self.trust_lab_claims = self._make_textbox(right, height=220)
            self.trust_lab_claims.grid(row=1, column=0, padx=18, pady=(0, 16), sticky="nsew")
            ctk.CTkLabel(right, text="Auditors + Quantum Risk Sim", font=ctk.CTkFont(size=18, weight="bold")).grid(
                row=2, column=0, padx=18, pady=(0, 10), sticky="w"
            )
            self.trust_lab_auditors = self._make_textbox(right, height=220)
            self.trust_lab_auditors.grid(row=3, column=0, padx=18, pady=(0, 18), sticky="nsew")

        def _build_community_tab(self, tab: Any) -> None:
            tab.grid_columnconfigure(0, weight=1)
            tab.grid_rowconfigure(0, weight=1)

            scroll = ctk.CTkScrollableFrame(tab)
            scroll.grid(row=0, column=0, padx=0, pady=0, sticky="nsew")
            scroll.grid_columnconfigure(0, weight=2)
            scroll.grid_columnconfigure(1, weight=3)

            left = ctk.CTkFrame(scroll)
            left.grid(row=0, column=0, padx=18, pady=18, sticky="new")
            left.grid_columnconfigure(0, weight=1)

            ctk.CTkLabel(left, text="Peer Gardeners", font=ctk.CTkFont(size=20, weight="bold")).grid(
                row=0, column=0, padx=18, pady=(18, 8), sticky="w"
            )
            ctk.CTkLabel(left, text="Register people you trust to exchange evidence, comments, and pin requests with.", wraplength=420, justify="left", text_color="#B7D7B0").grid(row=1, column=0, padx=18, pady=(0, 8), sticky="w")
            self._field_label(left, 2, "Display name", "Human-readable label for this peer inside your garden.")
            self.peer_display_name_entry = ctk.CTkEntry(left, placeholder_text="Avery from community garden")
            self.peer_display_name_entry.grid(row=4, column=0, padx=18, pady=6, sticky="ew")
            self._field_label(left, 5, "Hive username", "Optional public account used for comment threads or challenge-response linking.")
            self.peer_hive_username_entry = ctk.CTkEntry(left, placeholder_text="hive-handle")
            self.peer_hive_username_entry.grid(row=7, column=0, padx=18, pady=6, sticky="ew")
            self._field_label(left, 8, "IPFS user id / peer label", "Used when coordinating content pinning or portable evidence access.")
            self.peer_ipfs_user_id_entry = ctk.CTkEntry(left, placeholder_text="peer id or pin service handle")
            self.peer_ipfs_user_id_entry.grid(row=10, column=0, padx=18, pady=6, sticky="ew")
            self._field_label(left, 11, "Preferred pin group", "A logical community lane this peer usually participates in.")
            self.peer_pin_group_entry = ctk.CTkEntry(left, placeholder_text="tomatoes-west-bed / disease-watch")
            self.peer_pin_group_entry.grid(row=13, column=0, padx=18, pady=6, sticky="ew")
            self._field_label(left, 14, "Peer notes", "Capture trust context, expertise, or what kinds of evidence they tend to review well.")
            self.peer_notes_box = self._make_textbox(left, height=100)
            self.peer_notes_box.grid(row=16, column=0, padx=18, pady=6, sticky="ew")
            self.peer_notes_box.insert("1.0", "Example:\nStrong at tomato disease identification\nPrefers IPFS links over screenshots\nUsually responds within a day")
            ctk.CTkButton(left, text="Add Peer Gardener", command=self.on_add_peer_user).grid(row=17, column=0, padx=18, pady=(8, 18), sticky="ew")

            right = ctk.CTkFrame(scroll)
            right.grid(row=0, column=1, padx=(0, 18), pady=18, sticky="nsew")
            right.grid_columnconfigure(0, weight=1)
            right.grid_rowconfigure(16, weight=1)
            ctk.CTkLabel(right, text="Pin Group Surface", font=ctk.CTkFont(size=20, weight="bold")).grid(row=0, column=0, padx=18, pady=(18, 8), sticky="w")
            ctk.CTkLabel(right, text="Build shared lanes for comments, evidence linking, and pin requests.", wraplength=520, justify="left", text_color="#B7D7B0").grid(row=1, column=0, padx=18, pady=(0, 8), sticky="w")
            self._field_label(right, 2, "Pin group name", "A group can track one topic, one plant cluster, or one review lane.")
            self.community_group_name_entry = ctk.CTkEntry(right, placeholder_text="mildew-watch / seed-saving / orchid-lab")
            self.community_group_name_entry.grid(row=4, column=0, padx=18, pady=6, sticky="ew")
            self._field_label(right, 5, "Description", "Describe what belongs in this group and what kind of review you expect.")
            self.community_group_description_box = self._make_textbox(right, height=90)
            self.community_group_description_box.grid(row=7, column=0, padx=18, pady=6, sticky="ew")
            self.community_group_description_box.insert("1.0", "Example:\nUse this group for disease evidence packages from humid-week outbreaks in the west beds.")
            self._field_label(right, 8, "Privacy", "Shared is usually the right starting point for review groups.")
            self.community_group_privacy_menu = ctk.CTkOptionMenu(right, values=["private", "shared", "public"])
            self.community_group_privacy_menu.grid(row=10, column=0, padx=18, pady=6, sticky="ew")
            ctk.CTkButton(right, text="Create Pin Group", command=self.on_create_pin_group).grid(row=11, column=0, padx=18, pady=(8, 12), sticky="ew")
            self._field_label(right, 12, "Post a group comment", "Attach a note to one plant and optionally link target CIDs for peers to inspect.")
            self.community_post_plant_picker = ctk.CTkOptionMenu(right, variable=self.community_plant_var, values=["No plants yet"])
            self.community_post_plant_picker.grid(row=14, column=0, padx=18, pady=6, sticky="ew")
            self.community_target_cids_entry = ctk.CTkEntry(right, placeholder_text="CID1, CID2, CID3")
            self.community_target_cids_entry.grid(row=15, column=0, padx=18, pady=6, sticky="ew")
            self.community_comment_box = self._make_textbox(right, height=100)
            self.community_comment_box.grid(row=16, column=0, padx=18, pady=6, sticky="ew")
            self.community_comment_box.insert("1.0", "Example:\nAttached two evidence bundles from the same bed. Please compare lesion pattern and say whether this looks fungal or nutrient-linked.")
            ctk.CTkButton(right, text="Post Group Comment", command=self.on_post_pin_group_comment).grid(row=17, column=0, padx=18, pady=(8, 12), sticky="ew")
            self._field_label(right, 18, "Queue a peer pin request", "Ask selected peers to pin one CID for faster retrieval or wider availability.")
            self.community_pin_request_cid_entry = ctk.CTkEntry(right, placeholder_text="bafy...")
            self.community_pin_request_cid_entry.grid(row=20, column=0, padx=18, pady=6, sticky="ew")
            self.community_pin_request_peers_entry = ctk.CTkEntry(right, placeholder_text="peer-a, peer-b")
            self.community_pin_request_peers_entry.grid(row=21, column=0, padx=18, pady=6, sticky="ew")
            self.community_pin_request_note_box = self._make_textbox(right, height=80)
            self.community_pin_request_note_box.grid(row=22, column=0, padx=18, pady=6, sticky="ew")
            self.community_pin_request_note_box.insert("1.0", "Example:\nPlease pin this case report for the next week so the review team can fetch it quickly during audit.")
            ctk.CTkButton(right, text="Queue Peer Pin Request", command=self.on_request_peer_pin).grid(row=23, column=0, padx=18, pady=(8, 10), sticky="ew")
            self.community_result = self._make_textbox(right, height=260)
            self.community_result.grid(row=24, column=0, padx=18, pady=(0, 18), sticky="nsew")

        def _build_network_tab(self, tab: Any) -> None:
            tab.grid_columnconfigure(0, weight=1)
            tab.grid_rowconfigure(0, weight=1)

            scroll = ctk.CTkScrollableFrame(tab)
            scroll.grid(row=0, column=0, padx=0, pady=0, sticky="nsew")
            scroll.grid_columnconfigure(0, weight=2)
            scroll.grid_columnconfigure(1, weight=3)

            settings_frame = ctk.CTkFrame(scroll)
            settings_frame.grid(row=0, column=0, padx=18, pady=18, sticky="new")
            settings_frame.grid_columnconfigure(0, weight=1)

            ctk.CTkLabel(settings_frame, text="Garden Settings", font=ctk.CTkFont(size=20, weight="bold")).grid(row=0, column=0, padx=18, pady=(18, 8), sticky="w")
            ctk.CTkLabel(settings_frame, text="These settings define how the garden stores data locally and how it publishes to IPFS and Hive.", wraplength=440, justify="left", text_color="#B7D7B0").grid(row=1, column=0, padx=18, pady=(0, 8), sticky="w")
            self._field_label(settings_frame, 2, "Garden location", "Human-readable location for the garden itself. This is descriptive, not a precise GPS point.")
            self.location_entry = ctk.CTkEntry(settings_frame, placeholder_text="Backyard north fence / Balcony / Community plot B")
            self.location_entry.grid(row=4, column=0, padx=18, pady=6, sticky="ew")
            self._field_label(settings_frame, 5, "Theme", "A freeform tag for the garden's operating style or season.")
            self.theme_entry = ctk.CTkEntry(settings_frame, placeholder_text="spring recovery / disease-watch / seed-saving")
            self.theme_entry.grid(row=7, column=0, padx=18, pady=6, sticky="ew")
            self._field_label(settings_frame, 8, "Network mode", "Controls whether the app behaves fully local-first or expects broader network publishing.")
            self.network_mode_menu = ctk.CTkOptionMenu(settings_frame, variable=self.network_mode_var, values=list(NETWORK_MODE_OPTIONS))
            self.network_mode_menu.grid(row=10, column=0, padx=18, pady=6, sticky="ew")
            self._field_label(settings_frame, 11, "Local-first only", "On keeps private/local workflows as the default posture.")
            self.local_first_menu = ctk.CTkOptionMenu(settings_frame, variable=self.local_first_var, values=["on", "off"])
            self.local_first_menu.grid(row=13, column=0, padx=18, pady=6, sticky="ew")
            self._field_label(settings_frame, 14, "Cloud mode", "Reserved for future remote surfaces. Leave off unless you specifically need it.")
            self.cloud_mode_menu = ctk.CTkOptionMenu(settings_frame, variable=self.cloud_mode_var, values=["off", "on"])
            self.cloud_mode_menu.grid(row=16, column=0, padx=18, pady=6, sticky="ew")
            self._field_label(settings_frame, 17, "IPFS publishing", "Turn on when you want signed evidence bundles or peer pinning beyond the local vault.")
            self.ipfs_enabled_menu = ctk.CTkOptionMenu(settings_frame, variable=self.ipfs_enabled_var, values=["off", "on"])
            self.ipfs_enabled_menu.grid(row=19, column=0, padx=18, pady=6, sticky="ew")
            self._field_label(settings_frame, 20, "IPFS API", "HTTP endpoint for an already-running daemon if you are not using managed Kubo here.")
            self.ipfs_entry = ctk.CTkEntry(settings_frame, placeholder_text="http://127.0.0.1:5001")
            self.ipfs_entry.grid(row=22, column=0, padx=18, pady=6, sticky="ew")
            self._field_label(settings_frame, 23, "IPFS MFS root", "The root path where garden-managed files are organized inside IPFS MFS.")
            self.ipfs_root_entry = ctk.CTkEntry(settings_frame, placeholder_text="/kaylas-garden")
            self.ipfs_root_entry.grid(row=25, column=0, padx=18, pady=6, sticky="ew")
            ctk.CTkLabel(settings_frame, text="Encrypted Network Vault", font=ctk.CTkFont(size=18, weight="bold")).grid(row=26, column=0, padx=18, pady=(16, 8), sticky="w")
            self._field_label(settings_frame, 27, "IPFS user id", "Public-facing identifier for a pin surface or exchange lane.")
            self.secret_ipfs_user_id_entry = ctk.CTkEntry(settings_frame, placeholder_text="public-user-id")
            self.secret_ipfs_user_id_entry.grid(row=29, column=0, padx=18, pady=6, sticky="ew")
            self._field_label(settings_frame, 30, "Pin service", "Name of the pin provider, team surface, or peer lane.")
            self.secret_ipfs_pin_surface_entry = ctk.CTkEntry(settings_frame, placeholder_text="pinata / web3.storage / private lane")
            self.secret_ipfs_pin_surface_entry.grid(row=32, column=0, padx=18, pady=6, sticky="ew")
            self._field_label(settings_frame, 33, "Pin token", "Stored encrypted. Used only for network publishing actions that require auth.")
            self.secret_ipfs_pin_surface_token_entry = ctk.CTkEntry(settings_frame, placeholder_text="Pin surface token", show="*")
            self.secret_ipfs_pin_surface_token_entry.grid(row=35, column=0, padx=18, pady=6, sticky="ew")
            self._field_label(settings_frame, 36, "Hive username", "Public account name for checkpoints, comments, or challenge-response identity linking.")
            self.secret_hive_username_entry = ctk.CTkEntry(settings_frame, placeholder_text="hive-user")
            self.secret_hive_username_entry.grid(row=38, column=0, padx=18, pady=6, sticky="ew")
            self._field_label(settings_frame, 39, "Hive posting key", "Stored encrypted. Required only when broadcasting comments/checkpoints from this device.")
            self.secret_hive_posting_key_entry = ctk.CTkEntry(settings_frame, placeholder_text="Hive posting key", show="*")
            self.secret_hive_posting_key_entry.grid(row=41, column=0, padx=18, pady=6, sticky="ew")
            ctk.CTkButton(settings_frame, text="Save Encrypted Credentials", command=self.on_save_network_secrets).grid(row=42, column=0, padx=18, pady=(8, 16), sticky="ew")
            ctk.CTkLabel(settings_frame, text="Managed IPFS Daemon", font=ctk.CTkFont(size=18, weight="bold")).grid(row=43, column=0, padx=18, pady=(0, 8), sticky="w")
            self._field_label(settings_frame, 44, "Managed daemon enabled", "When on, the app can help install and control a local Kubo binary.")
            self.ipfs_daemon_enabled_menu = ctk.CTkOptionMenu(settings_frame, variable=self.ipfs_daemon_enabled_var, values=["off", "on"])
            self.ipfs_daemon_enabled_menu.grid(row=46, column=0, padx=18, pady=6, sticky="ew")
            self._field_label(settings_frame, 47, "Auto install", "Allow the app to fetch Kubo when no binary is available.")
            self.ipfs_daemon_auto_install_menu = ctk.CTkOptionMenu(settings_frame, variable=self.ipfs_daemon_auto_install_var, values=["off", "on"])
            self.ipfs_daemon_auto_install_menu.grid(row=49, column=0, padx=18, pady=6, sticky="ew")
            self._field_label(settings_frame, 50, "Auto start", "Start the managed daemon automatically when the runtime refreshes.")
            self.ipfs_daemon_auto_start_menu = ctk.CTkOptionMenu(settings_frame, variable=self.ipfs_daemon_auto_start_var, values=["off", "on"])
            self.ipfs_daemon_auto_start_menu.grid(row=52, column=0, padx=18, pady=6, sticky="ew")
            self._field_label(settings_frame, 53, "Existing binary path", "Optional path to an already-installed ipfs binary.")
            self.ipfs_daemon_binary_entry = ctk.CTkEntry(settings_frame, placeholder_text="/usr/local/bin/ipfs")
            self.ipfs_daemon_binary_entry.grid(row=55, column=0, padx=18, pady=6, sticky="ew")
            self._field_label(settings_frame, 56, "Managed repo path", "Filesystem location for the daemon repository and its config.")
            self.ipfs_daemon_repo_entry = ctk.CTkEntry(settings_frame, placeholder_text="~/.kaylas-garden/ipfs")
            self.ipfs_daemon_repo_entry.grid(row=58, column=0, padx=18, pady=6, sticky="ew")
            self._field_label(settings_frame, 59, "Kubo version", "Pinned version for managed installs so the environment stays reproducible.")
            self.ipfs_kubo_version_entry = ctk.CTkEntry(settings_frame, placeholder_text="v0.30.0")
            self.ipfs_kubo_version_entry.grid(row=61, column=0, padx=18, pady=6, sticky="ew")
            self._field_label(settings_frame, 62, "Custom Kubo tarball URL", "Optional override if you mirror Kubo internally or want a different download source.")
            self.ipfs_kubo_url_entry = ctk.CTkEntry(settings_frame, placeholder_text="https://...")
            self.ipfs_kubo_url_entry.grid(row=64, column=0, padx=18, pady=6, sticky="ew")
            daemon_buttons = ctk.CTkFrame(settings_frame, fg_color="transparent")
            daemon_buttons.grid(row=65, column=0, padx=18, pady=(6, 16), sticky="ew")
            daemon_buttons.grid_columnconfigure(0, weight=1)
            daemon_buttons.grid_columnconfigure(1, weight=1)
            daemon_buttons.grid_columnconfigure(2, weight=1)
            ctk.CTkButton(daemon_buttons, text="Install Kubo", command=self.on_install_ipfs_daemon).grid(row=0, column=0, padx=(0, 6), sticky="ew")
            ctk.CTkButton(daemon_buttons, text="Start Daemon", command=self.on_start_ipfs_daemon).grid(row=0, column=1, padx=6, sticky="ew")
            ctk.CTkButton(daemon_buttons, text="Stop Daemon", command=self.on_stop_ipfs_daemon).grid(row=0, column=2, padx=(6, 0), sticky="ew")
            ctk.CTkLabel(settings_frame, text="Hive Anchoring", font=ctk.CTkFont(size=18, weight="bold")).grid(row=66, column=0, padx=18, pady=(0, 8), sticky="w")
            self._field_label(settings_frame, 67, "Hive anchoring enabled", "Turn on when you want compact public checkpoints for evidence packages.")
            self.hive_enabled_menu = ctk.CTkOptionMenu(settings_frame, variable=self.hive_enabled_var, values=["off", "on"])
            self.hive_enabled_menu.grid(row=69, column=0, padx=18, pady=6, sticky="ew")
            self._field_label(settings_frame, 70, "Hive RPC", "RPC endpoint used for reading chain state and optional broadcasting.")
            self.hive_entry = ctk.CTkEntry(settings_frame, placeholder_text="https://api.hive.blog")
            self.hive_entry.grid(row=72, column=0, padx=18, pady=6, sticky="ew")
            self._field_label(settings_frame, 73, "Broadcast from this device", "Off keeps the app in prepare-only mode for Hive operations.")
            self.hive_broadcast_menu = ctk.CTkOptionMenu(settings_frame, variable=self.hive_broadcast_var, values=["off", "on"])
            self.hive_broadcast_menu.grid(row=75, column=0, padx=18, pady=6, sticky="ew")
            self._field_label(settings_frame, 76, "Trusted nodes", "Optional comma-separated peers or node labels for your own policy layer.")
            self.nodes_entry = ctk.CTkEntry(settings_frame, placeholder_text="peer-a, reviewer-b, node-c")
            self.nodes_entry.grid(row=78, column=0, padx=18, pady=6, sticky="ew")
            ctk.CTkButton(settings_frame, text="Save Settings", command=self.on_save_settings).grid(row=79, column=0, padx=18, pady=(10, 18), sticky="ew")

            queue_frame = ctk.CTkFrame(scroll)
            queue_frame.grid(row=0, column=1, padx=(0, 18), pady=18, sticky="nsew")
            queue_frame.grid_columnconfigure(0, weight=1)
            queue_frame.grid_rowconfigure(1, weight=1)
            queue_frame.grid_rowconfigure(3, weight=1)
            queue_frame.grid_rowconfigure(5, weight=1)
            ctk.CTkLabel(queue_frame, text="Managed IPFS Status", font=ctk.CTkFont(size=20, weight="bold")).grid(row=0, column=0, padx=18, pady=(18, 10), sticky="w")
            self.daemon_status_text = self._make_textbox(queue_frame, height=220)
            self.daemon_status_text.grid(row=1, column=0, padx=18, pady=(0, 16), sticky="nsew")
            ctk.CTkLabel(queue_frame, text="Encrypted Credential Status", font=ctk.CTkFont(size=18, weight="bold")).grid(row=2, column=0, padx=18, pady=(0, 10), sticky="w")
            self.secret_status_text = self._make_textbox(queue_frame, height=180)
            self.secret_status_text.grid(row=3, column=0, padx=18, pady=(0, 16), sticky="nsew")
            ctk.CTkLabel(queue_frame, text="Queue + Publishing State", font=ctk.CTkFont(size=18, weight="bold")).grid(row=4, column=0, padx=18, pady=(0, 10), sticky="w")
            self.network_queue = self._make_textbox(queue_frame, height=260)
            self.network_queue.grid(row=5, column=0, padx=18, pady=(0, 18), sticky="nsew")

        def _build_models_tab(self, tab: Any) -> None:
            tab.grid_columnconfigure(0, weight=1)
            tab.grid_rowconfigure(1, weight=1)
            top = ctk.CTkFrame(tab)
            top.grid(row=0, column=0, padx=18, pady=18, sticky="ew")

            ctk.CTkLabel(top, text="LiteRT-LM + Local Model Catalog", font=ctk.CTkFont(size=20, weight="bold")).grid(
                row=0, column=0, padx=18, pady=(18, 8), sticky="w"
            )
            ctk.CTkLabel(
                top,
                text="Verify runtime readiness before relying on automated diagnosis. This panel explains where the model lives, which backend is active, and whether cryptographic advisory dependencies exist.",
                wraplength=900,
                justify="left",
                text_color="#B7D7B0",
            ).grid(row=1, column=0, padx=18, pady=(0, 10), sticky="w")
            buttons = ctk.CTkFrame(top, fg_color="transparent")
            buttons.grid(row=2, column=0, padx=18, pady=(0, 18), sticky="ew")
            buttons.grid_columnconfigure(0, weight=1)
            buttons.grid_columnconfigure(1, weight=1)
            ctk.CTkButton(buttons, text="Refresh Model Status", command=self.refresh_all).grid(row=0, column=0, padx=(0, 8), sticky="ew")
            ctk.CTkButton(buttons, text="Verify Model Hash", command=self.on_verify_model).grid(row=0, column=1, padx=(8, 0), sticky="ew")

            self.models_text = self._make_textbox(tab, height=640)
            self.models_text.grid(row=1, column=0, padx=18, pady=(0, 18), sticky="nsew")

        def _set_text(self, widget: Any, text: str) -> None:
            textbox = getattr(widget, "_textbox", None)
            if textbox is not None:
                textbox.configure(wrap="word")
            widget.delete("1.0", "end")
            widget.insert("1.0", text)

        def _selected_plant_id(self, variable: tk.StringVar) -> Optional[str]:
            label = sanitize_text(variable.get(), max_chars=200)
            return self.plant_lookup.get(label)

        def _guide_threads(self) -> List[Dict[str, Any]]:
            threads = self.runtime.state.setdefault("guide_threads", [])
            if not isinstance(threads, list):
                threads = []
                self.runtime.state["guide_threads"] = threads
            return threads

        def _guide_thread_label(self, thread: Mapping[str, Any]) -> str:
            title = sanitize_text(str(thread.get("title") or "New thread"), max_chars=48) or "New thread"
            stamp = sanitize_text(str(thread.get("updated_at") or ""), max_chars=32)
            if "T" in stamp:
                stamp = stamp.split("T", 1)[0]
            return f"{title} · {stamp or 'draft'}"

        def _guide_threads_for_selected_plant(self) -> List[Dict[str, Any]]:
            plant_id = self._selected_plant_id(self.guide_plant_var)
            if not plant_id:
                return []
            return [thread for thread in self._guide_threads() if thread.get("plant_id") == plant_id]

        def _active_guide_thread(self) -> Optional[Dict[str, Any]]:
            label = sanitize_text(self.guide_thread_var.get(), max_chars=200)
            for thread in self._guide_threads_for_selected_plant():
                if self._guide_thread_label(thread) == label:
                    return thread
            return None

        def _format_guide_transcript(self, thread: Optional[Mapping[str, Any]]) -> str:
            if not thread:
                return "Start a thread to turn plant history, images, and recent observations into a longer-running diagnosis conversation."
            lines: List[str] = []
            for message in list(thread.get("messages") or [])[-10:]:
                role = "You" if message.get("role") == "user" else "Plant Health"
                content = sanitize_text(str(message.get("content") or ""), max_chars=6000)
                lines.append(f"{role}\n{content}")
            return "\n\n━━━━━━━━━━━━━━━━━━━━\n\n".join(lines) if lines else "No messages yet."

        def _guide_thread_summary_text(self, thread: Optional[Mapping[str, Any]]) -> str:
            if not thread:
                return "No active thread yet. Pick a plant, then start a thread for symptom tracking, recovery logging, or general care Q&A."
            return (
                f"Thread: {thread.get('title') or 'Untitled'}\n"
                f"Plant ID: {thread.get('plant_id') or 'n/a'}\n"
                f"Messages: {len(list(thread.get('messages') or []))}\n"
                f"Updated: {thread.get('updated_at') or 'n/a'}\n"
                f"Image evidence: {thread.get('image_path') or 'none attached'}\n\n"
                "Use separate threads for propagation, disease tracking, watering stress, nutrient experiments, or public evidence writeups."
            )

        def _guide_suggestions_text(self, thread: Optional[Mapping[str, Any]]) -> str:
            if not thread:
                return "Suggested prompts\n\n• Compare the newest leaf to the last observation.\n• Build a 3-day inspection plan.\n• Separate likely nutrient stress from pest damage."
            plant_id = sanitize_text(str(thread.get("plant_id") or "this plant"), max_chars=60)
            return (
                "Suggested next prompts\n\n"
                f"• For {plant_id}, list the top 3 most likely causes and the evidence for each.\n"
                "• Tell me which photo angles or close-ups would reduce uncertainty most.\n"
                "• Turn the diagnosis into a reversible 48-hour action plan with checks.\n"
                "• Draft a public evidence note suitable for the IPFS/Hive surface."
            )

        def _refresh_guide_threads_ui(self) -> None:
            threads = sorted(
                self._guide_threads_for_selected_plant(),
                key=lambda item: str(item.get("updated_at") or ""),
                reverse=True,
            )
            labels = [self._guide_thread_label(thread) for thread in threads] or ["Start a thread"]
            self.guide_thread_picker.configure(values=labels)
            if self.guide_thread_var.get() not in labels:
                self.guide_thread_var.set(labels[0])
            thread = self._active_guide_thread()
            self._set_text(self.guide_thread_summary, self._guide_thread_summary_text(thread))
            self._set_text(self.guide_result, self._format_guide_transcript(thread))
            self._set_text(self.guide_suggestions, self._guide_suggestions_text(thread))

        def _create_guide_thread(self, plant_id: str, opening_question: str) -> Dict[str, Any]:
            now = datetime.now(UTC).isoformat()
            title = sanitize_text(opening_question.splitlines()[0], max_chars=40) or "Plant health thread"
            thread = {
                "thread_id": f"thread-{uuid.uuid4().hex[:12]}",
                "plant_id": plant_id,
                "title": title,
                "updated_at": now,
                "image_path": self.selected_guide_image_path or "",
                "messages": [],
            }
            self._guide_threads().append(thread)
            self.runtime.save()
            return thread

        def _append_guide_message(self, thread: MutableMapping[str, Any], role: str, content: str, *, image_path: Optional[str] = None) -> None:
            messages = thread.setdefault("messages", [])
            if not isinstance(messages, list):
                messages = []
                thread["messages"] = messages
            messages.append({
                "role": role,
                "content": sanitize_text(content, max_chars=7000),
                "timestamp": datetime.now(UTC).isoformat(),
            })
            thread["updated_at"] = datetime.now(UTC).isoformat()
            if image_path:
                thread["image_path"] = image_path
            self.runtime.save()

        def _build_network_surface_summary(self) -> str:
            network = self.runtime.network_status()
            queue = self.runtime.state.get("sync_queue") or []
            anchors = self.runtime.state.get("anchor_queue") or []
            return (
                "Network Surface\n\n"
                f"Mode: {network.get('mode', {}).get('network_mode')}\n"
                f"Cloud path enabled: {network.get('mode', {}).get('cloud_mode')}\n"
                f"IPFS enabled: {network.get('mode', {}).get('ipfs_enabled')}\n"
                f"Hive enabled: {network.get('mode', {}).get('hive_enabled')}\n"
                f"Anchor queue depth: {len(list(anchors))}\n"
                f"Sync queue depth: {len(list(queue))}\n\n"
                "Think of this as a public evidence surface: observations become encrypted local records first, then selected summaries fan out to IPFS objects and compact Hive checkpoints."
            )

        def _build_network_surface_feed(self) -> str:
            feed: List[str] = []
            for item in list(self.runtime.state.get("anchor_queue") or [])[-4:]:
                feed.append(f"Anchor pending\n{json.dumps(item, indent=2, ensure_ascii=True)}")
            for item in list(self.runtime.state.get("sync_queue") or [])[-4:]:
                feed.append(f"Sync pending\n{json.dumps(item, indent=2, ensure_ascii=True)}")
            if not feed:
                feed.append("No pending IPFS or Hive activity yet. Publish an observation or share a technique to light up the surface.")
            return "\n\n━━━━━━━━━━━━━━━━━━━━\n\n".join(feed)

        def _build_network_surface_design(self) -> str:
            return (
                "Innovation tracks\n\n"
                "1. Source surfaces\n"
                "- Split local evidence, shared IPFS packages, and Hive checkpoints into clearly labeled lanes.\n\n"
                "2. Validation surfaces\n"
                "- Let peers tag locations, attach proof links, and validate observations with structured review states instead of simple likes.\n\n"
                "3. Information stake\n"
                "- Weight trust by accepted contributions, correction accuracy, and audit quality rather than money alone.\n\n"
                "4. Explainable voting\n"
                "- Require each approval, dispute, or escalation to cite evidence and uncertainty.\n\n"
                "5. Plant health publishing\n"
                "- Promote high-quality chat threads into signed case reports that can later be anchored publicly."
            )

        def _build_start_here_text(self, summary: Mapping[str, Any]) -> str:
            mode = summary["network_status"]["mode"]
            return (
                "Onboarding flow\n\n"
                "1. Create a local garden identity\n"
                "- The app already creates a PlantSyncID and stores encrypted state in the local vault.\n\n"
                "2. Add one or two plants\n"
                "- Keep species broad at first. The important thing is building a stable evidence history.\n\n"
                "3. Record observations privately first\n"
                "- Photos, notes, symptom tags, and rough location context stay useful even before any public publish step.\n\n"
                "4. Turn on IPFS when you want portable evidence packages\n"
                f"- Current IPFS mode: {'enabled' if mode.get('ipfs_enabled') else 'disabled'}. Use Settings to point at an API or managed daemon.\n\n"
                "5. Turn on Hive when you want compact public checkpoints\n"
                f"- Current Hive mode: {'enabled' if mode.get('hive_enabled') else 'disabled'}. Treat Hive as a timestamped checkpoint and public coordination layer, not the raw vault itself.\n\n"
                "6. Build review surfaces\n"
                "- Promote strong plant-health chat threads into signed case reports with citations, uncertainty, and follow-up windows.\n\n"
                "7. Scale toward trust markets\n"
                "- Let peers validate locations, links, and claims using structured evidence review instead of simple social likes."
            )

        def _build_start_here_checklist(self, summary: Mapping[str, Any]) -> str:
            network = summary["network_status"]
            checks = [
                ("Local identity", True),
                ("At least one plant", len(summary["plants"]) > 0),
                ("LiteRT runtime installed", bool(summary["model_status"].get("litert_installed"))),
                ("LiteRT model present", bool(summary["model_status"].get("installed"))),
                ("IPFS publishing ready", bool(network["mode"].get("ipfs_enabled"))),
                ("Hive checkpointing ready", bool(network["mode"].get("hive_enabled"))),
            ]
            lines = []
            for label, ok in checks:
                lines.append(f"{'✓' if ok else '•'} {label}: {'ready' if ok else 'needs setup'}")
            lines.append("\nRecommended order\n1. Plants\n2. Observe\n3. Guide/Care Lab\n4. IPFS\n5. Hive\n6. Trust Lab")
            return "\n".join(lines)

        def _build_publish_lanes_text(self) -> str:
            return (
                "Surface design\n\n"
                "Local vault\n- Full evidence, notes, drafts, and image pointers.\n\n"
                "IPFS package\n- Signed observation bundles, thread exports, technique cards, and public case reports.\n\n"
                "Hive checkpoint\n- Compact references to the evidence package, reviewer state, and claim hash.\n\n"
                "Validation surface\n- Reviewers attach location tags, source links, disputes, and confidence notes that can be replayed later."
            )

        def _build_trust_lab_blueprint(self) -> str:
            return (
                "Source-origin account blueprint\n\n"
                "Use one public project Hive account as the protocol origin, not as the user's personal identity.\n\n"
                "Suggested linkage flow\n"
                "1. Generate a local garden keypair.\n"
                "2. Ask the user for a Hive handle.\n"
                "3. Create a challenge string bound to the local public key and device fingerprint.\n"
                "4. Publish or sign that challenge through Hive.\n"
                "5. Record the verified link locally and later anchor the binding to IPFS/Hive.\n\n"
                "That gives you a source-origin registry without collapsing every user into one shared account."
            )

        def _build_information_stake_text(self) -> str:
            return (
                "Information stake idea\n\n"
                "Trust weight should rise when someone contributes observations or audits that survive review and later evidence.\n\n"
                "Possible signals\n"
                "- accepted case reports\n"
                "- correction accuracy\n"
                "- low reversal rate\n"
                "- diversity of reviewed domains\n"
                "- citation quality\n"
                "- how often the auditor reduced uncertainty instead of only echoing consensus\n\n"
                "This is closer to proof-of-understanding than proof-of-money."
            )

        def _build_claim_lifecycle_text(self) -> str:
            return (
                "Claim object lifecycle\n\n"
                "draft → evidence-backed → challenged → reviewed → accepted / disputed / archived\n\n"
                "Every transition should preserve:\n"
                "- claim hash\n"
                "- evidence links\n"
                "- location scope\n"
                "- uncertainty estimate\n"
                "- who reviewed it\n"
                "- why the state changed\n\n"
                "For plant health, a claim could be: 'powdery mildew likely on west bed tomatoes, confidence 0.68, needs underside-leaf evidence.'"
            )

        def _build_auditor_text(self) -> str:
            return (
                "Auditor surface\n\n"
                "Auditors should review evidence packs, not just vote. A strong review UI would ask them to:\n"
                "- inspect image quality\n"
                "- check whether the location tag is plausible\n"
                "- compare against nearby linked observations\n"
                "- run scenario prompts that stress the diagnosis\n"
                "- explain what new evidence would flip the result\n\n"
                "'Quantum risk simulation' can start as a deterministic what-if engine: generate competing explanations, estimate reversal risk, and surface the highest-value missing evidence."
            )

        def _build_dashboard_overview(self, summary: Mapping[str, Any]) -> str:
            plants = list(summary.get("plants") or [])
            network = summary.get("network_status") or {}
            mode = network.get("mode") or {}
            model = summary.get("model_status") or {}
            queue_total = int(summary.get("anchor_queue_depth") or 0) + int(summary.get("sync_queue_depth") or 0)
            score = 0
            score += 25 if plants else 0
            score += 25 if bool(mode.get("ipfs_enabled")) else 0
            score += 25 if bool(mode.get("hive_enabled")) else 0
            score += 25 if bool(model.get("installed")) else 0
            next_actions: List[str] = []
            if not plants:
                next_actions.append("Add the first plant passport so observations and chat threads have a stable home.")
            if plants and not summary.get("observation_count"):
                next_actions.append("Record the first observation with a note and image so the plant has an evidence baseline.")
            if plants and not summary.get("diagnosis_count"):
                next_actions.append("Open Care Lab and run at least one diagnosis to build a reusable case history.")
            if not bool(mode.get("ipfs_enabled")):
                next_actions.append("Enable IPFS when you want signed evidence bundles that can travel beyond the local device.")
            if not bool(mode.get("hive_enabled")):
                next_actions.append("Enable Hive when you want compact public checkpoints and source-origin coordination.")
            if not next_actions:
                next_actions.append("System looks healthy. Focus on higher-quality observations, review flows, and export-ready case threads.")
            garden_name = (summary.get("garden") or {}).get("name") or "Kayla's Garden"
            lines = [
                "Garden command surface",
                "",
                f"Garden: {garden_name}",
                f"Plants tracked: {len(plants)}",
                f"Observations: {summary.get('observation_count', 0)}",
                f"Diagnoses: {summary.get('diagnosis_count', 0)}",
                f"Health check-ins: {summary.get('health_checkin_count', 0)}",
                f"Shared techniques: {summary.get('shared_techniques_count', 0)}",
                f"Protocol readiness: {score}/100",
                "",
                "Connected surfaces",
                f"- Network mode: {mode.get('network_mode', 'unknown')}",
                f"- IPFS: {'enabled' if mode.get('ipfs_enabled') else 'local only'}",
                f"- Hive: {'enabled' if mode.get('hive_enabled') else 'off'}",
                f"- Model present: {'yes' if model.get('installed') else 'no'}",
                f"- Queue pressure: {queue_total} pending record(s)",
                "",
                "Next best actions",
            ]
            lines.extend(f"{idx}. {item}" for idx, item in enumerate(next_actions[:5], start=1))
            if plants:
                lines.extend(["", "Plant roster"])
                for plant in plants[:6]:
                    lines.append(
                        f"- {plant.get('name', 'Unnamed')} · obs {plant.get('observation_count', 0)} · status {plant.get('latest_status', 'unknown')}"
                    )
            return "\\n".join(lines)

        def _build_queue_overview(self) -> str:
            anchors = list(self.runtime.state.get("anchor_queue") or [])[-8:]
            sync_jobs = list(self.runtime.state.get("sync_queue") or [])[-8:]
            lines = [
                "Queue overview",
                "",
                f"Anchor jobs: {len(anchors)}",
                f"Sync jobs: {len(sync_jobs)}",
            ]
            if not anchors and not sync_jobs:
                lines.extend([
                    "",
                    "No queued network work right now.",
                    "Create an observation, publish a technique, or post a community action to generate outbound records.",
                ])
                return "\\n".join(lines)
            if anchors:
                lines.extend(["", "Recent anchor jobs"])
                for item in anchors:
                    lines.append(
                        f"- {sanitize_text(str(item.get('kind') or item.get('topic') or 'checkpoint'), max_chars=40)} · {sanitize_text(str(item.get('checkpoint_id') or item.get('record_id') or ''), max_chars=18)}"
                    )
            if sync_jobs:
                lines.extend(["", "Recent sync jobs"])
                for item in sync_jobs:
                    cids = list(item.get("cids") or [])
                    lines.append(
                        f"- {sanitize_text(str(item.get('job_id') or 'job'), max_chars=18)} · {len(cids)} cid(s) · status {sanitize_text(str(item.get('status') or 'queued'), max_chars=24)}"
                    )
            return "\\n".join(lines)

        def _build_network_settings_status_text(self, status: Mapping[str, Any]) -> str:
            mode = status.get("mode") or {}
            leafvault = status.get("leafvault") or {}
            bloom = status.get("bloomtrace") or {}
            rootmesh = status.get("rootmesh") or {}
            return "\\n".join([
                "Publishing surface",
                "",
                f"Network mode: {mode.get('network_mode', 'unknown')}",
                f"Local-first only: {mode.get('local_first_only')}",
                f"Cloud mode: {mode.get('cloud_mode')}",
                f"IPFS enabled: {mode.get('ipfs_enabled')}",
                f"Hive enabled: {mode.get('hive_enabled')}",
                f"Hive broadcast: {mode.get('hive_broadcast_enabled')}",
                "",
                "LeafVault",
                f"- Root: {leafvault.get('mfs_root') or leafvault.get('vault_root') or 'n/a'}",
                f"- IPFS reachable: {leafvault.get('ipfs_enabled') if 'ipfs_enabled' in leafvault else mode.get('ipfs_enabled')}",
                "",
                "Outbound lanes",
                f"- Anchor engine ready: {bloom.get('enabled') if 'enabled' in bloom else True}",
                f"- Sync engine ready: {rootmesh.get('enabled') if 'enabled' in rootmesh else True}",
                f"- Pending anchors: {status.get('pending_anchor_records', 0)}",
                f"- Pending sync records: {status.get('pending_sync_records', 0)}",
            ])

        def _build_daemon_status_text(self, status: Mapping[str, Any]) -> str:
            return "\\n".join([
                "Managed IPFS daemon",
                "",
                f"Enabled in settings: {status.get('enabled')}",
                f"Running: {status.get('running')}",
                f"Repo path: {status.get('repo_path') or status.get('repo') or 'n/a'}",
                f"Binary path: {status.get('binary_path') or status.get('binary') or 'n/a'}",
                f"API endpoint: {status.get('api') or status.get('api_url') or 'n/a'}",
                f"Gateway: {status.get('gateway') or 'n/a'}",
                f"Last error: {status.get('last_error') or 'none'}",
                "",
                "Tips",
                "- Install Kubo if no binary is available.",
                "- Start the daemon before testing IPFS publishing.",
                "- Use a managed repo path that your user account can write to.",
            ])

        def _build_secret_status_text(self, status: Mapping[str, Any]) -> str:
            return "\\n".join([
                "Encrypted network vault",
                "",
                f"Vault ready: {status.get('vault_ready') if 'vault_ready' in status else True}",
                f"IPFS user id saved: {status.get('ipfs_user_id_present') or status.get('ipfs_user_id_set') or False}",
                f"Pin service saved: {status.get('pin_surface_present') or status.get('pin_surface_set') or False}",
                f"Pin token saved: {status.get('pin_surface_token_present') or status.get('pin_surface_token_set') or False}",
                f"Hive username saved: {status.get('hive_username_present') or status.get('hive_username_set') or False}",
                f"Hive posting key saved: {status.get('hive_posting_key_present') or status.get('hive_posting_key_set') or False}",
                "",
                "Safety notes",
                "- Credentials are intended for compact network actions, not broad cloud storage.",
                "- Keep public account names separate from local device keys when possible.",
                "- Prefer challenge-response linking over copying identity secrets between devices.",
            ])

        def _build_community_surface_text(self, summary: Mapping[str, Any]) -> str:
            peers = list(summary.get('peers') or [])
            groups = list(summary.get('groups') or [])
            comments = list(summary.get('recent_comments') or [])
            pins = list(summary.get('recent_pin_requests') or [])
            lines = [
                "Community surface",
                "",
                f"Peers: {summary.get('peer_count', 0)}",
                f"Pin groups: {summary.get('group_count', 0)}",
                f"Recent comments: {len(comments)}",
                f"Recent pin requests: {len(pins)}",
            ]
            if peers:
                lines.extend(["", "Peer roster"])
                for peer in peers[:5]:
                    lines.append(f"- {peer.get('display_name') or 'Unnamed'} · Hive {peer.get('hive_username') or 'n/a'} · IPFS {peer.get('ipfs_user_id') or 'n/a'}")
            if groups:
                lines.extend(["", "Pin groups"])
                for group in groups[:5]:
                    lines.append(f"- {group.get('name') or 'Unnamed group'} · {group.get('privacy_class') or 'shared'} · members {len(group.get('member_peer_ids') or [])}")
            if comments:
                lines.extend(["", "Recent group comments"])
                for comment in comments[:4]:
                    lines.append(f"- {sanitize_text(str(comment.get('body') or ''), max_chars=90)}")
            if pins:
                lines.extend(["", "Recent pin requests"])
                for req in pins[:4]:
                    lines.append(f"- {req.get('cid') or 'no-cid'} · {req.get('local_pin_status') or 'queued'}")
            if len(lines) == 6:
                lines.extend(["", "No community objects yet.", "Add a peer, create a pin group, or post a comment to bootstrap the shared surface."])
            return "\\n".join(lines)

        def _build_insights_digest_text(self, digest: Mapping[str, Any]) -> str:
            watch = list(digest.get('top_watchlist') or [])
            activity = list(digest.get('recent_activity') or [])
            season = digest.get('season_context') or {}
            garden_name = digest.get("garden_name") or "Kayla's Garden"
            lines = [
                "Garden digest",
                "",
                f"Garden: {garden_name}",
                f"Season context: {season.get('season') or season.get('label') or 'n/a'}",
                f"Risk focus: {season.get('summary') or season.get('focus') or 'Observe moisture, airflow, and stress swings.'}",
                "",
                f"Top watchlist entries: {len(watch)}",
                f"Recent events sampled: {len(activity)}",
            ]
            if watch:
                lines.extend(["", "Highest-priority plants"])
                for item in watch[:5]:
                    lines.append(f"- {item.get('plant_name') or 'Unnamed'} · score {item.get('priority_score', 0)} · next {item.get('recommended_next_step') or 'Inspect soon'}")
            else:
                lines.extend(["", "No watchlist pressure yet.", "Create plants and observations to generate risk-focused summaries."])
            return "\\n".join(lines)

        def _build_watchlist_text(self, report: Mapping[str, Any]) -> str:
            items = list(report.get('watchlist') or [])
            if not items:
                return "Watchlist\\n\\nNo plants to rank yet. Add observations or check-ins so the system can prioritize attention."
            lines = ["Watchlist", ""]
            for item in items[:10]:
                reasons = list(item.get('reasons') or [])
                lines.append(f"{item.get('plant_name') or 'Unnamed'} · priority {item.get('priority_score', 0)}")
                lines.append(f"- Status: {item.get('latest_status') or 'unknown'} / check-in {item.get('latest_checkin_status') or 'none'} / diagnosis {item.get('latest_diagnosis_urgency') or 'none'}")
                lines.append(f"- Next step: {item.get('recommended_next_step') or 'Inspect soon'}")
                if reasons:
                    for reason in reasons[:3]:
                        lines.append(f"  · {reason}")
                lines.append("")
            return "\\n".join(lines).rstrip()

        def _build_activity_text(self, activity: Mapping[str, Any]) -> str:
            items = list(activity.get('items') or [])
            if not items:
                return "Activity timeline\\n\\nNo recorded events yet. Add a plant, an observation, or a care action to start the operational log."
            lines = ["Activity timeline", ""]
            for item in items[:16]:
                stamp = sanitize_text(str(item.get('timestamp') or ''), max_chars=32)
                lines.append(f"{stamp} · {item.get('event_type') or 'event'} · {item.get('plant_name') or 'Garden'}")
                lines.append(f"- {sanitize_text(str(item.get('summary') or ''), max_chars=180)}")
                status_text = sanitize_text(str(item.get('status') or ''), max_chars=40)
                tags_text = ", ".join(sanitize_text(str(tag), max_chars=20) for tag in list(item.get('tags') or [])[:4])
                if status_text or tags_text:
                    lines.append(f"- status: {status_text or 'n/a'} | tags: {tags_text or 'none'}")
                lines.append("")
            return "\\n".join(lines).rstrip()

        def _build_model_surface_text(self) -> str:
            model_status = self.runtime.model_manager.model_status()
            oqs_status = self.runtime.oqs_advisor.status()
            primary = model_status.get('primary_model') if isinstance(model_status, dict) else None
            return "\\n".join([
                "LiteRT-LM model surface",
                "",
                f"LiteRT installed: {model_status.get('litert_installed') if isinstance(model_status, dict) else False}",
                f"Primary model present: {model_status.get('installed') if isinstance(model_status, dict) else False}",
                f"Primary model path: {primary or model_status.get('primary_model_path') or 'n/a'}",
                f"Verified hash: {model_status.get('verified_hash') or model_status.get('digest') or 'not checked this session'}",
                f"Preferred backend: {model_status.get('backend') or model_status.get('selected_backend') or 'auto'}",
                "",
                "Use this tab to",
                "- verify that LiteRT runtime is installed",
                "- confirm the model file exists where the app expects it",
                "- check which backend is likely to run inference",
                "- confirm quantum-safe advisory dependencies are present",
                "",
                f"OQS available: {oqs_status.get('oqs_available') if isinstance(oqs_status, dict) else oqs_status}",
            ])

        def _run_worker(self, func: Callable[[], Any], on_success: Callable[[Any], None], *, status: str) -> None:
            self.status_var.set(status)

            def worker() -> None:
                try:
                    result = func()
                except Exception as exc:
                    self.after(0, lambda exc=exc: self._handle_error(exc))
                    return
                self.after(0, lambda: on_success(result))

            threading.Thread(target=worker, daemon=True).start()

        def _handle_error(self, exc: Exception) -> None:
            self.status_var.set("Action failed. See dialog for details.")
            messagebox.showerror("Kayla's Garden", str(exc))

        def refresh_all(self) -> None:
            self.runtime.state = self.runtime.vault.load(password=self.runtime.password)
            self.runtime.reload_settings()
            self.runtime.identity = self.runtime.identity_service.ensure_identity(
                self.runtime.state,
                self.runtime.settings.get("garden_name") or "Kayla's Garden",
            )
            summary = self.runtime.summary()

            self.identity_label.configure(
                text=(
                    f"SyncID: {self.runtime.identity.sync_id}\n"
                    f"Fingerprint: {self.runtime.identity.fingerprint}\n"
                    f"Device: {self.runtime.identity.device_label}"
                )
            )
            protocol_score = 0
            protocol_score += 25 if summary['network_status']['mode']['ipfs_enabled'] else 0
            protocol_score += 25 if summary['network_status']['mode']['hive_enabled'] else 0
            protocol_score += 25 if summary['model_status']['installed'] else 0
            protocol_score += 25 if len(summary['plants']) > 0 else 0
            self._set_text(
                self.sidebar_metrics,
                (
                    f"Plants: {len(summary['plants'])}\n"
                    f"Protocol readiness: {protocol_score}/100\n"
                    f"Mode: {summary['network_status']['mode']['network_mode']}\n"
                    f"Anchor queue: {summary['anchor_queue_depth']}\n"
                    f"Sync queue: {summary['sync_queue_depth']}\n"
                    f"Diagnoses: {summary['diagnosis_count']}\n"
                    f"Check-ins: {summary['health_checkin_count']}\n"
                    f"IPFS daemon: {summary['network_status']['ipfs_daemon']['running']}\n"
                    f"LiteRT installed: {summary['model_status']['litert_installed']}\n"
                    f"Model present: {summary['model_status']['installed']}"
                ),
            )
            if hasattr(self, "start_here_text"):
                self._set_text(self.start_here_text, self._build_start_here_text(summary))
                self._set_text(self.start_checklist_text, self._build_start_here_checklist(summary))
                self._set_text(self.start_publish_lanes_text, self._build_publish_lanes_text())
            if hasattr(self, "trust_lab_blueprint"):
                self._set_text(self.trust_lab_blueprint, self._build_trust_lab_blueprint())
                self._set_text(self.trust_lab_stake, self._build_information_stake_text())
                self._set_text(self.trust_lab_claims, self._build_claim_lifecycle_text())
                self._set_text(self.trust_lab_auditors, self._build_auditor_text())
            self._set_text(self.dashboard_summary, self._build_dashboard_overview(summary))
            self._set_text(self.dashboard_queue, self._build_queue_overview())
            self._set_text(self.plants_text, self._plants_text())
            network_status = self.runtime.network_status()
            self._set_text(self.network_queue, self._build_network_settings_status_text(network_status))
            self._set_text(self.daemon_status_text, self._build_daemon_status_text(self.runtime.ipfs_daemon_status()))
            self._set_text(self.secret_status_text, self._build_secret_status_text(self.runtime.network_secret_status()))
            self._set_text(self.community_result, self._build_community_surface_text(self.runtime.community_summary()))
            self._set_text(self.network_surface_text, self._build_network_surface_summary())
            self._set_text(self.network_surface_feed, self._build_network_surface_feed())
            self._set_text(self.network_surface_design, self._build_network_surface_design())
            digest = self.runtime.greenhouse_digest()
            watchlist = self.runtime.watchlist_report()
            activity = self.runtime.activity_timeline()
            self._set_text(self.insights_digest, self._build_insights_digest_text(digest))
            self._set_text(self.insights_watchlist, self._build_watchlist_text(watchlist))
            self._set_text(self.insights_activity, self._build_activity_text(activity))
            self._set_text(self.models_text, self._build_model_surface_text())
            self._sync_settings_fields()
            self._sync_plant_menus()
            self._refresh_guide_threads_ui()
            self.status_var.set("Garden runtime refreshed.")

        def _queue_text(self) -> str:
            anchors = list(self.runtime.state.get("anchor_queue") or [])[-10:]
            sync_jobs = list(self.runtime.state.get("sync_queue") or [])[-10:]
            return json.dumps({"anchors": anchors, "sync_jobs": sync_jobs}, indent=2, ensure_ascii=True)

        def _plants_text(self) -> str:
            lines: List[str] = []
            for plant in self.runtime.list_plants():
                latest = plant.observations[-1] if plant.observations else None
                lines.append(
                    (
                        f"{plant.name} [{plant.plant_id}]\n"
                        f"Species: {plant.species or 'Unknown'}\n"
                        f"Privacy: {plant.privacy_class}\n"
                        f"Tags: {', '.join(plant.tags) or 'none'}\n"
                        f"Sunlight: {plant.sunlight or 'n/a'}\n"
                        f"Watering: {plant.watering or 'n/a'}\n"
                        f"Soil: {plant.soil or 'n/a'}\n"
                        f"Profile: {plant.profile_summary or plant.notes or 'No profile yet.'}\n"
                        f"Observations: {len(plant.observations)}\n"
                        f"Latest status: {latest.health.status if latest else 'no-observations'}\n"
                    )
                )
            return "\n---\n".join(lines) if lines else "No plant passports yet."

        def _sync_plant_menus(self) -> None:
            plants = self.runtime.list_plants()
            values: List[str] = []
            lookup: Dict[str, str] = {}
            for plant in plants:
                label = f"{plant.name} ({plant.plant_id[:8]})"
                values.append(label)
                lookup[label] = plant.plant_id
            if not values:
                values = ["No plants yet"]
            self.plant_lookup = lookup
            self.observe_picker.configure(values=values)
            self.care_picker.configure(values=values)
            self.guide_picker.configure(values=values)
            self.lab_picker.configure(values=values)
            self.community_post_plant_picker.configure(values=values)
            self.guide_thread_var.set("")
            if values[0] == "No plants yet":
                self.observe_plant_var.set(values[0])
                self.care_plant_var.set(values[0])
                self.guide_plant_var.set(values[0])
                self.lab_plant_var.set(values[0])
                self.community_plant_var.set(values[0])
            else:
                if self.observe_plant_var.get() not in lookup:
                    self.observe_plant_var.set(values[0])
                if self.care_plant_var.get() not in lookup:
                    self.care_plant_var.set(values[0])
                if self.guide_plant_var.get() not in lookup:
                    self.guide_plant_var.set(values[0])
                if self.lab_plant_var.get() not in lookup:
                    self.lab_plant_var.set(values[0])
                if self.community_plant_var.get() not in lookup:
                    self.community_plant_var.set(values[0])

        def _sync_settings_fields(self) -> None:
            settings = self.runtime.settings
            secrets = self.runtime.secret_settings
            self.network_mode_var.set(normalize_network_mode(settings.get("network_mode")))
            self.local_first_var.set("on" if bool(settings.get("local_first_only", True)) else "off")
            self.cloud_mode_var.set("on" if bool(settings.get("cloud_mode", False)) else "off")
            self.ipfs_enabled_var.set("on" if bool(settings.get("ipfs_enabled", False)) else "off")
            self.ipfs_daemon_enabled_var.set("on" if bool(settings.get("ipfs_daemon_enabled", False)) else "off")
            self.ipfs_daemon_auto_install_var.set("on" if bool(settings.get("ipfs_daemon_auto_install", False)) else "off")
            self.ipfs_daemon_auto_start_var.set("on" if bool(settings.get("ipfs_daemon_auto_start", False)) else "off")
            self.hive_enabled_var.set("on" if bool(settings.get("hive_enabled", False)) else "off")
            self.hive_broadcast_var.set("on" if bool(settings.get("hive_broadcast_enabled", False)) else "off")
            for entry, value in (
                (self.location_entry, settings.get("location") or ""),
                (self.theme_entry, settings.get("theme") or ""),
                (self.ipfs_entry, settings.get("ipfs_api") or ""),
                (self.ipfs_root_entry, settings.get("ipfs_mfs_root") or ""),
                (self.ipfs_daemon_binary_entry, settings.get("ipfs_daemon_binary") or ""),
                (self.ipfs_daemon_repo_entry, settings.get("ipfs_daemon_repo") or ""),
                (self.ipfs_kubo_version_entry, settings.get("ipfs_kubo_version") or ""),
                (self.ipfs_kubo_url_entry, settings.get("ipfs_kubo_download_url") or ""),
                (self.hive_entry, settings.get("hive_api") or ""),
                (self.nodes_entry, ", ".join(settings.get("trusted_nodes") or [])),
                (self.secret_ipfs_user_id_entry, secrets.get("ipfs_user_id") or ""),
                (self.secret_ipfs_pin_surface_entry, secrets.get("ipfs_pin_surface") or ""),
                (self.secret_ipfs_pin_surface_token_entry, secrets.get("ipfs_pin_surface_token") or secrets.get("ipfs_bearer_token") or ""),
                (self.secret_hive_username_entry, secrets.get("hive_username") or ""),
                (self.secret_hive_posting_key_entry, secrets.get("hive_posting_key") or ""),
            ):
                entry.delete(0, "end")
                entry.insert(0, value)

        def on_bootstrap(self) -> None:
            self._run_worker(
                lambda: self.runtime.bootstrap_repository_data(force=False),
                lambda result: self._after_action(f"Bootstrap complete: {json.dumps(result)}"),
                status="Importing repo data into the encrypted garden vault...",
            )

        def on_add_plant(self) -> None:
            name = sanitize_text(self.plant_name_entry.get(), max_chars=120)
            species = sanitize_text(self.plant_species_entry.get(), max_chars=160)
            if not name:
                messagebox.showwarning("Kayla's Garden", "Enter a plant name first.")
                return

            def task() -> Any:
                return asdict(
                    self.runtime.add_plant(
                        name=name,
                        species=species or name,
                        hardiness_zone=sanitize_text(self.plant_zone_entry.get(), max_chars=64),
                        notes=sanitize_text(self.plant_notes_box.get("1.0", "end"), max_chars=2000),
                        privacy_class=self.plant_privacy_menu.get(),
                    )
                )

            self._run_worker(task, lambda result: self._after_add_plant(result), status="Creating plant passport...")

        def _after_add_plant(self, result: Any) -> None:
            self.refresh_all()
            self.status_var.set("Plant passport created.")
            messagebox.showinfo("Kayla's Garden", f"Created passport for {result.get('name')}.")

        def _pick_image_into(self, attr_name: str, label: Any, status_message: str) -> None:
            selected = filedialog.askopenfilename(
                title="Choose plant image",
                filetypes=[("Images", "*.jpg *.jpeg *.png *.webp"), ("All files", "*.*")],
            )
            if not selected:
                return
            setattr(self, attr_name, selected)
            label.configure(text=selected)
            self.status_var.set(status_message)

        def on_pick_image(self) -> None:
            self._pick_image_into("selected_image_path", self.image_path_label, "Observation image selected.")

        def on_pick_guide_image(self) -> None:
            self._pick_image_into("selected_guide_image_path", self.guide_image_path_label, "Guide context image selected.")

        def on_pick_lab_image(self) -> None:
            self._pick_image_into("selected_lab_image_path", self.lab_image_path_label, "Care lab image selected.")

        def on_publish_observation(self) -> None:
            plant_id = self._selected_plant_id(self.observe_plant_var)
            if not plant_id:
                messagebox.showwarning("Kayla's Garden", "Create or choose a plant first.")
                return
            note = sanitize_text(self.observe_note_box.get("1.0", "end"), max_chars=1200)
            if not note:
                messagebox.showwarning("Kayla's Garden", "Enter an observation note first.")
                return

            def parse_float(raw: str) -> Optional[float]:
                clean = sanitize_text(raw, max_chars=40)
                if not clean:
                    return None
                return float(clean)

            def task() -> Any:
                tags = [item.strip() for item in self.observe_tags_entry.get().split(",") if item.strip()]
                return self.runtime.record_observation(
                    plant_id=plant_id,
                    note=note,
                    image_path=self.selected_image_path,
                    latitude=parse_float(self.observe_lat_entry.get()),
                    longitude=parse_float(self.observe_lon_entry.get()),
                    privacy_class=self.observe_privacy_menu.get(),
                    extra_tags=tags,
                )

            self._run_worker(task, self._after_observation, status="Analyzing image, generating tags, and queueing IPFS/Hive outputs...")

        def _after_observation(self, result: Any) -> None:
            self._set_text(self.observe_result, json.dumps(result, indent=2, ensure_ascii=True))
            self.refresh_all()
            self.status_var.set("Observation stored, tagged, and queued for BloomTrace/RootMesh.")

        def on_care_brief(self) -> None:
            plant_id = self._selected_plant_id(self.care_plant_var)
            if not plant_id:
                messagebox.showwarning("Kayla's Garden", "Choose a plant passport first.")
                return
            question = sanitize_text(self.care_question_entry.get() or "What should I watch next?", max_chars=300)
            self._run_worker(
                lambda: self.runtime.care_brief(plant_id, question=question),
                lambda result: self._set_text(self.care_text, json.dumps(result, indent=2, ensure_ascii=True)),
                status="Generating care brief...",
            )

        def on_new_guide_thread(self) -> None:
            plant_id = self._selected_plant_id(self.guide_plant_var)
            if not plant_id:
                messagebox.showwarning("Kayla's Garden", "Choose a plant passport first.")
                return
            opening = sanitize_text(self.guide_question_box.get("1.0", "end"), max_chars=240) or "Plant health thread"
            thread = self._create_guide_thread(plant_id, opening)
            self.guide_thread_var.set(self._guide_thread_label(thread))
            self._refresh_guide_threads_ui()
            self.status_var.set("Started a new plant health chat thread.")

        def on_chat_with_plant(self) -> None:
            plant_id = self._selected_plant_id(self.guide_plant_var)
            if not plant_id:
                messagebox.showwarning("Kayla's Garden", "Choose a plant passport first.")
                return
            question = sanitize_text(self.guide_question_box.get("1.0", "end"), max_chars=1400)
            if not question:
                messagebox.showwarning("Kayla's Garden", "Enter a plant question first.")
                return
            thread = self._active_guide_thread() or self._create_guide_thread(plant_id, question)
            self.guide_thread_var.set(self._guide_thread_label(thread))
            self._append_guide_message(thread, "user", question, image_path=self.selected_guide_image_path)
            self._refresh_guide_threads_ui()

            def after_chat(result: Any) -> None:
                guide_text = sanitize_text(str(result.get("guide") or ""), max_chars=7000)
                active_thread = self._active_guide_thread() or thread
                self._append_guide_message(active_thread, "assistant", guide_text, image_path=self.selected_guide_image_path)
                self._refresh_guide_threads_ui()
                self.status_var.set("Plant health reply added to the active thread.")

            self._run_worker(
                lambda: self.runtime.plant_guide_chat(plant_id, question=question, image_path=self.selected_guide_image_path),
                after_chat,
                status="Asking the long-context plant guide...",
            )

        def on_diagnose_problem(self) -> None:
            plant_id = self._selected_plant_id(self.lab_plant_var)
            if not plant_id:
                messagebox.showwarning("Kayla's Garden", "Choose a plant passport first.")
                return
            symptom_note = sanitize_text(self.diagnosis_note_box.get("1.0", "end"), max_chars=1400)
            if not symptom_note:
                messagebox.showwarning("Kayla's Garden", "Describe the plant problem first.")
                return
            tags = [item.strip() for item in self.lab_tags_entry.get().split(",") if item.strip()]
            self._run_worker(
                lambda: self.runtime.diagnose_plant_problem(
                    plant_id=plant_id,
                    symptom_note=symptom_note,
                    image_path=self.selected_lab_image_path,
                    extra_tags=tags,
                ),
                self._after_care_lab_action,
                status="Running plant problem diagnosis...",
            )

        def on_record_health_checkin(self) -> None:
            plant_id = self._selected_plant_id(self.lab_plant_var)
            if not plant_id:
                messagebox.showwarning("Kayla's Garden", "Choose a plant passport first.")
                return
            note = sanitize_text(self.checkin_note_box.get("1.0", "end"), max_chars=1200)
            tags = [item.strip() for item in self.lab_tags_entry.get().split(",") if item.strip()]
            self._run_worker(
                lambda: self.runtime.record_health_checkin(
                    plant_id=plant_id,
                    note=note,
                    image_path=self.selected_lab_image_path,
                    extra_tags=tags,
                ),
                self._after_care_lab_action,
                status="Recording plant health check-in...",
            )

        def on_publish_technique(self) -> None:
            plant_id = self._selected_plant_id(self.lab_plant_var)
            if not plant_id:
                messagebox.showwarning("Kayla's Garden", "Choose a plant passport first.")
                return
            title = sanitize_text(self.technique_title_entry.get(), max_chars=160)
            summary = sanitize_text(self.technique_summary_box.get("1.0", "end"), max_chars=2000)
            if not title or not summary:
                messagebox.showwarning("Kayla's Garden", "Enter at least a technique title and summary.")
                return
            steps = [item.strip() for item in self.technique_steps_box.get("1.0", "end").splitlines() if item.strip()]
            tags = [item.strip() for item in self.technique_tags_entry.get().split(",") if item.strip()]
            self._run_worker(
                lambda: self.runtime.share_technique(
                    plant_id=plant_id,
                    title=title,
                    problem_focus=sanitize_text(self.technique_problem_entry.get(), max_chars=200),
                    summary=summary,
                    steps=steps,
                    tags=tags,
                    privacy_class=self.technique_privacy_menu.get(),
                ),
                self._after_care_lab_action,
                status="Publishing shared technique card...",
            )

        def _after_care_lab_action(self, result: Any) -> None:
            self._set_text(self.care_lab_result, json.dumps(result, indent=2, ensure_ascii=True))
            self.refresh_all()
            self.status_var.set("Care lab action completed and queued for local-first sync.")

        def on_install_ipfs_daemon(self) -> None:
            self.on_save_settings(show_dialog=False, refresh=False)
            self._run_worker(
                lambda: self.runtime.install_ipfs_daemon(),
                lambda result: self._after_action(f"Managed IPFS install finished.\n{json.dumps(result, indent=2, ensure_ascii=True)}"),
                status="Installing managed Kubo into the garden runtime...",
            )

        def on_save_network_secrets(self) -> None:
            secrets = {
                "ipfs_user_id": sanitize_text(self.secret_ipfs_user_id_entry.get(), max_chars=160),
                "ipfs_pin_surface": sanitize_text(self.secret_ipfs_pin_surface_entry.get(), max_chars=160),
                "ipfs_pin_surface_token": sanitize_text(self.secret_ipfs_pin_surface_token_entry.get(), max_chars=400),
                "ipfs_bearer_token": sanitize_text(self.secret_ipfs_pin_surface_token_entry.get(), max_chars=400),
                "hive_username": sanitize_text(self.secret_hive_username_entry.get(), max_chars=80),
                "hive_posting_key": sanitize_text(self.secret_hive_posting_key_entry.get(), max_chars=800),
            }
            self._run_worker(
                lambda: self.runtime.save_network_secrets(secrets),
                lambda result: self._after_action(f"Encrypted credentials saved.\n{json.dumps(result, indent=2, ensure_ascii=True)}"),
                status="Sealing network credentials into the AES-GCM secret vault...",
            )

        def on_add_peer_user(self) -> None:
            display_name = sanitize_text(self.peer_display_name_entry.get(), max_chars=160)
            if not display_name:
                messagebox.showwarning("Kayla's Garden", "Enter a peer display name first.")
                return
            self._run_worker(
                lambda: self.runtime.add_peer_user(
                    display_name=display_name,
                    hive_username=sanitize_text(self.peer_hive_username_entry.get(), max_chars=80),
                    ipfs_user_id=sanitize_text(self.peer_ipfs_user_id_entry.get(), max_chars=160),
                    pin_group=sanitize_text(self.peer_pin_group_entry.get(), max_chars=160),
                    notes=sanitize_text(self.peer_notes_box.get("1.0", "end"), max_chars=1200),
                ),
                self._after_community_action,
                status="Adding active plant user to the community graph...",
            )

        def on_create_pin_group(self) -> None:
            group_name = sanitize_text(self.community_group_name_entry.get(), max_chars=160)
            if not group_name:
                messagebox.showwarning("Kayla's Garden", "Enter a pin group name first.")
                return
            description = sanitize_text(self.community_group_description_box.get("1.0", "end"), max_chars=2000)
            self._run_worker(
                lambda: self.runtime.create_pin_group(
                    name=group_name,
                    description=description,
                    privacy_class=self.community_group_privacy_menu.get(),
                    tags=[item.strip() for item in group_name.lower().split() if item.strip()],
                ),
                self._after_community_action,
                status="Creating community pin group...",
            )

        def on_post_pin_group_comment(self) -> None:
            group_ref = sanitize_text(self.community_group_name_entry.get(), max_chars=160)
            if not group_ref:
                messagebox.showwarning("Kayla's Garden", "Enter a pin group name first.")
                return
            body = sanitize_text(self.community_comment_box.get("1.0", "end"), max_chars=4000)
            if not body:
                messagebox.showwarning("Kayla's Garden", "Enter a community comment first.")
                return
            plant_id = self._selected_plant_id(self.community_plant_var) or ""
            target_cids = [item.strip() for item in self.community_target_cids_entry.get().split(",") if item.strip()]
            self._run_worker(
                lambda: self.runtime.post_pin_group_comment(
                    group_ref=group_ref,
                    body=body,
                    plant_id=plant_id,
                    target_cids=target_cids,
                ),
                self._after_community_action,
                status="Posting community group comment and preparing sync payloads...",
            )

        def on_request_peer_pin(self) -> None:
            group_ref = sanitize_text(self.community_group_name_entry.get(), max_chars=160)
            cid = sanitize_text(self.community_pin_request_cid_entry.get(), max_chars=160)
            if not group_ref or not cid:
                messagebox.showwarning("Kayla's Garden", "Enter both a pin group and a CID first.")
                return
            target_peer_ids = [item.strip() for item in self.community_pin_request_peers_entry.get().split(",") if item.strip()]
            note = sanitize_text(self.community_pin_request_note_box.get("1.0", "end"), max_chars=2000)
            self._run_worker(
                lambda: self.runtime.request_peer_pin(
                    group_ref=group_ref,
                    cid=cid,
                    target_peer_ids=target_peer_ids,
                    note=note,
                ),
                self._after_community_action,
                status="Queueing peer pin acceleration request...",
            )

        def _after_community_action(self, result: Any) -> None:
            self._set_text(self.community_result, json.dumps(result, indent=2, ensure_ascii=True))
            self.refresh_all()
            self.status_var.set("Community action completed and queued for local-first sync.")

        def on_start_ipfs_daemon(self) -> None:
            self.on_save_settings(show_dialog=False, refresh=False)
            self._run_worker(
                lambda: self.runtime.start_ipfs_daemon(),
                lambda result: self._after_action(f"Managed IPFS daemon status:\n{json.dumps(result, indent=2, ensure_ascii=True)}"),
                status="Starting managed IPFS daemon...",
            )

        def on_stop_ipfs_daemon(self) -> None:
            self._run_worker(
                lambda: self.runtime.stop_ipfs_daemon(),
                lambda result: self._after_action(f"Managed IPFS daemon status:\n{json.dumps(result, indent=2, ensure_ascii=True)}"),
                status="Stopping managed IPFS daemon...",
            )

        def on_save_settings(self, *, show_dialog: bool = False, refresh: bool = True) -> None:
            local_first_only = self.local_first_var.get() == "on"
            cloud_mode = self.cloud_mode_var.get() == "on" and not local_first_only
            settings = {
                "location": sanitize_text(self.location_entry.get(), max_chars=120),
                "theme": sanitize_text(self.theme_entry.get() or "green", max_chars=32),
                "network_mode": "local-first" if local_first_only else normalize_network_mode(self.network_mode_var.get()),
                "local_first_only": local_first_only,
                "cloud_mode": cloud_mode,
                "ipfs_enabled": self.ipfs_enabled_var.get() == "on" and cloud_mode,
                "ipfs_api": sanitize_text(self.ipfs_entry.get(), max_chars=240),
                "ipfs_mfs_root": sanitize_text(self.ipfs_root_entry.get() or "/kaylas-garden", max_chars=240),
                "ipfs_daemon_enabled": self.ipfs_daemon_enabled_var.get() == "on",
                "ipfs_daemon_auto_install": self.ipfs_daemon_auto_install_var.get() == "on",
                "ipfs_daemon_auto_start": self.ipfs_daemon_auto_start_var.get() == "on",
                "ipfs_daemon_binary": sanitize_text(self.ipfs_daemon_binary_entry.get(), max_chars=400),
                "ipfs_daemon_repo": sanitize_text(self.ipfs_daemon_repo_entry.get() or str(self.runtime.paths.ipfs_repo_dir), max_chars=400),
                "ipfs_kubo_version": sanitize_text(self.ipfs_kubo_version_entry.get(), max_chars=80),
                "ipfs_kubo_download_url": sanitize_text(self.ipfs_kubo_url_entry.get(), max_chars=400),
                "hive_enabled": self.hive_enabled_var.get() == "on" and cloud_mode,
                "hive_api": sanitize_text(self.hive_entry.get(), max_chars=240),
                "hive_broadcast_enabled": self.hive_broadcast_var.get() == "on" and cloud_mode,
                "trusted_nodes": [item.strip() for item in self.nodes_entry.get().split(",") if item.strip()],
            }
            save_settings(settings, self.runtime.paths)
            self.runtime.reload_settings()
            self.runtime.save()
            if refresh:
                self.refresh_all()
            self.status_var.set("Runtime settings saved.")
            if show_dialog:
                messagebox.showinfo("Kayla's Garden", "Runtime settings saved.")

        def on_verify_model(self) -> None:
            self._run_worker(
                lambda: self.runtime.model_manager.verify_primary_model(password=self.runtime.password),
                lambda result: self._after_action(f"Model hash: {result[0]}\nMatches expected: {result[1]}"),
                status="Verifying LiteRT-LM model hash...",
            )

        def on_download_model(self) -> None:
            self._run_worker(
                lambda: self.runtime.model_manager.download_primary_model(password=self.runtime.password),
                lambda result: self._after_action(f"Downloaded model with sha256 {result}"),
                status="Downloading and sealing LiteRT-LM model...",
            )

        def _after_action(self, message: str) -> None:
            self.refresh_all()
            self.status_var.set(message)
            messagebox.showinfo("Kayla's Garden", message)
else:
    class GardenApp:
        def __init__(self, runtime: KaylasGardenRuntime):
            _ = runtime
            raise RuntimeError(f"customtkinter is required to launch the UI. Import error: {CUSTOMTKINTER_IMPORT_ERROR}")

def build_arg_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Kayla's Garden customtkinter desktop runtime")
    parser.add_argument("--root", default=str(default_storage_root()), help="Runtime storage root")
    parser.add_argument("--password", default=None, help="Optional vault password")
    subparsers = parser.add_subparsers(dest="command")

    bootstrap = subparsers.add_parser("bootstrap", help="Import repo plant/settings data into the encrypted runtime")
    bootstrap.add_argument("--force", action="store_true", help="Re-import even if bootstrap already happened")

    subparsers.add_parser("summary", help="Show current garden runtime summary")

    add_plant = subparsers.add_parser("add-plant", help="Create a new plant passport")
    add_plant.add_argument("--name", required=True)
    add_plant.add_argument("--species", required=True)
    add_plant.add_argument("--zone", default="")
    add_plant.add_argument("--notes", default="")
    add_plant.add_argument("--privacy", default=None)

    observe = subparsers.add_parser("observe", help="Record a new encrypted plant observation")
    observe.add_argument("--plant-id", required=True)
    observe.add_argument("--note", required=True)
    observe.add_argument("--image", default=None)
    observe.add_argument("--lat", type=float, default=None)
    observe.add_argument("--lon", type=float, default=None)
    observe.add_argument("--privacy", default=None)
    observe.add_argument("--tags", default="", help="Comma-separated manual tags")

    care = subparsers.add_parser("care-brief", help="Generate a short care brief for one plant")
    care.add_argument("--plant-id", required=True)
    care.add_argument("--question", default="What should I watch next?")

    guide = subparsers.add_parser("plant-guide", help="Chat with one plant using its history and optional image context")
    guide.add_argument("--plant-id", required=True)
    guide.add_argument("--question", required=True)
    guide.add_argument("--image", default=None)

    diagnose = subparsers.add_parser("diagnose", help="Run a plant problem diagnosis and queue the record")
    diagnose.add_argument("--plant-id", required=True)
    diagnose.add_argument("--note", required=True)
    diagnose.add_argument("--image", default=None)
    diagnose.add_argument("--lat", type=float, default=None)
    diagnose.add_argument("--lon", type=float, default=None)
    diagnose.add_argument("--tags", default="", help="Comma-separated diagnosis tags")

    checkin = subparsers.add_parser("health-checkin", help="Record a plant health check-in")
    checkin.add_argument("--plant-id", required=True)
    checkin.add_argument("--note", default="")
    checkin.add_argument("--image", default=None)
    checkin.add_argument("--tags", default="", help="Comma-separated health check-in tags")

    technique = subparsers.add_parser("share-technique", help="Publish a shared plant technique card")
    technique.add_argument("--plant-id", required=True)
    technique.add_argument("--title", required=True)
    technique.add_argument("--problem-focus", default="")
    technique.add_argument("--summary", required=True)
    technique.add_argument("--steps", default="", help="One step per line or use | as a separator")
    technique.add_argument("--tags", default="", help="Comma-separated technique tags")
    technique.add_argument("--privacy", default=None)

    secret_status = subparsers.add_parser("secret-status", help="Show encrypted network secret vault status")
    _ = secret_status
    save_secrets = subparsers.add_parser("save-network-secrets", help="Save IPFS/Hive identities into the encrypted AES-GCM secret vault")
    save_secrets.add_argument("--ipfs-user-id", default="")
    save_secrets.add_argument("--ipfs-pin-surface", default="")
    save_secrets.add_argument("--ipfs-pin-surface-token", default="")
    save_secrets.add_argument("--hive-username", default="")
    save_secrets.add_argument("--hive-posting-key", default="")

    subparsers.add_parser("community-summary", help="Show peer users, pin groups, comments, and co-pin requests")
    add_peer = subparsers.add_parser("add-peer-user", help="Add an active peer plant user")
    add_peer.add_argument("--display-name", required=True)
    add_peer.add_argument("--hive-username", default="")
    add_peer.add_argument("--ipfs-user-id", default="")
    add_peer.add_argument("--pin-group", default="")
    add_peer.add_argument("--notes", default="")

    create_group = subparsers.add_parser("create-pin-group", help="Create a shared pin group")
    create_group.add_argument("--name", required=True)
    create_group.add_argument("--description", default="")
    create_group.add_argument("--privacy", default="shared")
    create_group.add_argument("--tags", default="")
    create_group.add_argument("--member-peer-ids", default="")

    post_group = subparsers.add_parser("post-pin-group", help="Post a comment under a plant-user pin group")
    post_group.add_argument("--group", required=True)
    post_group.add_argument("--body", required=True)
    post_group.add_argument("--plant-id", default="")
    post_group.add_argument("--cids", default="")

    request_pin = subparsers.add_parser("request-peer-pin", help="Ask peer plant users to co-pin a CID")
    request_pin.add_argument("--group", required=True)
    request_pin.add_argument("--cid", required=True)
    request_pin.add_argument("--target-peer-ids", default="")
    request_pin.add_argument("--note", default="")

    subparsers.add_parser("activity", help="Show recent plant activity across observations, diagnoses, check-ins, and techniques")
    subparsers.add_parser("watchlist", help="Show the current garden watchlist and triage priorities")
    subparsers.add_parser("garden-digest", help="Show the current garden digest with watchlist and recent activity")

    subparsers.add_parser("network-status", help="Show local-first/cloud network state, IPFS, Hive, and OQS status")
    subparsers.add_parser("ipfs-daemon-status", help="Show managed IPFS daemon status")
    subparsers.add_parser("ipfs-daemon-install", help="Install the managed IPFS daemon if enabled in settings")
    subparsers.add_parser("ipfs-daemon-start", help="Start the managed IPFS daemon if enabled in settings")
    subparsers.add_parser("ipfs-daemon-stop", help="Stop the managed IPFS daemon")
    subparsers.add_parser("oqs-status", help="Show OQS repos, pip requirements, build script, and available mechanisms")
    oqs_search = subparsers.add_parser("oqs-search", help="Search OQS KEM/signature mechanisms")
    oqs_search.add_argument("--query", default="")

    subparsers.add_parser("model-status", help="Show LiteRT model catalog and installation status")
    subparsers.add_parser("verify-model", help="Verify the primary LiteRT model hash")
    subparsers.add_parser("download-model", help="Download and encrypt the primary LiteRT model")

    return parser


def main(argv: Optional[List[str]] = None) -> int:
    parser = build_arg_parser()
    args = parser.parse_args(argv)
    runtime = KaylasGardenRuntime(root=args.root, password=args.password)

    if args.command is None:
        if ctk is None:
            print(f"customtkinter is required to launch the desktop app. Import error: {CUSTOMTKINTER_IMPORT_ERROR}")
            return 1
        ctk.set_appearance_mode("dark")
        ctk.set_default_color_theme("green")
        app = GardenApp(runtime)
        app.mainloop()
        return 0

    if args.command == "bootstrap":
        print_json(runtime.bootstrap_repository_data(force=bool(args.force)))
        return 0

    if args.command == "summary":
        print_json(runtime.summary())
        return 0

    if args.command == "add-plant":
        passport = runtime.add_plant(
            name=args.name,
            species=args.species,
            hardiness_zone=args.zone,
            notes=args.notes,
            privacy_class=args.privacy,
        )
        print_json(asdict(passport))
        return 0

    if args.command == "observe":
        print_json(
            runtime.record_observation(
                plant_id=args.plant_id,
                note=args.note,
                image_path=args.image,
                latitude=args.lat,
                longitude=args.lon,
                privacy_class=args.privacy,
                extra_tags=[item.strip() for item in args.tags.split(",") if item.strip()],
            )
        )
        return 0

    if args.command == "care-brief":
        print_json(runtime.care_brief(args.plant_id, question=args.question))
        return 0

    if args.command == "plant-guide":
        print_json(runtime.plant_guide_chat(args.plant_id, question=args.question, image_path=args.image))
        return 0

    if args.command == "diagnose":
        print_json(
            runtime.diagnose_plant_problem(
                plant_id=args.plant_id,
                symptom_note=args.note,
                image_path=args.image,
                latitude=args.lat,
                longitude=args.lon,
                extra_tags=[item.strip() for item in args.tags.split(",") if item.strip()],
            )
        )
        return 0

    if args.command == "health-checkin":
        print_json(
            runtime.record_health_checkin(
                plant_id=args.plant_id,
                note=args.note,
                image_path=args.image,
                extra_tags=[item.strip() for item in args.tags.split(",") if item.strip()],
            )
        )
        return 0

    if args.command == "share-technique":
        step_separators = args.steps.replace("|", "\n")
        print_json(
            runtime.share_technique(
                plant_id=args.plant_id,
                title=args.title,
                problem_focus=args.problem_focus,
                summary=args.summary,
                steps=[item.strip() for item in step_separators.splitlines() if item.strip()],
                tags=[item.strip() for item in args.tags.split(",") if item.strip()],
                privacy_class=args.privacy,
            )
        )
        return 0

    if args.command == "secret-status":
        print_json(runtime.network_secret_status())
        return 0

    if args.command == "save-network-secrets":
        print_json(
            runtime.save_network_secrets(
                {
                    "ipfs_user_id": args.ipfs_user_id,
                    "ipfs_pin_surface": args.ipfs_pin_surface,
                    "ipfs_pin_surface_token": args.ipfs_pin_surface_token,
                    "ipfs_bearer_token": args.ipfs_pin_surface_token,
                    "hive_username": args.hive_username,
                    "hive_posting_key": args.hive_posting_key,
                }
            )
        )
        return 0

    if args.command == "community-summary":
        print_json(runtime.community_summary())
        return 0

    if args.command == "add-peer-user":
        print_json(
            runtime.add_peer_user(
                display_name=args.display_name,
                hive_username=args.hive_username,
                ipfs_user_id=args.ipfs_user_id,
                pin_group=args.pin_group,
                notes=args.notes,
            )
        )
        return 0

    if args.command == "create-pin-group":
        print_json(
            runtime.create_pin_group(
                name=args.name,
                description=args.description,
                privacy_class=args.privacy,
                tags=[item.strip() for item in args.tags.split(",") if item.strip()],
                member_peer_ids=[item.strip() for item in args.member_peer_ids.split(",") if item.strip()],
            )
        )
        return 0

    if args.command == "post-pin-group":
        print_json(
            runtime.post_pin_group_comment(
                group_ref=args.group,
                body=args.body,
                plant_id=args.plant_id,
                target_cids=[item.strip() for item in args.cids.split(",") if item.strip()],
            )
        )
        return 0

    if args.command == "request-peer-pin":
        print_json(
            runtime.request_peer_pin(
                group_ref=args.group,
                cid=args.cid,
                target_peer_ids=[item.strip() for item in args.target_peer_ids.split(",") if item.strip()],
                note=args.note,
            )
        )
        return 0

    if args.command == "activity":
        print_json(runtime.activity_timeline())
        return 0

    if args.command == "watchlist":
        print_json(runtime.watchlist_report())
        return 0

    if args.command == "garden-digest":
        print_json(runtime.greenhouse_digest())
        return 0

    if args.command == "network-status":
        print_json(runtime.network_status())
        return 0

    if args.command == "ipfs-daemon-status":
        print_json(runtime.ipfs_daemon_status())
        return 0

    if args.command == "ipfs-daemon-install":
        print_json(runtime.install_ipfs_daemon())
        return 0

    if args.command == "ipfs-daemon-start":
        print_json(runtime.start_ipfs_daemon())
        return 0

    if args.command == "ipfs-daemon-stop":
        print_json(runtime.stop_ipfs_daemon())
        return 0

    if args.command == "oqs-status":
        print_json(runtime.oqs_advisor.status())
        return 0

    if args.command == "oqs-search":
        print_json(runtime.oqs_advisor.search(args.query))
        return 0

    if args.command == "model-status":
        print_json(runtime.model_manager.model_status())
        return 0

    if args.command == "verify-model":
        sha, matches = runtime.model_manager.verify_primary_model(password=args.password)
        print_json({"sha256": sha, "matches_expected_hash": matches})
        return 0

    if args.command == "download-model":
        print_json({"sha256": runtime.model_manager.download_primary_model(password=args.password)})
        return 0

    parser.error(f"Unsupported command: {args.command}")
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
