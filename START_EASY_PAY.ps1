# Easy-Pay Start Script
# Este script abre el Backend y Frontend en ventanas nuevas

# 1. Limpiar puertos para evitar conflictos
$ports = @(8000, 3000, 8081)
foreach ($port in $ports) {
    $conn = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($conn) {
        Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue
    }
}

# 2. Abrir Backend (Ventana Nueva)
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd apps/api-backend; uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

# 3. Abrir Web App (Ventana Nueva)
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd apps/web-app; npm run dev -- --host --port 3000"

# 4. Iniciar Mobile (En esta ventana)
cd apps/mobile-app
npx expo start -c --lan
