# 🧹 Easy-Pay: Clean Install & Rescue Script
Write-Host "🚀 Iniciando limpieza profunda del ecosistema..." -ForegroundColor Cyan

# 1. Detener contenedores si están corriendo
Write-Host "🛑 Deteniendo contenedores de Docker..." -ForegroundColor Yellow
docker-compose down --remove-orphans

# 2. Eliminar carpetas de dependencias y temporales
$folders = @("node_modules", "dist", ".expo", "web-build", "apps/mobile-app/node_modules", "apps/web-app/node_modules", "apps/mobile-app/.expo", "apps/mobile-app/dist")

foreach ($folder in $folders) {
    if (Test-Path $folder) {
        Write-Host "🗑️ Eliminando $folder..." -ForegroundColor Gray
        Remove-Item -Path $folder -Recurse -Force -ErrorAction SilentlyContinue
    }
}

# 3. Limpiar cache de gestores de paquetes
Write-Host "🧹 Limpiando cache de npm..." -ForegroundColor Gray
npm cache clean --force

# 4. Reinstalar dependencias raíz
Write-Host "📦 Reinstalando dependencias (Root)..." -ForegroundColor Green
npm install --legacy-peer-deps

Write-Host "✨ Limpieza completada. Ahora puedes ejecutar: docker-compose up --build" -ForegroundColor Cyan
