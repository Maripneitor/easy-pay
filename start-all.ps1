# --- Easy-Pay Magic Start Script (Windows) ---
# ROL: SENIOR DEVOPS & DX ENGINEER

Clear-Host
Write-Host "🚀 Iniciando Entorno Easy-Pay [MODO PREMIUM]" -ForegroundColor Cyan
Write-Host "--------------------------------------------" -ForegroundColor DarkGray

# 1. Auto-Detección de IP
Write-Host "📡 Detectando configuración de red..." -NoNewline
$ip = (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias 'Ethernet', 'Wi-Fi' | Where-Object { $_.IPv4Address -notlike "169.*" -and $_.IPv4Address -notlike "127.*" } | Select-Object -First 1).IPv4Address
if (-not $ip) { $ip = "127.0.0.1" }
Write-Host " OK ($ip)" -ForegroundColor Green

# 2. Healthcheck & Cleanup (Ports 8000, 8081)
Write-Host "🧹 Limpiando procesos en puertos 8000 y 8081..." -NoNewline
$ports = @(8000, 8081)
foreach ($port in $ports) {
    $proc = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($proc) {
        Stop-Process -Id $proc.OwningProcess -Force -ErrorAction SilentlyContinue
    }
}
Write-Host " OK" -ForegroundColor Green

# 3. Auto-Config de Archivos
Write-Host "📝 Sincronizando variables de entorno..." -NoNewline
$apiUrl = "http://$($ip):8000"

# Actualizar network.config.ts
$netConfigPath = "apps/mobile-app/src/infrastructure/api/network.config.ts"
if (Test-Path $netConfigPath) {
    (Get-Content $netConfigPath) -replace "LOCAL_IP: '.*'", "LOCAL_IP: '$ip'" | Set-Content $netConfigPath
}

# Actualizar .env raíz y subcarpetas
$envContent = Get-Content ".env" -ErrorAction SilentlyContinue
if ($envContent) {
    $envContent -replace "EXPO_PUBLIC_API_URL=.*", "EXPO_PUBLIC_API_URL=$apiUrl" | Set-Content ".env"
    Copy-Item ".env" "apps/mobile-app/.env" -Force
    Copy-Item ".env" "apps/api-backend/.env" -Force
}
Write-Host " OK" -ForegroundColor Green

# 4. Iniciar Túnel (Localtunnel) en Segundo Plano
Write-Host "🌐 Activando Bypass UNACH (Localtunnel)..." -ForegroundColor Yellow
$subdomain = "easy-pay-backend-mario"
Start-Process -FilePath "npx" -ArgumentList "localtunnel --port 8000 --subdomain $subdomain" -NoNewWindow

# 5. Levantar Backend (Docker)
Write-Host "🐳 Levantando infraestructura Docker..." -ForegroundColor Blue
docker-compose up -d --build

# 6. Iniciar Metro Bundler
Write-Host "🔥 Todo listo. Lanzando Metro Bundler..." -ForegroundColor Cyan
Write-Host "--------------------------------------------" -ForegroundColor DarkGray
cd apps/mobile-app
npx expo start -c --offline
