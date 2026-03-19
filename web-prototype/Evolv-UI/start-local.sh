#!/bin/bash
# Levanta el prototipo web localmente
# Uso: ./start-local.sh

echo "🚀 Iniciando Evolvion Web Prototype..."

# Matar procesos anteriores si existen
pkill -f "tsx ./src/index.ts" 2>/dev/null
pkill -f "vite --config" 2>/dev/null

cd "$(dirname "$0")"

# Instalar dependencias si no existen
if [ ! -d "node_modules" ]; then
  echo "📦 Instalando dependencias..."
  pnpm install
fi

# Iniciar API server en background
echo "🔧 Iniciando API server en puerto 3001..."
PORT=3001 pnpm --filter @workspace/api-server run dev &
API_PID=$!

sleep 2

# Iniciar frontend
echo "🌐 Iniciando frontend en puerto 5173..."
echo "👉 Abrí http://localhost:5173 en tu browser"
echo ""
echo "Para detener: Ctrl+C"
PORT=5173 BASE_PATH="/" pnpm --filter @workspace/evolvion-ui run dev

# Cleanup
kill $API_PID 2>/dev/null
