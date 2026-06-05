@echo off
setlocal EnableExtensions
if defined KKU_SMART_ACCESS_ROOT (
  set "ROOT=%KKU_SMART_ACCESS_ROOT%"
) else (
  for %%I in ("%~dp0..\..") do set "ROOT=%%~fI"
)
set "KKU_SMART_ACCESS_ROOT=%ROOT%"
set "PYTHONUNBUFFERED=1"
set "HOST_PY=%~dp0card_bridge_host.py"
set "PY=%ROOT%\venv\Scripts\python.exe"
if not exist "%PY%" set "PY=%ROOT%\backend\venv\Scripts\python.exe"
if not exist "%PY%" (
  echo KKU Card Bridge: venv not found. Run Install-Windows.bat in the package folder. 1>&2
  exit /b 1
)
if not exist "%APPDATA%\KKU-Card-Bridge" mkdir "%APPDATA%\KKU-Card-Bridge" 2>nul
"%PY%" -u "%HOST_PY%" 2>>"%APPDATA%\KKU-Card-Bridge\native-host-errors.log"
exit /b %ERRORLEVEL%
