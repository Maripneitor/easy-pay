# dev.ps1
# Senior DevOps Automation for Easy-Pay (Windows)

Write-Host "🚀 Iniciando Entorno Easy-Pay (Windows One-Click)..." -ForegroundColor Cyan

# 1. Limpieza de Puertos (Kill process using port)
$ports = @(8000, 3000, 5173)
foreach ($port in $ports) {
    $proc = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($proc) {
        Write-Host "🧹 Limpiando puerto $port..." -ForegroundColor Yellow
        $proc | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
    }
}

# 2. Detección de IP Local
$ip = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -like '*Wi-Fi*' -or $_.InterfaceAlias -like '*Ethernet*' -or $_.IPAddress -like '10.*' } | Select-Object -First 1).IPAddress
if (-not $ip) { $ip = "10.25.64.36" } # Fallback si no se detecta
Write-Host "🌐 IP Detectada para Desarrollo: $ip" -ForegroundColor Green

# 3. Actualización Automática de archivos .env
Write-Host "📝 Sincronizando variables de entorno..." -ForegroundColor Blue

function Update-EnvVar($path, $key, $value) {
    if (Test-Path $path) {
        $content = Get-Content $path
        if ($content -match "^$key=") {
            $content -replace "^$key=.*", "$key=$value" | Set-Content $path
        } else {
            Add-Content $path "`n$key=$value"
        }
    }
}

# Web App Config
Update-EnvVar "apps/web-app/.env" "VITE_API_URL" "http://$($ip):8000/api"
Update-EnvVar "apps/web-app/.env" "VITE_API_BASE_URL" "http://$($ip):8000/api"

# Mobile App Config
Update-EnvVar "apps/mobile-app/.env" "EXPO_PUBLIC_API_URL" "http://$($ip):8000"

# 4. Lanzamiento de Servicios en nuevas terminales
Write-Host "🚀 Lanzando Ecosistema..." -ForegroundColor Cyan

# Backend (Docker) - Background mode
Write-Host "📦 Levantando Docker (Backend & DB)..."
docker-compose up -d

# Abrir Web App en nueva pestaña
Write-Host "🌐 Iniciando Web App (Puerto 5173)..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd apps/web-app; npm run dev -- --port 5173 --host"

# Abrir Mobile App en nueva pestaña (Metro con limpieza)
Write-Host "📱 Iniciando Metro Bundler (Expo)..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd apps/mobile-app; npx expo start -c --lan"

Write-Host "✅ ¡Éxito! El entorno está corriendo." -ForegroundColor Green
Write-Host "🔗 Web: http://localhost:5173" -ForegroundColor White
Write-Host "🔗 API: http://$($ip):8000/api/health" -ForegroundColor White
