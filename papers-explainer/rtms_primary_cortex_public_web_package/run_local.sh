#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
python -m http.server 8000
