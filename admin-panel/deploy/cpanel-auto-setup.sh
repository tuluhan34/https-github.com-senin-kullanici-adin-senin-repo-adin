#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if ! command -v npm >/dev/null 2>&1; then
  echo "npm bulunamadi. cPanel Node.js App etkin olmali."
  exit 1
fi

PANEL_URL="${PANEL_URL:-https://panel.example.com}"
API_URL="${API_URL:-https://api.example.com/api}"
CORS_ORIGIN="${CORS_ORIGIN:-$PANEL_URL}"
JWT_SECRET="${JWT_SECRET:-}"
CSRF_SECRET="${CSRF_SECRET:-}"
RUN_SEED="${RUN_SEED:-true}"

if [ -z "$JWT_SECRET" ]; then
  JWT_SECRET="$(date +%s)-jwt-$(head -c 16 /dev/urandom | xxd -p -c 16)"
fi

if [ -z "$CSRF_SECRET" ]; then
  CSRF_SECRET="$(date +%s)-csrf-$(head -c 16 /dev/urandom | xxd -p -c 16)"
fi

echo "[1/6] Paketler yukleniyor"
npm install

echo "[2/6] Backend .env yaziliyor"
cat > backend/.env <<EOF
DATABASE_URL="file:./dev.db"
PORT=5000
NODE_ENV=production
JWT_SECRET="$JWT_SECRET"
JWT_EXPIRES_IN="1d"
CORS_ORIGIN="$CORS_ORIGIN"
CSRF_SECRET="$CSRF_SECRET"
EOF

echo "[3/6] Frontend .env yaziliyor"
cat > frontend/.env <<EOF
VITE_API_BASE_URL=$API_URL
EOF

echo "[4/6] Prisma migration"
npm run migrate --workspace backend
npm run generate --workspace backend

if [ "$RUN_SEED" = "true" ]; then
  echo "[5/6] Seed calistiriliyor"
  npm run seed --workspace backend
else
  echo "[5/6] Seed atlandi"
fi

echo "[6/6] Frontend build"
npm run build --workspace frontend

echo ""
echo "Kurulum tamamlandi."
echo "Backend env dosyasi: backend/.env"
echo "Frontend build klasoru: frontend/dist"
echo "JWT_SECRET: $JWT_SECRET"
echo "CSRF_SECRET: $CSRF_SECRET"
echo ""
echo "Sonraki adim: cPanel Node.js App > backend/src/server.js restart edin."
