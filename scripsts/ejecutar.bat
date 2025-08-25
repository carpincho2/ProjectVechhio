@echo off
title Servidor Express Portable
color 0A

echo.
echo ================================
echo   SERVIDOR EXPRESS PORTABLE
echo ================================
echo.

REM Ir a la carpeta del script
cd /d "%~dp0"

REM Verificar que están las dependencias del backend
if not exist "../backend/node_modules" (
    echo [!] Dependencias del backend no encontradas
    echo [i] Ejecuta primero 'instalar.bat'
    pause
    exit /b 1
)

REM Verificar que existe node.exe
if not exist "../nodejs/node.exe" (
    echo [!] node.exe no encontrado en nodejs\
    pause
    exit /b 1
)

echo [i] Iniciando servidor...
echo [i] Abriendo navegador en http://localhost:3000
echo [i] Presiona Ctrl+C para detener
echo.

REM Abrir navegador después de 3 segundos
start "" /min cmd /c "timeout /t 3 >nul && start http://localhost:3000"

REM Cambiar al directorio del backend y ejecutar el servidor
cd /d "%~dp0..\backend"
"..\nodejs\node.exe" server.js

echo.
echo [i] Servidor detenido
pause