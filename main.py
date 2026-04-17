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
            self.refresh_all()

        def _build_sidebar(self) -> None:
            sidebar = ctk.CTkFrame(self, width=260, corner_radius=0)
            sidebar.grid(row=0, column=0, sticky="nsew")
            sidebar.grid_rowconfigure(99, weight=1)

            ctk.CTkLabel(
                sidebar,
                text="Kayla's Garden",
                font=ctk.CTkFont(size=26, weight="bold"),
            ).grid(row=0, column=0, padx=20, pady=(24, 6), sticky="w")
            ctk.CTkLabel(
                sidebar,
                text="Local-first plant tagging, secure storage, IPFS, and Hive checkpoints.",
                wraplength=210,
                justify="left",
                text_color="#B7D7B0",
            ).grid(row=1, column=0, padx=20, pady=(0, 18), sticky="w")

            self.identity_label = ctk.CTkLabel(sidebar, text="", wraplength=210, justify="left")
            self.identity_label.grid(row=2, column=0, padx=20, pady=(0, 16), sticky="w")

            ctk.CTkButton(sidebar, text="Refresh", command=self.refresh_all).grid(row=3, column=0, padx=20, pady=6, sticky="ew")
            ctk.CTkButton(sidebar, text="Bootstrap Repo Data", command=self.on_bootstrap).grid(row=4, column=0, padx=20, pady=6, sticky="ew")
            ctk.CTkButton(sidebar, text="Verify LiteRT Model", command=self.on_verify_model).grid(row=5, column=0, padx=20, pady=6, sticky="ew")
            ctk.CTkButton(sidebar, text="Download LiteRT Model", command=self.on_download_model).grid(row=6, column=0, padx=20, pady=6, sticky="ew")

            self.sidebar_metrics = ctk.CTkTextbox(sidebar, height=170)
            self.sidebar_metrics.grid(row=7, column=0, padx=20, pady=(16, 10), sticky="nsew")

            ctk.CTkLabel(
                sidebar,
                textvariable=self.status_var,
                wraplength=210,
                justify="left",
                text_color="#D6E8CF",
            ).grid(row=100, column=0, padx=20, pady=(12, 24), sticky="sw")

        def _build_tabs(self) -> None:
            self.tabs = ctk.CTkTabview(self)
            self.tabs.grid(row=0, column=1, sticky="nsew", padx=18, pady=18)
            self.tabs.add("Dashboard")
            self.tabs.add("Plants")
            self.tabs.add("Observe")
            self.tabs.add("Guide")
            self.tabs.add("Care Lab")
            self.tabs.add("Community")
            self.tabs.add("Insights")
            self.tabs.add("Settings")
            self.tabs.add("Models")

            self._build_dashboard_tab(self.tabs.tab("Dashboard"))
            self._build_plants_tab(self.tabs.tab("Plants"))
            self._build_observe_tab(self.tabs.tab("Observe"))
            self._build_guide_tab(self.tabs.tab("Guide"))
            self._build_care_lab_tab(self.tabs.tab("Care Lab"))
            self._build_community_tab(self.tabs.tab("Community"))
            self._build_insights_tab(self.tabs.tab("Insights"))
            self._build_network_tab(self.tabs.tab("Settings"))
            self._build_models_tab(self.tabs.tab("Models"))

        def _build_dashboard_tab(self, tab: Any) -> None:
            tab.grid_columnconfigure(0, weight=3)
            tab.grid_columnconfigure(1, weight=2)
            tab.grid_rowconfigure(1, weight=1)

            ctk.CTkLabel(tab, text="Garden Overview", font=ctk.CTkFont(size=24, weight="bold")).grid(
                row=0, column=0, padx=18, pady=(18, 8), sticky="w"
            )
            self.dashboard_summary = ctk.CTkTextbox(tab)
            self.dashboard_summary.grid(row=1, column=0, padx=18, pady=(0, 18), sticky="nsew")

            right = ctk.CTkFrame(tab)
            right.grid(row=1, column=1, padx=(0, 18), pady=(0, 18), sticky="nsew")
            right.grid_rowconfigure(1, weight=1)
            right.grid_columnconfigure(0, weight=1)

            ctk.CTkLabel(right, text="Anchor + Sync Queue", font=ctk.CTkFont(size=18, weight="bold")).grid(
                row=0, column=0, padx=18, pady=(18, 10), sticky="w"
            )
            self.dashboard_queue = ctk.CTkTextbox(right)
            self.dashboard_queue.grid(row=1, column=0, padx=18, pady=(0, 18), sticky="nsew")

        def _build_plants_tab(self, tab: Any) -> None:
            tab.grid_columnconfigure(0, weight=2)
            tab.grid_columnconfigure(1, weight=3)
            tab.grid_rowconfigure(1, weight=1)

            form = ctk.CTkFrame(tab)
            form.grid(row=0, column=0, rowspan=2, padx=18, pady=18, sticky="nsew")
            form.grid_columnconfigure(0, weight=1)

            ctk.CTkLabel(form, text="Create Plant Passport", font=ctk.CTkFont(size=20, weight="bold")).grid(
                row=0, column=0, padx=18, pady=(18, 14), sticky="w"
            )

            self.plant_name_entry = ctk.CTkEntry(form, placeholder_text="Plant name")
            self.plant_name_entry.grid(row=1, column=0, padx=18, pady=6, sticky="ew")
            self.plant_species_entry = ctk.CTkEntry(form, placeholder_text="Species or leave broad label")
            self.plant_species_entry.grid(row=2, column=0, padx=18, pady=6, sticky="ew")
            self.plant_zone_entry = ctk.CTkEntry(form, placeholder_text="Hardiness zone")
            self.plant_zone_entry.grid(row=3, column=0, padx=18, pady=6, sticky="ew")
            self.plant_notes_box = ctk.CTkTextbox(form, height=140)
            self.plant_notes_box.grid(row=4, column=0, padx=18, pady=6, sticky="ew")
            self.plant_notes_box.insert("1.0", "Plant notes, bed details, or care context")
            self.plant_privacy_menu = ctk.CTkOptionMenu(form, values=["private", "shared", "public"])
            self.plant_privacy_menu.grid(row=5, column=0, padx=18, pady=6, sticky="ew")
            ctk.CTkButton(form, text="Add Plant Passport", command=self.on_add_plant).grid(
                row=6, column=0, padx=18, pady=(10, 18), sticky="ew"
            )

            right = ctk.CTkFrame(tab)
            right.grid(row=0, column=1, rowspan=2, padx=(0, 18), pady=18, sticky="nsew")
            right.grid_columnconfigure(0, weight=1)
            right.grid_rowconfigure(1, weight=1)
            right.grid_rowconfigure(4, weight=1)

            ctk.CTkLabel(right, text="Plant Passports", font=ctk.CTkFont(size=20, weight="bold")).grid(
                row=0, column=0, padx=18, pady=(18, 10), sticky="w"
            )
            self.plants_text = ctk.CTkTextbox(right)
            self.plants_text.grid(row=1, column=0, padx=18, pady=(0, 16), sticky="nsew")

            self.care_picker = ctk.CTkOptionMenu(right, variable=self.care_plant_var, values=["No plants yet"])
            self.care_picker.grid(row=2, column=0, padx=18, pady=6, sticky="ew")
            self.care_question_entry = ctk.CTkEntry(right, placeholder_text="What should I watch next?")
            self.care_question_entry.grid(row=3, column=0, padx=18, pady=6, sticky="ew")
            ctk.CTkButton(right, text="Generate Care Brief", command=self.on_care_brief).grid(
                row=4, column=0, padx=18, pady=(6, 10), sticky="new"
            )
            self.care_text = ctk.CTkTextbox(right, height=180)
            self.care_text.grid(row=5, column=0, padx=18, pady=(0, 18), sticky="nsew")

        def _build_observe_tab(self, tab: Any) -> None:
            tab.grid_columnconfigure(0, weight=2)
            tab.grid_columnconfigure(1, weight=3)
            tab.grid_rowconfigure(1, weight=1)

            form = ctk.CTkFrame(tab)
            form.grid(row=0, column=0, rowspan=2, padx=18, pady=18, sticky="nsew")
            form.grid_columnconfigure(0, weight=1)

            ctk.CTkLabel(form, text="Observation Studio", font=ctk.CTkFont(size=20, weight="bold")).grid(
                row=0, column=0, padx=18, pady=(18, 14), sticky="w"
            )
            self.observe_picker = ctk.CTkOptionMenu(form, variable=self.observe_plant_var, values=["No plants yet"])
            self.observe_picker.grid(row=1, column=0, padx=18, pady=6, sticky="ew")
            self.observe_lat_entry = ctk.CTkEntry(form, placeholder_text="Latitude")
            self.observe_lat_entry.grid(row=2, column=0, padx=18, pady=6, sticky="ew")
            self.observe_lon_entry = ctk.CTkEntry(form, placeholder_text="Longitude")
            self.observe_lon_entry.grid(row=3, column=0, padx=18, pady=6, sticky="ew")
            self.observe_tags_entry = ctk.CTkEntry(form, placeholder_text="Manual tags, comma separated")
            self.observe_tags_entry.grid(row=4, column=0, padx=18, pady=6, sticky="ew")
            self.observe_privacy_menu = ctk.CTkOptionMenu(form, values=["private", "shared", "public"])
            self.observe_privacy_menu.grid(row=5, column=0, padx=18, pady=6, sticky="ew")
            self.observe_note_box = ctk.CTkTextbox(form, height=220)
            self.observe_note_box.grid(row=6, column=0, padx=18, pady=6, sticky="ew")
            self.observe_note_box.insert("1.0", "Describe what you see in the plant image or in person.")
            ctk.CTkButton(form, text="Choose Plant Image", command=self.on_pick_image).grid(
                row=7, column=0, padx=18, pady=(8, 6), sticky="ew"
            )
            self.image_path_label = ctk.CTkLabel(form, text="No image selected", wraplength=320, justify="left")
            self.image_path_label.grid(row=8, column=0, padx=18, pady=(0, 8), sticky="w")
            ctk.CTkButton(form, text="Identify + Publish to LeafVault", command=self.on_publish_observation).grid(
                row=9, column=0, padx=18, pady=(8, 18), sticky="ew"
            )

            right = ctk.CTkFrame(tab)
            right.grid(row=0, column=1, rowspan=2, padx=(0, 18), pady=18, sticky="nsew")
            right.grid_columnconfigure(0, weight=1)
            right.grid_rowconfigure(1, weight=1)

            ctk.CTkLabel(right, text="Published Observation", font=ctk.CTkFont(size=20, weight="bold")).grid(
                row=0, column=0, padx=18, pady=(18, 10), sticky="w"
            )
            self.observe_result = ctk.CTkTextbox(right)
            self.observe_result.grid(row=1, column=0, padx=18, pady=(0, 18), sticky="nsew")

        def _build_guide_tab(self, tab: Any) -> None:
            tab.grid_columnconfigure(0, weight=2)
            tab.grid_columnconfigure(1, weight=3)
            tab.grid_rowconfigure(0, weight=1)

            left = ctk.CTkFrame(tab)
            left.grid(row=0, column=0, padx=18, pady=18, sticky="nsew")
            left.grid_columnconfigure(0, weight=1)

            ctk.CTkLabel(left, text="Chat With A Plant", font=ctk.CTkFont(size=20, weight="bold")).grid(
                row=0, column=0, padx=18, pady=(18, 12), sticky="w"
            )
            self.guide_picker = ctk.CTkOptionMenu(left, variable=self.guide_plant_var, values=["No plants yet"])
            self.guide_picker.grid(row=1, column=0, padx=18, pady=6, sticky="ew")
            self.guide_question_box = ctk.CTkTextbox(left, height=260)
            self.guide_question_box.grid(row=2, column=0, padx=18, pady=6, sticky="ew")
            self.guide_question_box.insert(
                "1.0",
                "Tell me what changed since the last photos, what looks most likely right now, and what I should inspect next.",
            )
            ctk.CTkButton(left, text="Choose Current Context Image", command=self.on_pick_guide_image).grid(
                row=3, column=0, padx=18, pady=(8, 6), sticky="ew"
            )
            self.guide_image_path_label = ctk.CTkLabel(left, text="No current guide image selected", wraplength=320, justify="left")
            self.guide_image_path_label.grid(row=4, column=0, padx=18, pady=(0, 8), sticky="w")
            ctk.CTkButton(left, text="Ask The Plant Guide", command=self.on_chat_with_plant).grid(
                row=5, column=0, padx=18, pady=(8, 18), sticky="ew"
            )

            right = ctk.CTkFrame(tab)
            right.grid(row=0, column=1, padx=(0, 18), pady=18, sticky="nsew")
            right.grid_columnconfigure(0, weight=1)
            right.grid_rowconfigure(1, weight=1)
            ctk.CTkLabel(right, text="Guide Response", font=ctk.CTkFont(size=20, weight="bold")).grid(
                row=0, column=0, padx=18, pady=(18, 10), sticky="w"
            )
            self.guide_result = ctk.CTkTextbox(right)
            self.guide_result.grid(row=1, column=0, padx=18, pady=(0, 18), sticky="nsew")

        def _build_care_lab_tab(self, tab: Any) -> None:
            tab.grid_columnconfigure(0, weight=2)
            tab.grid_columnconfigure(1, weight=3)
            tab.grid_rowconfigure(0, weight=1)

            left = ctk.CTkFrame(tab)
            left.grid(row=0, column=0, padx=18, pady=18, sticky="nsew")
            left.grid_columnconfigure(0, weight=1)

            ctk.CTkLabel(left, text="Diagnosis + Health Check-Ins", font=ctk.CTkFont(size=20, weight="bold")).grid(
                row=0, column=0, padx=18, pady=(18, 12), sticky="w"
            )
            self.lab_picker = ctk.CTkOptionMenu(left, variable=self.lab_plant_var, values=["No plants yet"])
            self.lab_picker.grid(row=1, column=0, padx=18, pady=6, sticky="ew")
            self.lab_tags_entry = ctk.CTkEntry(left, placeholder_text="Lab tags, comma separated")
            self.lab_tags_entry.grid(row=2, column=0, padx=18, pady=6, sticky="ew")
            self.diagnosis_note_box = ctk.CTkTextbox(left, height=180)
            self.diagnosis_note_box.grid(row=3, column=0, padx=18, pady=6, sticky="ew")
            self.diagnosis_note_box.insert("1.0", "Describe the plant problem, visible symptoms, spread pattern, and what changed.")
            ctk.CTkButton(left, text="Choose Diagnosis Image", command=self.on_pick_lab_image).grid(
                row=4, column=0, padx=18, pady=(8, 6), sticky="ew"
            )
            self.lab_image_path_label = ctk.CTkLabel(left, text="No diagnosis/check-in image selected", wraplength=320, justify="left")
            self.lab_image_path_label.grid(row=5, column=0, padx=18, pady=(0, 8), sticky="w")
            ctk.CTkButton(left, text="Run Problem Diagnosis", command=self.on_diagnose_problem).grid(
                row=6, column=0, padx=18, pady=(8, 16), sticky="ew"
            )
            self.checkin_note_box = ctk.CTkTextbox(left, height=140)
            self.checkin_note_box.grid(row=7, column=0, padx=18, pady=6, sticky="ew")
            self.checkin_note_box.insert("1.0", "Short health check-in note: growth, moisture, pests, recovery, stress, flowering, etc.")
            ctk.CTkButton(left, text="Save Health Check-In", command=self.on_record_health_checkin).grid(
                row=8, column=0, padx=18, pady=(8, 18), sticky="ew"
            )

            right = ctk.CTkFrame(tab)
            right.grid(row=0, column=1, padx=(0, 18), pady=18, sticky="nsew")
            right.grid_columnconfigure(0, weight=1)
            right.grid_rowconfigure(8, weight=1)

            ctk.CTkLabel(right, text="Shared Technique Card", font=ctk.CTkFont(size=20, weight="bold")).grid(
                row=0, column=0, padx=18, pady=(18, 10), sticky="w"
            )
            self.technique_title_entry = ctk.CTkEntry(right, placeholder_text="Technique title")
            self.technique_title_entry.grid(row=1, column=0, padx=18, pady=6, sticky="ew")
            self.technique_problem_entry = ctk.CTkEntry(right, placeholder_text="Problem focus")
            self.technique_problem_entry.grid(row=2, column=0, padx=18, pady=6, sticky="ew")
            self.technique_tags_entry = ctk.CTkEntry(right, placeholder_text="Technique tags, comma separated")
            self.technique_tags_entry.grid(row=3, column=0, padx=18, pady=6, sticky="ew")
            self.technique_privacy_menu = ctk.CTkOptionMenu(right, values=["private", "shared", "public"])
            self.technique_privacy_menu.grid(row=4, column=0, padx=18, pady=6, sticky="ew")
            self.technique_summary_box = ctk.CTkTextbox(right, height=120)
            self.technique_summary_box.grid(row=5, column=0, padx=18, pady=6, sticky="ew")
            self.technique_summary_box.insert("1.0", "Describe the technique, when it helped, and any caveats.")
            self.technique_steps_box = ctk.CTkTextbox(right, height=120)
            self.technique_steps_box.grid(row=6, column=0, padx=18, pady=6, sticky="ew")
            self.technique_steps_box.insert("1.0", "One step per line")
            ctk.CTkButton(right, text="Publish Shared Technique", command=self.on_publish_technique).grid(
                row=7, column=0, padx=18, pady=(8, 10), sticky="new"
            )
            self.care_lab_result = ctk.CTkTextbox(right)
            self.care_lab_result.grid(row=8, column=0, padx=18, pady=(0, 18), sticky="nsew")

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
            self.insights_digest = ctk.CTkTextbox(left, height=220)
            self.insights_digest.grid(row=1, column=0, padx=18, pady=(0, 16), sticky="nsew")
            ctk.CTkLabel(left, text="Watchlist", font=ctk.CTkFont(size=18, weight="bold")).grid(
                row=2, column=0, padx=18, pady=(0, 10), sticky="w"
            )
            self.insights_watchlist = ctk.CTkTextbox(left)
            self.insights_watchlist.grid(row=3, column=0, padx=18, pady=(0, 18), sticky="nsew")

            right = ctk.CTkFrame(tab)
            right.grid(row=0, column=1, padx=(0, 18), pady=18, sticky="nsew")
            right.grid_columnconfigure(0, weight=1)
            right.grid_rowconfigure(1, weight=1)
            ctk.CTkLabel(right, text="Activity Timeline", font=ctk.CTkFont(size=20, weight="bold")).grid(
                row=0, column=0, padx=18, pady=(18, 10), sticky="w"
            )
            self.insights_activity = ctk.CTkTextbox(right)
            self.insights_activity.grid(row=1, column=0, padx=18, pady=(0, 18), sticky="nsew")

        def _build_community_tab(self, tab: Any) -> None:
            tab.grid_columnconfigure(0, weight=2)
            tab.grid_columnconfigure(1, weight=3)
            tab.grid_rowconfigure(0, weight=1)

            left = ctk.CTkFrame(tab)
            left.grid(row=0, column=0, padx=18, pady=18, sticky="nsew")
            left.grid_columnconfigure(0, weight=1)

            ctk.CTkLabel(left, text="Peer Gardeners", font=ctk.CTkFont(size=20, weight="bold")).grid(
                row=0, column=0, padx=18, pady=(18, 10), sticky="w"
            )
            self.peer_display_name_entry = ctk.CTkEntry(left, placeholder_text="Display name")
            self.peer_display_name_entry.grid(row=1, column=0, padx=18, pady=6, sticky="ew")
            self.peer_hive_username_entry = ctk.CTkEntry(left, placeholder_text="Hive username")
            self.peer_hive_username_entry.grid(row=2, column=0, padx=18, pady=6, sticky="ew")
            self.peer_ipfs_user_id_entry = ctk.CTkEntry(left, placeholder_text="IPFS user id or peer label")
            self.peer_ipfs_user_id_entry.grid(row=3, column=0, padx=18, pady=6, sticky="ew")
            self.peer_pin_group_entry = ctk.CTkEntry(left, placeholder_text="Preferred pin group")
            self.peer_pin_group_entry.grid(row=4, column=0, padx=18, pady=6, sticky="ew")
            self.peer_notes_box = ctk.CTkTextbox(left, height=90)
            self.peer_notes_box.grid(row=5, column=0, padx=18, pady=6, sticky="ew")
            self.peer_notes_box.insert("1.0", "Notes about what this plant user likes to pin or comment on.")
            ctk.CTkButton(left, text="Add Active Plant User", command=self.on_add_peer_user).grid(
                row=6, column=0, padx=18, pady=(8, 18), sticky="ew"
            )

            right = ctk.CTkFrame(tab)
            right.grid(row=0, column=1, padx=(0, 18), pady=18, sticky="nsew")
            right.grid_columnconfigure(0, weight=1)
            right.grid_rowconfigure(13, weight=1)

            ctk.CTkLabel(right, text="Pin Group Surface", font=ctk.CTkFont(size=20, weight="bold")).grid(
                row=0, column=0, padx=18, pady=(18, 10), sticky="w"
            )
            self.community_group_name_entry = ctk.CTkEntry(right, placeholder_text="Pin group name")
            self.community_group_name_entry.grid(row=1, column=0, padx=18, pady=6, sticky="ew")
            self.community_group_description_box = ctk.CTkTextbox(right, height=90)
            self.community_group_description_box.grid(row=2, column=0, padx=18, pady=6, sticky="ew")
            self.community_group_description_box.insert("1.0", "Describe the group purpose, plant types, or pin behavior.")
            self.community_group_privacy_menu = ctk.CTkOptionMenu(right, values=["private", "shared", "public"])
            self.community_group_privacy_menu.grid(row=3, column=0, padx=18, pady=6, sticky="ew")
            ctk.CTkButton(right, text="Create Pin Group", command=self.on_create_pin_group).grid(
                row=4, column=0, padx=18, pady=(8, 12), sticky="ew"
            )
            self.community_post_plant_picker = ctk.CTkOptionMenu(right, variable=self.community_plant_var, values=["No plants yet"])
            self.community_post_plant_picker.grid(row=5, column=0, padx=18, pady=6, sticky="ew")
            self.community_target_cids_entry = ctk.CTkEntry(right, placeholder_text="Target CIDs, comma separated")
            self.community_target_cids_entry.grid(row=6, column=0, padx=18, pady=6, sticky="ew")
            self.community_comment_box = ctk.CTkTextbox(right, height=100)
            self.community_comment_box.grid(row=7, column=0, padx=18, pady=6, sticky="ew")
            self.community_comment_box.insert("1.0", "Comment under this plant user group and point peers at useful plant content.")
            ctk.CTkButton(right, text="Post Group Comment", command=self.on_post_pin_group_comment).grid(
                row=8, column=0, padx=18, pady=(8, 12), sticky="ew"
            )
            self.community_pin_request_cid_entry = ctk.CTkEntry(right, placeholder_text="CID to hyper-pin")
            self.community_pin_request_cid_entry.grid(row=9, column=0, padx=18, pady=6, sticky="ew")
            self.community_pin_request_peers_entry = ctk.CTkEntry(right, placeholder_text="Target peer ids, comma separated")
            self.community_pin_request_peers_entry.grid(row=10, column=0, padx=18, pady=6, sticky="ew")
            self.community_pin_request_note_box = ctk.CTkTextbox(right, height=80)
            self.community_pin_request_note_box.grid(row=11, column=0, padx=18, pady=6, sticky="ew")
            self.community_pin_request_note_box.insert("1.0", "Why should peers pin this content for faster access?")
            ctk.CTkButton(right, text="Queue Peer Pin Request", command=self.on_request_peer_pin).grid(
                row=12, column=0, padx=18, pady=(8, 10), sticky="ew"
            )
            self.community_result = ctk.CTkTextbox(right)
            self.community_result.grid(row=13, column=0, padx=18, pady=(0, 18), sticky="nsew")

        def _build_network_tab(self, tab: Any) -> None:
            tab.grid_columnconfigure(0, weight=2)
            tab.grid_columnconfigure(1, weight=3)
            tab.grid_rowconfigure(0, weight=1)

            settings_frame = ctk.CTkFrame(tab)
            settings_frame.grid(row=0, column=0, padx=18, pady=18, sticky="nsew")
            settings_frame.grid_columnconfigure(0, weight=1)

            ctk.CTkLabel(settings_frame, text="Garden Settings", font=ctk.CTkFont(size=20, weight="bold")).grid(
                row=0, column=0, padx=18, pady=(18, 14), sticky="w"
            )
            self.location_entry = ctk.CTkEntry(settings_frame, placeholder_text="Garden location")
            self.location_entry.grid(row=1, column=0, padx=18, pady=6, sticky="ew")
            self.theme_entry = ctk.CTkEntry(settings_frame, placeholder_text="Theme")
            self.theme_entry.grid(row=2, column=0, padx=18, pady=6, sticky="ew")
            self.network_mode_menu = ctk.CTkOptionMenu(settings_frame, variable=self.network_mode_var, values=list(NETWORK_MODE_OPTIONS))
            self.network_mode_menu.grid(row=3, column=0, padx=18, pady=6, sticky="ew")
            self.local_first_menu = ctk.CTkOptionMenu(settings_frame, variable=self.local_first_var, values=["on", "off"])
            self.local_first_menu.grid(row=4, column=0, padx=18, pady=6, sticky="ew")
            self.cloud_mode_menu = ctk.CTkOptionMenu(settings_frame, variable=self.cloud_mode_var, values=["off", "on"])
            self.cloud_mode_menu.grid(row=5, column=0, padx=18, pady=6, sticky="ew")
            self.ipfs_enabled_menu = ctk.CTkOptionMenu(settings_frame, variable=self.ipfs_enabled_var, values=["off", "on"])
            self.ipfs_enabled_menu.grid(row=6, column=0, padx=18, pady=6, sticky="ew")
            self.ipfs_entry = ctk.CTkEntry(settings_frame, placeholder_text="IPFS API")
            self.ipfs_entry.grid(row=7, column=0, padx=18, pady=6, sticky="ew")
            self.ipfs_root_entry = ctk.CTkEntry(settings_frame, placeholder_text="IPFS MFS root")
            self.ipfs_root_entry.grid(row=8, column=0, padx=18, pady=6, sticky="ew")
            ctk.CTkLabel(settings_frame, text="Encrypted Network Vault", font=ctk.CTkFont(size=18, weight="bold")).grid(
                row=9, column=0, padx=18, pady=(16, 8), sticky="w"
            )
            self.secret_ipfs_user_id_entry = ctk.CTkEntry(settings_frame, placeholder_text="IPFS user id")
            self.secret_ipfs_user_id_entry.grid(row=10, column=0, padx=18, pady=6, sticky="ew")
            self.secret_ipfs_pin_surface_entry = ctk.CTkEntry(settings_frame, placeholder_text="Pin surface or service")
            self.secret_ipfs_pin_surface_entry.grid(row=11, column=0, padx=18, pady=6, sticky="ew")
            self.secret_ipfs_pin_surface_token_entry = ctk.CTkEntry(settings_frame, placeholder_text="Pin surface token", show="*")
            self.secret_ipfs_pin_surface_token_entry.grid(row=12, column=0, padx=18, pady=6, sticky="ew")
            self.secret_hive_username_entry = ctk.CTkEntry(settings_frame, placeholder_text="Hive username")
            self.secret_hive_username_entry.grid(row=13, column=0, padx=18, pady=6, sticky="ew")
            self.secret_hive_posting_key_entry = ctk.CTkEntry(settings_frame, placeholder_text="Hive posting key", show="*")
            self.secret_hive_posting_key_entry.grid(row=14, column=0, padx=18, pady=6, sticky="ew")
            ctk.CTkButton(settings_frame, text="Save Encrypted Credentials", command=self.on_save_network_secrets).grid(
                row=15, column=0, padx=18, pady=(8, 16), sticky="ew"
            )
            ctk.CTkLabel(settings_frame, text="Managed IPFS Daemon", font=ctk.CTkFont(size=18, weight="bold")).grid(
                row=16, column=0, padx=18, pady=(0, 8), sticky="w"
            )
            self.ipfs_daemon_enabled_menu = ctk.CTkOptionMenu(settings_frame, variable=self.ipfs_daemon_enabled_var, values=["off", "on"])
            self.ipfs_daemon_enabled_menu.grid(row=17, column=0, padx=18, pady=6, sticky="ew")
            self.ipfs_daemon_auto_install_menu = ctk.CTkOptionMenu(settings_frame, variable=self.ipfs_daemon_auto_install_var, values=["off", "on"])
            self.ipfs_daemon_auto_install_menu.grid(row=18, column=0, padx=18, pady=6, sticky="ew")
            self.ipfs_daemon_auto_start_menu = ctk.CTkOptionMenu(settings_frame, variable=self.ipfs_daemon_auto_start_var, values=["off", "on"])
            self.ipfs_daemon_auto_start_menu.grid(row=19, column=0, padx=18, pady=6, sticky="ew")
            self.ipfs_daemon_binary_entry = ctk.CTkEntry(settings_frame, placeholder_text="Existing ipfs binary path (optional)")
            self.ipfs_daemon_binary_entry.grid(row=20, column=0, padx=18, pady=6, sticky="ew")
            self.ipfs_daemon_repo_entry = ctk.CTkEntry(settings_frame, placeholder_text="Managed IPFS repo path")
            self.ipfs_daemon_repo_entry.grid(row=21, column=0, padx=18, pady=6, sticky="ew")
            self.ipfs_kubo_version_entry = ctk.CTkEntry(settings_frame, placeholder_text="Kubo version for managed install, e.g. vX.Y.Z")
            self.ipfs_kubo_version_entry.grid(row=22, column=0, padx=18, pady=6, sticky="ew")
            self.ipfs_kubo_url_entry = ctk.CTkEntry(settings_frame, placeholder_text="Custom Kubo tarball URL (optional)")
            self.ipfs_kubo_url_entry.grid(row=23, column=0, padx=18, pady=6, sticky="ew")
            daemon_buttons = ctk.CTkFrame(settings_frame, fg_color="transparent")
            daemon_buttons.grid(row=24, column=0, padx=18, pady=(6, 16), sticky="ew")
            daemon_buttons.grid_columnconfigure(0, weight=1)
            daemon_buttons.grid_columnconfigure(1, weight=1)
            daemon_buttons.grid_columnconfigure(2, weight=1)
            ctk.CTkButton(daemon_buttons, text="Install Kubo", command=self.on_install_ipfs_daemon).grid(row=0, column=0, padx=(0, 6), sticky="ew")
            ctk.CTkButton(daemon_buttons, text="Start Daemon", command=self.on_start_ipfs_daemon).grid(row=0, column=1, padx=6, sticky="ew")
            ctk.CTkButton(daemon_buttons, text="Stop Daemon", command=self.on_stop_ipfs_daemon).grid(row=0, column=2, padx=(6, 0), sticky="ew")
            ctk.CTkLabel(settings_frame, text="Hive Anchoring", font=ctk.CTkFont(size=18, weight="bold")).grid(
                row=25, column=0, padx=18, pady=(0, 8), sticky="w"
            )
            self.hive_enabled_menu = ctk.CTkOptionMenu(settings_frame, variable=self.hive_enabled_var, values=["off", "on"])
            self.hive_enabled_menu.grid(row=26, column=0, padx=18, pady=6, sticky="ew")
            self.hive_entry = ctk.CTkEntry(settings_frame, placeholder_text="Hive RPC")
            self.hive_entry.grid(row=27, column=0, padx=18, pady=6, sticky="ew")
            self.hive_broadcast_menu = ctk.CTkOptionMenu(settings_frame, variable=self.hive_broadcast_var, values=["off", "on"])
            self.hive_broadcast_menu.grid(row=28, column=0, padx=18, pady=6, sticky="ew")
            self.nodes_entry = ctk.CTkEntry(settings_frame, placeholder_text="Trusted nodes, comma separated")
            self.nodes_entry.grid(row=29, column=0, padx=18, pady=6, sticky="ew")
            ctk.CTkButton(settings_frame, text="Save Settings", command=self.on_save_settings).grid(
                row=30, column=0, padx=18, pady=(10, 18), sticky="ew"
            )

            queue_frame = ctk.CTkFrame(tab)
            queue_frame.grid(row=0, column=1, padx=(0, 18), pady=18, sticky="nsew")
            queue_frame.grid_columnconfigure(0, weight=1)
            queue_frame.grid_rowconfigure(1, weight=1)
            queue_frame.grid_rowconfigure(3, weight=1)
            queue_frame.grid_rowconfigure(5, weight=1)
            ctk.CTkLabel(queue_frame, text="Managed IPFS Status", font=ctk.CTkFont(size=20, weight="bold")).grid(
                row=0, column=0, padx=18, pady=(18, 10), sticky="w"
            )
            self.daemon_status_text = ctk.CTkTextbox(queue_frame, height=220)
            self.daemon_status_text.grid(row=1, column=0, padx=18, pady=(0, 16), sticky="nsew")
            ctk.CTkLabel(queue_frame, text="Encrypted Credential Status", font=ctk.CTkFont(size=18, weight="bold")).grid(
                row=2, column=0, padx=18, pady=(0, 10), sticky="w"
            )
            self.secret_status_text = ctk.CTkTextbox(queue_frame, height=180)
            self.secret_status_text.grid(row=3, column=0, padx=18, pady=(0, 16), sticky="nsew")
            ctk.CTkLabel(queue_frame, text="Queue + Publishing State", font=ctk.CTkFont(size=18, weight="bold")).grid(
                row=4, column=0, padx=18, pady=(0, 10), sticky="w"
            )
            self.network_queue = ctk.CTkTextbox(queue_frame)
            self.network_queue.grid(row=5, column=0, padx=18, pady=(0, 18), sticky="nsew")

        def _build_models_tab(self, tab: Any) -> None:
            tab.grid_columnconfigure(0, weight=1)
            tab.grid_rowconfigure(1, weight=1)
            top = ctk.CTkFrame(tab)
            top.grid(row=0, column=0, padx=18, pady=18, sticky="ew")

            ctk.CTkLabel(top, text="LiteRT-LM + Local Model Catalog", font=ctk.CTkFont(size=20, weight="bold")).grid(
                row=0, column=0, padx=18, pady=(18, 10), sticky="w"
            )
            buttons = ctk.CTkFrame(top, fg_color="transparent")
            buttons.grid(row=1, column=0, padx=18, pady=(0, 18), sticky="ew")
            buttons.grid_columnconfigure(0, weight=1)
            buttons.grid_columnconfigure(1, weight=1)
            ctk.CTkButton(buttons, text="Refresh Model Status", command=self.refresh_all).grid(row=0, column=0, padx=(0, 8), sticky="ew")
            ctk.CTkButton(buttons, text="Verify Model Hash", command=self.on_verify_model).grid(row=0, column=1, padx=(8, 0), sticky="ew")

            self.models_text = ctk.CTkTextbox(tab)
            self.models_text.grid(row=1, column=0, padx=18, pady=(0, 18), sticky="nsew")

        def _set_text(self, widget: Any, text: str) -> None:
            widget.delete("1.0", "end")
            widget.insert("1.0", text)

        def _selected_plant_id(self, variable: tk.StringVar) -> Optional[str]:
            label = sanitize_text(variable.get(), max_chars=200)
            return self.plant_lookup.get(label)

        def _run_worker(self, func: Callable[[], Any], on_success: Callable[[Any], None], *, status: str) -> None:
            self.status_var.set(status)

            def worker() -> None:
                try:
                    result = func()
                except Exception as exc:
                    self.after(0, lambda: self._handle_error(exc))
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
            self._set_text(
                self.sidebar_metrics,
                (
                    f"Plants: {len(summary['plants'])}\n"
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
            self._set_text(self.dashboard_summary, json.dumps(summary, indent=2, ensure_ascii=True))
            self._set_text(self.dashboard_queue, self._queue_text())
            self._set_text(self.plants_text, self._plants_text())
            self._set_text(self.network_queue, json.dumps(self.runtime.network_status(), indent=2, ensure_ascii=True))
            self._set_text(self.daemon_status_text, json.dumps(self.runtime.ipfs_daemon_status(), indent=2, ensure_ascii=True))
            self._set_text(self.secret_status_text, json.dumps(self.runtime.network_secret_status(), indent=2, ensure_ascii=True))
            self._set_text(self.community_result, json.dumps(self.runtime.community_summary(), indent=2, ensure_ascii=True))
            self._set_text(self.insights_digest, json.dumps(self.runtime.greenhouse_digest(), indent=2, ensure_ascii=True))
            self._set_text(self.insights_watchlist, json.dumps(self.runtime.watchlist_report(), indent=2, ensure_ascii=True))
            self._set_text(self.insights_activity, json.dumps(self.runtime.activity_timeline(), indent=2, ensure_ascii=True))
            self._set_text(
                self.models_text,
                json.dumps(
                    {"models": self.runtime.model_manager.model_status(), "oqs": self.runtime.oqs_advisor.status()},
                    indent=2,
                    ensure_ascii=True,
                ),
            )
            self._sync_settings_fields()
            self._sync_plant_menus()
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

        def on_chat_with_plant(self) -> None:
            plant_id = self._selected_plant_id(self.guide_plant_var)
            if not plant_id:
                messagebox.showwarning("Kayla's Garden", "Choose a plant passport first.")
                return
            question = sanitize_text(self.guide_question_box.get("1.0", "end"), max_chars=1400)
            if not question:
                messagebox.showwarning("Kayla's Garden", "Enter a plant question first.")
                return
            self._run_worker(
                lambda: self.runtime.plant_guide_chat(plant_id, question=question, image_path=self.selected_guide_image_path),
                lambda result: self._set_text(self.guide_result, json.dumps(result, indent=2, ensure_ascii=True)),
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
