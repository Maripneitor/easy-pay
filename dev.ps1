# dev.ps1
# Senior DevOps Automation for Easy-Pay (Windows)
# Este script prepara y lanza TODO el ecosistema de desarrollo.

Write-Host "--- Lanzando Entorno Easy-Pay ---" -ForegroundColor Cyan

# 1. Limpieza de Puertos (Evita el error 'Port in use')
$ports = @(8000, 3000, 5173, 8081)
foreach ($port in $ports) {
    $proc = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($proc) {
        Write-Host "Limpiando puerto $port..." -ForegroundColor Yellow
        $proc | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
    }
}

# 2. Deteccion de IP Local (Para que el movil pueda conectar con la API)
$localIp = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { 
    ($_.InterfaceAlias -notlike '*vEthernet*') -and (
        $_.InterfaceAlias -like '*Wi-Fi*' -or 
        $_.InterfaceAlias -like '*Ethernet*'
    )
} | Sort-Object { $_.InterfaceAlias -like '*Wi-Fi*' } -Descending | Select-Object -First 1).IPAddress

if (-not $localIp) { $localIp = "127.0.0.1" }
Write-Host "IP Detectada: $localIp" -ForegroundColor Green

# 3. Actualizacion de variables .env
function Update-EnvVar($path, $key, $value) {
    if (Test-Path $path) {
        $lines = Get-Content $path
        $found = $false
        $newLines = @()
        foreach ($line in $lines) {
            if ($line -match "^$key=") {
                $newLines += "$key=$value"
                $found = $true
            } else { $newLines += $line }
        }
        if (-not $found) { $newLines += "$key=$value" }
        $newLines | Set-Content $path -Encoding UTF8
    }
}

$apiUrl = "http://${localIp}:8001/api"
$apiBase = "http://${localIp}:8001"

Update-EnvVar "apps/web-app/.env" "VITE_API_URL" "$apiUrl"
Update-EnvVar "apps/web-app/.env" "VITE_API_BASE_URL" "$apiUrl"
Update-EnvVar "apps/web-app/.env" "VITE_USER_SERVICE_URL" "http://${localIp}:8001"
Update-EnvVar "apps/web-app/.env" "VITE_GROUP_SERVICE_URL" "http://${localIp}:8002"
Update-EnvVar "apps/web-app/.env" "VITE_STATS_SERVICE_URL" "http://${localIp}:8003"
Update-EnvVar "apps/web-app/.env" "VITE_OCR_SERVICE_URL" "http://${localIp}:8004"
Update-EnvVar "apps/web-app/.env" "VITE_NOTIFICATION_SERVICE_URL" "http://${localIp}:8005"
Update-EnvVar "apps/web-app/.env" "VITE_NOTIFICATION_API" "http://${localIp}:8005"

Update-EnvVar "apps/mobile-app/.env" "EXPO_PUBLIC_API_URL" "$apiBase"
Update-EnvVar ".env" "VITE_USER_API" "http://${localIp}:8001"
Update-EnvVar ".env" "VITE_GROUP_API" "http://${localIp}:8002"
Update-EnvVar ".env" "VITE_STAST_API" "http://${localIp}:8003"
Update-EnvVar ".env" "VITE_OCR_API" "http://${localIp}:8004"
Update-EnvVar ".env" "VITE_NOTIFICATION_API" "http://${localIp}:8005"

# 4. Lanzamiento de Servicios
Write-Host "`n1. Verificando Docker..." -ForegroundColor Gray
docker ps > $null 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Docker Desktop no esta corriendo." -ForegroundColor Red
    exit
}

Write-Host "2. Levantando Backend (Docker)..." -ForegroundColor Cyan
docker-compose up -d unified-api

Write-Host "3. Iniciando Web App (Vite)..." -ForegroundColor Cyan
# Usamos el script estandarizado del package.json
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev:web"

Write-Host "4. Iniciando Mobile App (Metro)..." -ForegroundColor Cyan
# Usamos el script con parche para Node 23/24
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev:mobile"

Write-Host "`n--- TODO LISTO ---" -ForegroundColor Green
Write-Host "Web: http://localhost:5173"
Write-Host "API: http://${localIp}:8000/api/health"
Write-Host "Metro: Escanea el QR en la nueva ventana de terminal."
