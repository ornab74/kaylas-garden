#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
THIRD_PARTY_DIR="${ROOT_DIR}/.third_party"
BUILD_DIR="${ROOT_DIR}/.build/oqs"
VENV_DIR="${ROOT_DIR}/.venv-oqs"
INSTALL_PREFIX="${OQS_INSTALL_PREFIX:-${ROOT_DIR}/.local/oqs}"
LIBOQS_REPO="${LIBOQS_REPO:-https://github.com/open-quantum-safe/liboqs}"
LIBOQS_PYTHON_REPO="${LIBOQS_PYTHON_REPO:-https://github.com/open-quantum-safe/liboqs-python}"
PARALLEL_JOBS="${PARALLEL_JOBS:-8}"

mkdir -p "${THIRD_PARTY_DIR}" "${BUILD_DIR}" "${INSTALL_PREFIX}"

if ! command -v git >/dev/null 2>&1; then
  echo "git is required" >&2
  exit 1
fi

if ! command -v cmake >/dev/null 2>&1; then
  echo "cmake is required" >&2
  exit 1
fi

if ! command -v python3 >/dev/null 2>&1; then
  echo "python3 is required" >&2
  exit 1
fi

LIBOQS_DIR="${THIRD_PARTY_DIR}/liboqs"
LIBOQS_PYTHON_DIR="${THIRD_PARTY_DIR}/liboqs-python"

if [ ! -d "${LIBOQS_DIR}/.git" ]; then
  git clone --depth=1 "${LIBOQS_REPO}" "${LIBOQS_DIR}"
else
  git -C "${LIBOQS_DIR}" pull --ff-only
fi

if [ ! -d "${LIBOQS_PYTHON_DIR}/.git" ]; then
  git clone --depth=1 "${LIBOQS_PYTHON_REPO}" "${LIBOQS_PYTHON_DIR}"
else
  git -C "${LIBOQS_PYTHON_DIR}" pull --ff-only
fi

python3 -m venv "${VENV_DIR}"
source "${VENV_DIR}/bin/activate"
python3 -m pip install --upgrade pip setuptools wheel cmake ninja cffi pycparser nose2

cmake -S "${LIBOQS_DIR}" -B "${BUILD_DIR}/liboqs" \
  -DBUILD_SHARED_LIBS=ON \
  -DCMAKE_BUILD_TYPE=Release \
  -DCMAKE_INSTALL_PREFIX="${INSTALL_PREFIX}"

cmake --build "${BUILD_DIR}/liboqs" --parallel "${PARALLEL_JOBS}"
cmake --build "${BUILD_DIR}/liboqs" --target install

export OQS_INSTALL_PATH="${INSTALL_PREFIX}"
export LD_LIBRARY_PATH="${INSTALL_PREFIX}/lib:${LD_LIBRARY_PATH:-}"
export DYLD_LIBRARY_PATH="${INSTALL_PREFIX}/lib:${DYLD_LIBRARY_PATH:-}"
export PATH="${INSTALL_PREFIX}/bin:${PATH}"

python3 -m pip install "${LIBOQS_PYTHON_DIR}"

echo
echo "OQS build complete."
echo "Install prefix: ${INSTALL_PREFIX}"
echo "Virtualenv: ${VENV_DIR}"
echo "To reuse this environment:"
echo "  source \"${VENV_DIR}/bin/activate\""
echo "  export OQS_INSTALL_PATH=\"${INSTALL_PREFIX}\""
echo "  export LD_LIBRARY_PATH=\"${INSTALL_PREFIX}/lib:\${LD_LIBRARY_PATH:-}\""
