#!/bin/bash
# ═══════════════════════════════════════
# Cyberpark — Deploy Script (Local + ngrok)
# รัน Backend + Frontend บน port 8000
# แล้วเปิด ngrok tunnel ให้คนภายนอกเข้าถึงได้
# ═══════════════════════════════════════

set -a
source "$(dirname "$0")/.env"
set +a

echo "🚀 Starting Cyberpark Deploy..."
echo ""

# 1. Start backend (serves both API + frontend)
echo "📡 Starting Backend + Frontend on port 8000..."
cd "$(dirname "$0")/backend"
"../.conda/bin/uvicorn" api_server:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
cd ..

# Wait for server to be ready
echo "⏳ Waiting for server to start..."
sleep 3

# 2. Start ngrok tunnel
echo "🌐 Starting ngrok tunnel..."
ngrok http 8000 &
NGROK_PID=$!

# Wait for ngrok to establish connection
sleep 3

# 3. Get the public URL
echo ""
echo "═══════════════════════════════════════"
echo "  ✅ CYBERPARK IS LIVE!"
echo "═══════════════════════════════════════"
echo ""
echo "  🏠 Local:  http://localhost:8000"
echo "  🌐 Public: Check ngrok dashboard at http://localhost:4040"
echo ""
echo "  📖 API Docs: http://localhost:8000/docs"
echo ""
echo "  Press Ctrl+C to stop all services"
echo "═══════════════════════════════════════"

# Trap Ctrl+C to clean up
trap "echo '🛑 Shutting down...'; kill $BACKEND_PID $NGROK_PID 2>/dev/null; exit 0" INT TERM

# Wait for processes
wait
