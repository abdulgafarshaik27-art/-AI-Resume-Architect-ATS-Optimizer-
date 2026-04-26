#!/bin/bash
set -e

echo "========================================"
echo " CareerForge Pro — Quick Start (Mac/Linux)"
echo "========================================"

echo ""
echo "[1/4] Installing backend dependencies..."
cd backend
npm install

echo ""
echo "[2/4] Setting up backend .env..."
if [ ! -f .env ]; then
  cp .env.example .env
  echo "✅ .env created. Edit backend/.env with your API keys!"
else
  echo "✅ .env already exists."
fi

echo ""
echo "[3/4] Installing frontend dependencies..."
cd ../frontend
npm install

echo ""
echo "[4/4] Setting up frontend .env..."
if [ ! -f .env ]; then
  cp .env.example .env
  echo "✅ .env created."
else
  echo "✅ .env already exists."
fi

cd ..
echo ""
echo "========================================"
echo " Setup complete!"
echo "========================================"
echo ""
echo " NEXT STEPS:"
echo " 1. Edit backend/.env — add your ANTHROPIC_API_KEY"
echo " 2. (Optional) Add Stripe keys for payments"
echo " 3. Terminal 1:  cd backend && npm run dev"
echo " 4. Terminal 2:  cd frontend && npm run dev"
echo " 5. Open: http://localhost:5173"
echo ""
