#!/usr/bin/env sh
# Use python -m so broken venv entrypoint shebangs (from another machine path) do not matter.
cd "$(dirname "$0")" || exit 1
exec ./venv/bin/python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
