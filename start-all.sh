#!/bin/bash
# --- Easy-Pay Magic Start Script (Unix) ---

clear
echo -e "\e[36m🚀 Iniciando Entorno Easy-Pay [MODO PREMIUM]\e[0m"
echo -e "\e[90m--------------------------------------------\e[0m"

# 1. Auto-Detección de IP
echo -n "📡 Detectando configuración de red..."
IP=$(ip route get 1.2.3.4 | awk '{print $7}' | head -n 1)
if [ -z "$IP" ]; then IP="127.0.0.1"; fi
echo -e " \e[32mOK ($IP)\e[0m"

# 2. Healthcheck & Cleanup
echo -n "🧹 Limpiando procesos en puertos 8000 y 8081..."
fuser -k 8000/tcp 8081/tcp > /dev/null 2>&1
echo -e " \e[32mOK\e[0m"

# 3. Auto-Config
echo -n "📝 Sincronizando variables de entorno..."
API_URL="http://$IP:8000"
sed -i "s/LOCAL_IP: '.*'/LOCAL_IP: '$IP'/g" apps/mobile-app/src/infrastructure/api/network.config.ts
sed -i "s|EXPO_PUBLIC_API_URL=.*|EXPO_PUBLIC_API_URL=$API_URL|g" .env
cp .env apps/mobile-app/.env
cp .env apps/api-backend/.env
echo -e " \e[32mOK\e[0m"

# 4. LocalTunnel
echo -e "\e[33m🌐 Activando Bypass UNACH (Localtunnel)...\e[0m"
npx localtunnel --port 8000 --subdomain easy-pay-backend-mario &

# 5. Docker
echo -e "\e[34m🐳 Levantando infraestructura Docker...\e[0m"
docker-compose up -d --build

# 6. Expo
echo -e "\e[36m🔥 Todo listo. Lanzando Metro Bundler...\e[0m"
echo -e "\e[90m--------------------------------------------\e[0m"
cd apps/mobile-app
npx expo start -c --offline
