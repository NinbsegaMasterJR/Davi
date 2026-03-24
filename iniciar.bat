@echo off
REM =========================================================
REM  Pregador IA - Script de Inicialização
REM  Inicia Backend + Frontend + Abre o navegador
REM =========================================================

setlocal enabledelayedexpansion

echo.
echo ============================================
echo   PREGADOR IA - Assistente de Pregacoes
echo ============================================
echo.

REM Verificar se Node.js está instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Node.js nao encontrado! 
    echo Instale Node.js em: https://nodejs.org/
    pause
    exit /b 1
)

set "SCRIPT_DIR=%~dp0"
set "BACKEND_DIR=%SCRIPT_DIR%backend"
set "FRONTEND_DIR=%SCRIPT_DIR%frontend"

REM Verificar se as pastas existem
if not exist "%BACKEND_DIR%" (
    echo [ERRO] Pasta backend nao encontrada!
    pause
    exit /b 1
)

if not exist "%FRONTEND_DIR%" (
    echo [ERRO] Pasta frontend nao encontrada!
    pause
    exit /b 1
)

echo [INFO] Iniciando Pregador IA...
echo.

REM Abrir terminal do Backend
echo [1/3] Iniciando Backend em http://localhost:3001...
start "Pregador IA - Backend" cmd /k "cd %BACKEND_DIR% && npm run dev"
timeout /t 3 /nobreak

REM Abrir terminal do Frontend
echo [2/3] Iniciando Frontend em http://localhost:3000...
start "Pregador IA - Frontend" cmd /k "cd %FRONTEND_DIR% && npm run dev"
timeout /t 5 /nobreak

REM Abrir navegador
echo [3/3] Abrindo navegador...
timeout /t 2 /nobreak
start "" http://localhost:3000

echo.
echo ============================================
echo   ✓ Pregador IA iniciado com sucesso!
echo.
echo   Frontend:  http://localhost:3000
echo   Backend:   http://localhost:3001
echo.
echo   Os terminais permaneceram abertos.
echo   Feche os terminais para parar os serviços.
echo ============================================
echo.
pause
