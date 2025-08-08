@echo off
title Instalando dependencias...
color 0B

echo.
echo ========================================
echo   INSTALANDO DEPENDENCIAS EXPRESS
echo ========================================
echo.

REM Ir a la carpeta del script
cd /d "%~dp0"

REM Mostrar directorio actual para debug
echo [i] Directorio actual: %CD%
echo.

REM Verificar que existe package.json
if not exist "package.json" (
    echo [i] Creando package.json...
    (
        echo {
        echo   "name": "servidor-express-portable",
        echo   "version": "1.0.0",
        echo   "description": "Servidor Express Portable",
        echo   "main": "server.js",
        echo   "dependencies": {
        echo     "express": "^4.18.0"
        echo   }
        echo }
    ) > package.json
    echo [✓] package.json creado
    echo.
)

REM Verificar archivos antes de instalar
if exist "../nodejs\node.exe" (
    echo [✓] node.exe encontrado
) else (
    echo [✗] node.exe NO encontrado
    pause
    exit /b 1
)

if exist "../nodejs/npm.cmd" (
    echo [✓] npm.cmd encontrado
) else (
    echo [✗] npm.cmd NO encontrado
    pause
    exit /b 1
)

echo.
echo [i] Instalando Express...

REM Usar ruta completa y especificar directorio de trabajo
"%~dp0../nodejs/npm.cmd" install

if errorlevel 1 (
    echo.
    echo [✗] Error al instalar dependencias
    echo [i] Intentando método alternativo...
    
    REM Método alternativo
    "%~dp0../nodejs/node.exe" "%~dp0../nodejs/npm" install

    if errorlevel 1 (
        echo [✗] Error con método alternativo también
        pause
        exit /b 1
    )
)

echo.
echo [✓] Dependencias instaladas correctamente
echo [i] Ya puedes ejecutar el servidor

echo.
pause