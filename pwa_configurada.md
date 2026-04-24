# PWA Configurada

Se ha generado la versión PWA (Web) de la aplicación móvil para permitir el acceso desde navegadores.

## Pasos Realizados
1. **Instalación de dependencias web:** `react-native-web`, `react-dom`, `@expo/metro-runtime`.
2. **Configuración de `app.json`:** Se añadieron parámetros de PWA (nombre, tema, visualización standalone).
3. **Exportación:** Se ejecutó `npx expo export --platform web`.

## Comandos Utilizados
- `npx expo install react-native-web react-dom @expo/metro-runtime`
- `npx expo export --platform web`

## Ubicación de Build
La build se encuentra en:
`apps/mobile-app/dist`
