@echo off
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "scripts\create-live-zip.ps1"
echo.
echo Islem tamamlandi. Kapatmak icin bir tusa basin.
pause > nul
