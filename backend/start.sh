#!/bin/bash

echo "Setting up environment..."


python -c "
try:
    from scripts.doppler_env import main as create_env
    create_env()
    print('.env file created via Doppler')
except Exception as e:
    print(f'Doppler env creation failed: {e}')
"


echo "Starting backend API..."
PYTHONPATH=/app python -m api &


wait