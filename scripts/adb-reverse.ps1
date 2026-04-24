
# Configuración de reenvío de puertos para desarrollo Android
adb reverse tcp:8000 tcp:8000
adb reverse tcp:8081 tcp:8081
adb reverse tcp:3000 tcp:3000
Write-Host "✅ ADB Reverse configurado para puertos 8000, 8081 y 3000" -ForegroundColor Green
