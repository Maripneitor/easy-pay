# Integración Web a Mobile

Este reporte detalla la replicación de funcionalidades de la plataforma Web en la aplicación Móvil.

## Tabla de Funcionalidades

| Funcionalidad | Existe | Acción |
| :--- | :--- | :--- |
| Estadísticas con gráficos | No | Creado (Pie Chart y Bar Chart) |
| Cambio de contraseña | No | Creado |
| Borrado de grupos | No | Creado |
| Configuración 2FA | No | Creado |

## Archivos Creados
- `apps/mobile-app/src/infrastructure/api/repositories/StatsRepository.ts`
- `apps/mobile-app/src/infrastructure/api/repositories/UserRepository.ts`
- `apps/mobile-app/src/infrastructure/hooks/useProfileStats.ts`
- `apps/mobile-app/app/profile/stats.tsx`
- `apps/mobile-app/app/profile/change-password.tsx`
- `apps/mobile-app/app/profile/two-factor-setup.tsx`

## Archivos Modificados
- `apps/mobile-app/src/infrastructure/api/repositories/GroupRepository.ts`
- `apps/mobile-app/app/(tabs)/group/[id].tsx`
- `apps/mobile-app/app/settings.tsx`
- `apps/mobile-app/package.json` (Dependencias de gráficos)
