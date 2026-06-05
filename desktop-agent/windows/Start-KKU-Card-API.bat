@echo off
REM Starts KKU Card API in the background (system tray). No console window.
cd /d "%~dp0"
wscript.exe "%~dp0Start-KKU-Card-API-launch.vbs"
