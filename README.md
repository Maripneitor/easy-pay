# 🚀 EASY-PAY (v2.5) - Guía de Operación

Bienvenido a **EASY-PAY**. Este monorepositorio integra Backend (FastAPI), Web (React) y Mobile (Expo SDK 54) en un entorno orquestado por Docker.

---

## 📋 Requisitos Previos

Asegúrate de tener instalado lo siguiente:
1.  **Git**, **Node.js (v20+)** y **pnpm** (`npm install -g pnpm`).
2.  **Docker Desktop** (Esencial para Windows).
3.  **Expo Go** en tu móvil.

---

## 🏗️ INICIO RÁPIDO CON DOCKER

### 1. Preparación local
```powershell
pnpm install
```

### 2. Encender el Proyecto
```powershell
docker compose up -d --build
```

### 3. Ver Logs y QR
```powershell
docker compose logs mobile -f
```
*El sistema usa un **túnel** (`exp://...exp.direct`). Espera a que cargue el QR.*

### 4. Apagar y Limpiar (Estado Sano)
```powershell
docker compose down -v
```

---

## 🆘 Solución de Problemas (FAQ)

### ❓ Error "Worklets Mismatch" o "Timeout 6000ms"
Este error ocurre cuando las versiones de las librerías nativas de Expo Go no coinciden con el JS.
**Solución aplicada:** 
- Se forzó `react-native-worklets-core: 0.5.1` mediante un `override` en el `package.json` de la raíz.
- Se actualizaron todas las dependencias a las versiones oficiales de SDK 54.
- Si ves un timeout, simplemente reinicia con `docker compose down -v && docker compose up -d`.

### ❓ Advertencias de "No route named notifications"
Corregido en v2.5 eliminando las definiciones redundantes en `app/_layout.tsx`. Las rutas ahora se gestionan correctamente dentro de la carpeta `(tabs)`.

---

## 📂 Estructura
- **apps/api-backend**: Lógica en Python.
- **apps/web-app**: Dashboard administrativo.
- **apps/mobile-app**: Aplicación para usuarios finales (Estructura de pestañas limpia).
