@echo off
setlocal EnableExtensions
cd /d "%~dp0"
set "KKU_SMART_ACCESS_ROOT=%CD%"

for /f "usebackq delims=" %%i in ("extension\EXTENSION_ID") do set "EXT_ID=%%i"
set "EXT_PATH=%CD%\extension"

echo KKU Card Bridge - Windows install
echo Extension ID: %EXT_ID%
echo.

if not exist "venv\Scripts\python.exe" (
  echo Creating Python venv...
  where python >nul 2>&1
  if errorlevel 1 (
    echo ERROR: Python 3 not found. Install from https://www.python.org/downloads/
    pause
    exit /b 1
  )
  python -m venv venv
  if errorlevel 1 (
    echo ERROR: venv failed
    pause
    exit /b 1
  )
  venv\Scripts\python.exe -m pip install --upgrade pip -q
  venv\Scripts\pip.exe install -r backend\requirements.txt -q
  venv\Scripts\python.exe -c "import smartcard; print('pyscard OK')"
  if errorlevel 1 (
    echo ERROR: pyscard install failed
    pause
    exit /b 1
  )
)

echo Registering Native Host in Chrome registry...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0extension\install-native-host.ps1" -ExtensionId %EXT_ID%
if errorlevel 1 (
  echo ERROR: Native host install failed
  pause
  exit /b 1
)

echo.
echo Done. Next steps:
echo   1. Close ALL Chrome windows, then open Chrome again
echo   2. chrome://extensions - Developer mode - Load unpacked - select folder:
echo      %EXT_PATH%
echo   3. Extension icon - Test Native Host (must pass) - Enable Bridge
echo   4. Refresh https://lib.kku.ac.th/smart-access/admin/idcard
echo.
echo If Test Native Host fails, see %%APPDATA%%\KKU-Card-Bridge\native-host-errors.log
echo.
start "" "https://lib.kku.ac.th/smart-access/admin/idcard"
pause
