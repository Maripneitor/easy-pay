# Errores y Tareas Pendientes (TODO) - Sprint 2

A continuación se listan los errores de TypeScript y dependencias restantes tras la primera fase de migración a Expo 55. Estos errores corresponden a flujos periféricos, integraciones de terceros y errores de UI que no bloquean el flujo principal de Grupos.

## 1. Discrepancias de Tipado en Grupos y Componentes

- [ ] **app/profile/edit.tsx**
  - Línea 58: Incompatibilidad en los tipos de la propiedad `id` al tratar de asignar un objeto a `User`.
- [ ] **app/profile/two-factor-setup.tsx**
  - Línea 22: `Property 'toggleTwoFactor' does not exist on type 'UserRepository'.`
  - Línea 47: Error de argumentos en llamada a función.
- [ ] **app/(tabs)/notifications.tsx**
  - Línea 201: Comparación no intencional con `"alert"` en `NotificationType`.

## 3. UI y Componentes Gráficos

- [ ] **app/payment-success.tsx**
  - Línea 28: El ícono `"checkmark-seal"` no es válido. (Posiblemente sea `"checkmark-sharp"` u otro ícono válido).
- [ ] **app/profile/stats.tsx**
  - Línea 110: Propiedad faltante `yAxisSuffix` en componente de gráficas (`BarChart`).
- [ ] **components/group/AddExpenseModal.tsx**
  - Errores de nombre no encontrado (`alert`) en líneas 75, 79.
  - Línea 103: Atributos JSX múltiples con el mismo nombre.
- [ ] **components/group/PaymentMethodModal.tsx**
  - Línea 42: Atributos JSX múltiples con el mismo nombre.
- [ ] **components/group/SettlementWizard.tsx**
  - Líneas 67 y 158: Atributos JSX múltiples con el mismo nombre.

## 4. Hooks y Otros

- [ ] **app/wallet/history/[id].tsx**
  - Línea 29: `'error' is of type 'unknown'.` (Necesita validación o aserción de tipo).
- [ ] **src/infrastructure/hooks/useGroup.ts**
  - Líneas 47, 55: Discrepancia en el número de argumentos en la llamada a funciones o mutaciones.