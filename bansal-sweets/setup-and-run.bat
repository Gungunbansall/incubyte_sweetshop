@echo off
echo ========================================
echo Bansal Sweets - Setup and Run Script
echo ========================================
echo.

echo Step 1: Installing Backend Dependencies...
cd bansal-sweets-backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Backend installation failed!
    pause
    exit /b 1
)
echo Backend dependencies installed successfully!
echo.

echo Step 2: Creating Admin Account...
call node scripts/createSuperAdmin.js
echo.

echo Step 3: Installing Frontend Dependencies...
cd ..\bansal-sweets-frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Frontend installation failed!
    pause
    exit /b 1
)
echo Frontend dependencies installed successfully!
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To run the application:
echo 1. Open a terminal and run: cd bansal-sweets/bansal-sweets-backend ^&^& npm run dev
echo 2. Open another terminal and run: cd bansal-sweets/bansal-sweets-frontend ^&^& npm start
echo.
echo Admin Login:
echo Email: admin@bansalsweets.com
echo Password: admin123
echo.
echo The application will be available at:
echo Backend: http://localhost:5001
echo Frontend: http://localhost:3001
echo.
pause
