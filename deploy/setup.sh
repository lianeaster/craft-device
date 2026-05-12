#!/usr/bin/env bash
set -euo pipefail

# ============================================================
#  Craft-Device — one-command deploy on Ubuntu + Nginx
#  Usage:  sudo bash setup.sh
# ============================================================

APP_DIR="/opt/craft-device"
REPO="https://github.com/lianeaster/craft-device.git"
APP_USER="craft"
DOMAIN="_"  # underscore = any IP; replace with your domain if you have one

echo "===> [1/7] Installing system packages..."
apt-get update -qq
apt-get install -y -qq python3 python3-venv python3-pip nodejs npm nginx git curl

# Ensure Node >= 20 for Vite 8
NODE_MAJOR=$(node -v | cut -d. -f1 | tr -d 'v')
if [ "$NODE_MAJOR" -lt 20 ]; then
    echo "===> Node.js $NODE_MAJOR is too old, installing Node 22..."
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
    apt-get install -y -qq nodejs
fi

echo "===> [2/7] Creating app user..."
id -u "$APP_USER" &>/dev/null || useradd --system --shell /bin/false --home "$APP_DIR" "$APP_USER"

echo "===> [3/7] Cloning / updating repository..."
if [ -d "$APP_DIR/.git" ]; then
    cd "$APP_DIR"
    git pull --ff-only
else
    git clone "$REPO" "$APP_DIR"
    cd "$APP_DIR"
fi

echo "===> [4/7] Setting up Python backend..."
cd "$APP_DIR/backend"
python3 -m venv venv
source venv/bin/activate
pip install --quiet --upgrade pip
pip install --quiet -r requirements.txt
deactivate

echo "===> [5/7] Building frontend..."
cd "$APP_DIR/frontend"
npm ci --silent
npm run build

echo "===> [6/7] Installing systemd service..."
cp "$APP_DIR/deploy/craft-device.service" /etc/systemd/system/craft-device.service
systemctl daemon-reload
systemctl enable craft-device
systemctl restart craft-device

echo "===> [7/7] Configuring Nginx..."
cp "$APP_DIR/deploy/nginx-craft-device.conf" /etc/nginx/sites-available/craft-device
ln -sf /etc/nginx/sites-available/craft-device /etc/nginx/sites-enabled/craft-device
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

chown -R "$APP_USER":"$APP_USER" "$APP_DIR"

echo ""
echo "============================================"
echo "  Craft-Device deployed successfully!"
echo "  Open in browser: http://$(hostname -I | awk '{print $1}')"
echo "============================================"
