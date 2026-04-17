#!/usr/bin/env bash
set -euo pipefail

INSTALL_DIR="${1:-}"
if [[ -z "${INSTALL_DIR}" ]]; then
  echo "usage: $0 <install-dir>" >&2
  exit 2
fi

VERSION="${KUBO_VERSION:-}"
TARBALL_URL="${KUBO_TARBALL_URL:-}"

detect_os() {
  case "$(uname -s)" in
    Linux) echo "linux" ;;
    Darwin) echo "darwin" ;;
    *)
      echo "unsupported operating system: $(uname -s)" >&2
      exit 1
      ;;
  esac
}

detect_arch() {
  case "$(uname -m)" in
    x86_64|amd64) echo "amd64" ;;
    aarch64|arm64) echo "arm64" ;;
    *)
      echo "unsupported architecture: $(uname -m)" >&2
      exit 1
      ;;
  esac
}

if [[ -z "${TARBALL_URL}" ]]; then
  if [[ -z "${VERSION}" ]]; then
    echo "Set KUBO_VERSION or KUBO_TARBALL_URL before running this installer." >&2
    exit 2
  fi
  OS_NAME="$(detect_os)"
  ARCH_NAME="$(detect_arch)"
  TARBALL_URL="https://dist.ipfs.tech/kubo/${VERSION}/kubo_${VERSION}_${OS_NAME}-${ARCH_NAME}.tar.gz"
fi

TMP_DIR="$(mktemp -d)"
cleanup() {
  rm -rf "${TMP_DIR}"
}
trap cleanup EXIT

ARCHIVE_PATH="${TMP_DIR}/kubo.tar.gz"

if command -v curl >/dev/null 2>&1; then
  curl -fsSL "${TARBALL_URL}" -o "${ARCHIVE_PATH}"
elif command -v wget >/dev/null 2>&1; then
  wget -qO "${ARCHIVE_PATH}" "${TARBALL_URL}"
else
  echo "curl or wget is required to download Kubo." >&2
  exit 1
fi

tar -xzf "${ARCHIVE_PATH}" -C "${TMP_DIR}"

if [[ ! -x "${TMP_DIR}/kubo/ipfs" ]]; then
  echo "Downloaded archive did not contain kubo/ipfs." >&2
  exit 1
fi

mkdir -p "${INSTALL_DIR}"
install -m 755 "${TMP_DIR}/kubo/ipfs" "${INSTALL_DIR}/ipfs"

echo "Installed managed Kubo binary to ${INSTALL_DIR}/ipfs"
