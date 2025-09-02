#!/bin/bash

echo "Setting up environment..."

# Doppler CLI üzerinden .env oluştur
python -c "
try:
    from scripts.doppler_env import main as create_env
    create_env()
    print('.env file created via Doppler')
except Exception as e:
    print(f'Doppler env creation failed: {e}')
"

# .env içeriğini export et (Flask'in görebilmesi için)
set -o allexport
if [ -f /app/backend/.env ]; then
    source /app/backend/.env
fi
set +o allexport

echo "Environment variables loaded:"
echo "FIREBASE_API_KEY=${FIREBASE_API_KEY}" # debug, gizli kalmasını istersen kaldırabilirsin

echo "Starting backend API..."
PYTHONPATH=/app python main.py