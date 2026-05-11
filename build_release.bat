@echo off
echo ========================================
echo   Craft-Device Release Builder
echo ========================================
echo.

echo [1/4] Building frontend...
cd frontend
call npm install
call npm run build
if errorlevel 1 (
    echo ERROR: Frontend build failed!
    pause
    exit /b 1
)
cd ..

echo.
echo [2/4] Installing Python dependencies...
cd backend
pip install -r requirements.txt
pip install pyinstaller
if errorlevel 1 (
    echo ERROR: Python dependencies failed!
    pause
    exit /b 1
)
cd ..

echo.
echo [3/4] Building executable with PyInstaller...
pyinstaller craft-device.spec --noconfirm
if errorlevel 1 (
    echo ERROR: PyInstaller build failed!
    pause
    exit /b 1
)

echo.
echo [4/4] Copying to release folder...
if not exist release mkdir release
copy /Y dist\craft-device.exe release\craft-device.exe

echo.
echo ========================================
echo   BUILD COMPLETE!
echo   File: release\craft-device.exe
echo ========================================
pause
