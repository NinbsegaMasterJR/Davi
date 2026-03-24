#!/bin/bash

# =========================================================
# Pregador IA - Script de Inicialização (Linux/Mac)
# Inicia Backend + Frontend
# =========================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend"
FRONTEND_DIR="$SCRIPT_DIR/frontend"

echo ""
echo "============================================"
echo "  PREGADOR IA - Assistente de Pregações"
echo "============================================"
echo ""

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "[ERRO] Node.js não encontrado!"
    echo "Instale em: https://nodejs.org/"
    exit 1
fi

# Verificar pastas
if [ ! -d "$BACKEND_DIR" ]; then
    echo "[ERRO] Pasta backend não encontrada!"
    exit 1
fi

if [ ! -d "$FRONTEND_DIR" ]; then
    echo "[ERRO] Pasta frontend não encontrada!"
    exit 1
fi

echo "[INFO] Iniciando Pregador IA..."
echo ""

# Função para cleanup ao sair
cleanup() {
    echo ""
    echo "Encerrando Pregador IA..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Iniciar Backend
echo "[1/2] Iniciando Backend em http://localhost:3001..."
(cd "$BACKEND_DIR" && npm run dev) &
BACKEND_PID=$!
sleep 3

# Iniciar Frontend
echo "[2/2] Iniciando Frontend em http://localhost:3000..."
(cd "$FRONTEND_DIR" && npm run dev) &
FRONTEND_PID=$!
sleep 5

# Abrir navegador (Mac e Linux)
if [[ "$OSTYPE" == "darwin"* ]]; then
    open http://localhost:3000
else
    xdg-open http://localhost:3000 &
fi

echo ""
echo "============================================"
echo "  ✓ Pregador IA iniciado com sucesso!"
echo ""
echo "  Frontend:  http://localhost:3000"
echo "  Backend:   http://localhost:3001"
echo ""
echo "  Pressione Ctrl+C para parar todos os serviços"
echo "============================================"
echo ""

# Aguardar processos
wait $BACKEND_PID $FRONTEND_PID
