#!/bin/bash

DOMAIN="api.fingertrace.app"
EMAIL="fingertraaceapp@gmail.com"

echo "Installing Certbot..."
sudo apt-get update
sudo apt-get install -y certbot

echo "Stopping Nginx (if running) to free port 80..."
docker-compose down || true
sudo systemctl stop nginx || true

echo "Requesting Certificate for $DOMAIN..."
sudo certbot certonly --standalone -d $DOMAIN --email $EMAIL --agree-tos --non-interactive

echo "Certificates obtained!"
ls -l /etc/letsencrypt/live/$DOMAIN/

echo "You can now start the application with: docker-compose up -d"
