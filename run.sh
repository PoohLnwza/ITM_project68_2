#!/bin/bash
# รัน API local โดยโหลด .env อัตโนมัติ
set -a
source "$(dirname "$0")/.env"
set +a

cd "$(dirname "$0")/backend"
exec "../.conda/bin/uvicorn" api_server:app --host 0.0.0.0 --port 8000 --reload

