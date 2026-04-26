@echo off
echo ========================================
echo  CareerForge Pro — Quick Start (Windows)
echo ========================================

echo.
echo [1/4] Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (echo Backend install failed & pause & exit /b)

echo.
echo [2/4] Setting up backend .env...
if not exist .env (
  copy .env.example .env
  echo .env created. Please edit backend\.env with your API keys!
) else (
  echo .env already exists.
)

echo.
echo [3/4] Installing frontend dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (echo Frontend install failed & pause & exit /b)

echo.
echo [4/4] Setting up frontend .env...
if not exist .env (
  copy .env.example .env
  echo .env created.
) else (
  echo .env already exists.
)

cd ..
echo.
echo ========================================
echo  Setup complete!
echo ========================================
echo.
echo  NEXT STEPS:
echo  1. Edit backend\.env — add your ANTHROPIC_API_KEY
echo  2. (Optional) Add Stripe keys for payments
echo  3. Run backend:  cd backend ^& npm run dev
echo  4. Run frontend: cd frontend ^& npm run dev (new terminal)
echo  5. Open: http://localhost:5173
echo.
pause
