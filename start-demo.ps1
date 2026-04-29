Write-Host "🚀 Iniciando Ecosistema Easy-Pay para la Demo..." -ForegroundColor Cyan

# 1. Levantar Docker
Write-Host "📦 Levantando contenedores (Backend + DB)..." -ForegroundColor Yellow
docker-compose up -d

# 2. Iniciar Expo
Write-Host "📱 Iniciando Metro Bundler (Modo LAN)..." -ForegroundColor Green
cd apps/mobile-app
npx expo start -c
