#!/bin/bash

# Check if swap already exists
if swapon --show | grep -q "file"; then
    echo "Swap already exists. Skipping..."
    exit 0
fi

echo "Creating 2GB Swap File..."
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

echo "Persisting Swap in /etc/fstab..."
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

echo "Swap created successfully!"
free -h
