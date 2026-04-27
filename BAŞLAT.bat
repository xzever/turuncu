@echo off
title Turuncu Solar - Dev Server Yenile
color 0E

echo.
echo ============================================
echo   Turuncu Solar - Dev Server Temizle + Baslat
echo ============================================
echo.

cd /d "%~dp0"
echo Klasor: %CD%
echo.

echo [1/4] Calisan Node process'lerini durduruyor...
taskkill /F /IM node.exe >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo       OK - Node durduruldu
) else (
    echo       Calisan Node yoktu, devam
)
echo.

echo [2/4] .next klasorunu siliyor...
if exist ".next" (
    rmdir /S /Q .next 2>nul
    if exist ".next" (
        echo       UYARI - .next tamamen silinemedi (bazi dosyalar kilitli olabilir)
    ) else (
        echo       OK - .next silindi
    )
) else (
    echo       .next zaten yok
)
echo.

echo [3/4] node_modules kontrolu...
if not exist "node_modules" (
    echo       node_modules yok, npm install calistiriliyor...
    call npm install
) else (
    echo       OK - node_modules mevcut
)
echo.

echo [4/4] Dev server baslatiliyor...
echo.
echo ============================================
echo   Hazir oldugunda tarayicida ac:
echo   http://localhost:3000/sss
echo   Hard refresh: Ctrl+Shift+R
echo ============================================
echo.

call npm run dev

pause
