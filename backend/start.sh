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
" &&

echo "Starting backend API..."
PYTHONPATH=/app python main.py