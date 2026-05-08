# Arquitectura Hexagonal y Migración a Expo 55 - Decisiones Técnicas

Este documento detalla las decisiones técnicas y compromisos tomados durante la migración de `apps/mobile-app` a Expo 55, enfocado en resolver conflictos de tipado dentro del monorepo y estabilizar el flujo principal.

## 1. Tipos de Dominio: Uso de Tipos Locales vs `@easy-pay/domain`

**Problema:**
Durante la migración a Expo 55 y el uso de React Native con Metro, encontramos problemas al resolver los tipos directamente de `packages/domain` debido a las configuraciones de module resolution y path aliases (`tsconfig.json` y `metro.config.js`), resultando en numerosos errores "Cannot find module" o disparidad de tipos (e.g., `participantes_ids` vs `assignedTo`).

**Decisión:**
Se decidió utilizar temporalmente **tipos locales** en `apps/mobile-app/src/domain/types/index.ts` como la fuente de verdad (canonical types) para el cliente móvil.

**Justificación:**
1. **Desbloqueo inmediato:** Permite estabilizar y compilar el flujo de "Grupos" en la aplicación móvil sin lidiar con los problemas de linkeo del monorepo causados por Metro bundler en Expo 55.
2. **Control local:** Garantiza consistencia interna en la aplicación móvil mientras se refactorizan los adaptadores y UI.

**Plan a futuro:**
- Resolver el build de `packages/domain`.
- Configurar adecuadamente `metro.config.js` y `tsconfig.json` (usando referencias de proyecto si es necesario) para resolver `@easy-pay/domain` limpiamente.
- Eliminar `apps/mobile-app/src/domain/types/index.ts` y migrar a los tipos compartidos, construyendo mapeadores explícitos (adapters) donde los modelos del backend difieran de los tipos de interfaz.

## 2. Errores Periféricos y Librerías de Terceros

**Problema:**
Aún persisten algunos errores de compilación de TypeScript relacionados con componentes UI y flujos no críticos (ej. `Moti`, `MercadoPagoService`, configuración de cuentas bancarias y gráficos en la sección de perfil).

**Decisión:**
Dejar estos errores para un **Segundo Sprint**, priorizando el commit y despliegue del flujo base ("Grupos", "Saldos").

**Justificación:**
- Estos errores **no bloquean** el flujo principal de creación de grupos, asignación de items y cierre del grupo.
- Mantener la migración por fases reduce el riesgo y acota el tamaño de los PRs.

**Plan a futuro:**
- Documentar los errores restantes en un archivo `TODO.md`.
- En el próximo sprint, atacar problemas específicos de librerías como la actualización a las versiones más recientes de Moti, corrección de los tipos para los props del Chart, y la integración robusta del flujo de pago con MercadoPago.
