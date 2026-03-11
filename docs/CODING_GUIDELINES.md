# 🛡️ Guía Rápida de Prevención de Errores (EASY-PAY)

Al construir futuras páginas web y pantallas móviles en el monorepositorio **EASY-PAY**, asegúrate de seguir estas tres reglas fundamentales. Estos principios surgen de los errores que acabamos de parchear (incompatibilidad de NativeWind, errores TS en UI web y exports de `@easy-pay/shared`).

---

## 📱 1. Para la App Móvil (Expo)
### ⚠️ NativeWind v4.x y La Nueva Arquitectura
**Problema Previo:** En React Native Fabric (nueva arquitectura), usar NativeWind v2.x producía cierres súbitos (`expected dynamic type 'boolean', but had type 'string'`).
**Solución que aplicamos:**
* Renunciamos a NativeWind v2 y dimos el salto a **NativeWind v4.x + TailwindCSS v3.x**.
* Esto requiere `metro.config.js` y `global.css`. **Nunca hagas un downgrade a nativewind 2** o de lo contrario el simulador de Expo Go fallará con un pantallazo rojo insalvable.
* En `apps/mobile-app/app.json`, **¡NO dejes la bandera `"newArchEnabled": false`!** Actualmente está borrada porque soportamos nativamente Fabric (la cual Expo Go ejecuta de todas formas).

---

## 🌐 2. Para la App Web y Tipados TypeScript
### ❌ No asumas que todos los Hooks retornan las mismas propiedades
**Problema:** Se produjeron errores (compilación fallida) porque componentes hijos o páginas como `Dashboard.tsx` o `GroupDetail.tsx` exigían propiedades que el hook personalizado (e.g. `useGroupDetail`) no exportaba o exportaba con otro nombre o tipo (ej., usando un *fallback* a `undefined`).
**Prevención:**
* **Garantiza fallbacks válidos:** Si un componente como `GroupCard` requiere la prop `name: string`, asegúrate de enviar un valor por defecto o un string vacío desde el padre (`name: group.name || 'Sin Nombre'`).
* **No declares tipos `any` implícitos en ciclos (`.map`):** En TSX, en lugar de pasar la vista "rápida", define la interface localmente dentro de cada carpeta `.ts` (como las interfaces para los balances, los participantes, etc.)
* **Componentes React Limpios:** Al pasar íconos o componentes JSX sin dependencias por defecto, nunca uses `() => null as any`. Utiliza el tipado literal `() => null`.

---

## 📦 3. Dependencias del Monorepositorio
### 🔗 Cómo lidiar con los paquetes compartidos
**Problema:** Algunos componentes Web fallaban por hacer importación de paquetes aún no listos (`import type { OCRItem } from '@easy-pay/shared';`), lo que rompía por completo Vite y TSC al requerir interfaces "fantasma".
**Prevención a partir de ahora:**
1. **Evitar imports rotos temprano:** Si estás construyendo la interfaz de usuario antes de enlazar el backend, define las **interfaces TypeScript localmente en el hook** (`export interface OCRItem { ... }` dentro de `useOCRScanner.ts`), no intentes importarlas de `@easy-pay/*` a menos de que te asegures de que ese paquete se compila (vía TS/pnpm workspaces).
2. De esta forma, cada equipo o desarrollador de UI (frontend) no se bloquea esperando a que el paquete compartido termine de configurarse.
