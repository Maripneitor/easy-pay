# Conexión Backend Configurada

Se ha configurado la conexión entre la aplicación móvil y el backend utilizando la IP local detectada.

## Archivos Modificados/Creados
- `apps/mobile-app/src/infrastructure/api/network.config.ts` (Creado)
- `apps/mobile-app/src/infrastructure/api/http-client.ts` (Modificado)

## IP Configurada
- **IP Local:** `192.168.1.10`
- **URL Base:** `http://192.168.1.10:8000`

## Instrucciones para Cambio Manual
Si la IP de tu máquina cambia, actualiza el valor de `BASE_IP` en:
`apps/mobile-app/src/infrastructure/api/network.config.ts`
