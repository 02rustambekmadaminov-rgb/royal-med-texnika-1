@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js topilmadi. Node.js 18 yoki undan yangirog'ini o'rnating.
  pause
  exit /b 1
)

set "PORT=3000"
if exist ".env" (
  for /f "tokens=1,* delims==" %%A in ('findstr /b /c:"PORT=" ".env"') do set "PORT=%%B"
)

curl.exe --silent --fail "http://127.0.0.1:%PORT%/api/status" >nul 2>nul
if not errorlevel 1 (
  echo Royal Med sayti ishlayapti: http://localhost:%PORT%/
  start "" "http://localhost:%PORT%/admin.html"
  exit /b 0
)

echo Royal Med serverini ishga tushiryapman...
start "Royal Med server" cmd /k "cd /d ""%~dp0"" && node server.mjs"
for /l %%I in (1,1,20) do (
  timeout /t 1 /nobreak >nul
  curl.exe --silent --fail "http://127.0.0.1:%PORT%/api/status" >nul 2>nul
  if not errorlevel 1 goto :ready
)

echo Server ishga tushmadi. Node.js va .env dagi PORT sozlamasini tekshiring.
pause
exit /b 1

:ready
echo Sayt tayyor: http://localhost:%PORT%/
echo Admin panel: http://localhost:%PORT%/admin.html
start "" "http://localhost:%PORT%/admin.html"
