#!/bin/bash

echo "Setting up environment..."

echo "Downloading Doppler CLI"
sh -c "
apt-get update && apt-get install -y curl gnupg &&
curl -Ls https://cli.doppler.com/install.sh | sh &&
echo 'Creating .env file with Doppler CLI...' &&
rm -f .env &&
doppler secrets download --no-file --format env > .env &&
echo 'Environment file created:' && ls -la .env && cat .env
"

echo "Starting backend API with Gunicorn..."
# Flask app'in main.py içindeki 'app' objesini çalıştırıyoruz
exec gunicorn --worker-class eventlet -w 1 -b 0.0.0.0:5000 main:app
# gunicorn -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:5000 main:app