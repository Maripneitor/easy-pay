# Red Configurada

Se ha configurado la red para permitir la comunicación entre dispositivos y servicios locales.

## Acciones Realizadas
1. **Firewall:** Se abrieron los puertos 8000 (Backend), 8081 (Metro) y 3000 (Web) en el Firewall de Windows.
2. **Detección de IP:** IP Local detectada: `192.168.1.10`.
3. **Scripts de Túnel:** Se creó `scripts/tunnel-backend.js` para acceso remoto mediante `localtunnel`.
4. **ADB Reverse:** Se creó `scripts/adb-reverse.ps1` para reenvío de puertos a dispositivos Android físicos vía USB.

## Comandos Ejecutados
- `New-NetFirewallRule` (PowerShell) para puertos 8000, 8081, 3000.

## Scripts Creados
- `scripts/tunnel-backend.js`
- `scripts/adb-reverse.ps1`

## IP Detectada
- **IPv4:** `192.168.1.10`
