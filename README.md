# 💸 EASY-PAY: Gestión de Gastos Compartidos

¡Bienvenido a **EASY-PAY**! Esta es una plataforma integral (Móvil, Web y API) diseñada para facilitar el registro y la liquidación de gastos entre amigos y grupos, al estilo de Splitwise pero con un enfoque moderno y rápido.

---

## 🌟 Descripción del Sistema
EASY-PAY es una solución full-stack que permite:
- **Gestión de Grupos:** Creación y administración de grupos de gastos.
- **Registro de Gastos:** Control detallado de quién debe a quién.
- **Estadísticas Avanzadas:** Visualización de gastos por categoría y actividad mensual.
- **Seguridad:** Autenticación robusta con soporte para 2FA y cambio de contraseña.
- **Flexibilidad:** Acceso desde App Móvil nativa o PWA (Web).

---

## 🏗️ Arquitectura del Proyecto
El proyecto utiliza una estructura de **Monorepositorio**:

- **`apps/mobile-app`**: Aplicación móvil desarrollada con **React Native (Expo)** y **NativeWind**.
- **`apps/web-app`**: Interfaz administrativa y de usuario web construida con **React** y **Vite**.
- **`apps/api-backend`**: Servidor de API de alto rendimiento desarrollado con **FastAPI (Python)**.
- **`packages/`**: Contiene lógica de dominio, modelos y componentes de UI compartidos.
- **Base de Datos**: **MongoDB** gestionada localmente vía Docker o en la nube (Atlas).

---

## 🚦 Flujo de Trabajo del Equipo
Para mantener la consistencia y velocidad, seguimos este flujo:
1. **Sincronización:** Asegurar que el backend y frontend estén alineados (ver `reporte_cambios_gama.md`).
2. **Desarrollo:** Mobile es la prioridad de diseño; Web sigue sus patrones.
3. **Documentación:** El `README.md` es la única fuente de verdad operativa.
4. **Despliegue:** Validar cambios tanto en el emulador como en la versión PWA.

---

## ⚙️ Configuración del Entorno

### 1. Requisitos Previos
- **Node.js LTS**
- **Docker Desktop**
- **Python 3.10+** (para desarrollo local de backend sin Docker)
- **Expo Go** (instalado en dispositivo móvil)

### 2. Instalación Inicial
```bash
# Instalar dependencias del monorepo
npm install

# Instalar dependencias de la app móvil
cd apps/mobile-app
npm install
```

---

## 🌐 Configuración de Red
La comunicación entre la App Móvil y el Backend requiere una configuración de red específica:

- **IP Local Detectada:** `192.168.1.10`
- **Configuración Centralizada:** `apps/mobile-app/src/infrastructure/api/network.config.ts`
- **Puertos Abiertos:**
  - `8000`: Backend API (FastAPI)
  - `8081`: Metro Bundler (Expo)
  - `3000`: Frontend Web / PWA

### Scripts de Red Disponibles:
- **ADB Reverse (Android USB):** `powershell ./scripts/adb-reverse.ps1`
- **Túnel Externo (localtunnel):** `node ./scripts/tunnel-backend.js`

---

## 🚀 Ejecución de Servicios

### Backend (Docker)
Desde la raíz del proyecto:
```bash
docker compose up -d
```
*El backend estará disponible en `http://192.168.1.10:8000`*

### Mobile (Expo)
```bash
cd apps/mobile-app
npm run start:lan
```
*Usa `npm run start:clean` si experimentas problemas de caché.*

### Web / PWA
```bash
npm run dev:web
```

---

## 📱 Generación de PWA
Para generar la versión Web Progresiva desde el código mobile:
1. Asegurar dependencias web: `npx expo install react-native-web react-dom @expo/metro-runtime`
2. Exportar versión estática:
```bash
cd apps/mobile-app
npx expo export --platform web
```
3. La build estará disponible en `apps/mobile-app/dist`.

---

## 📜 Convenciones del Proyecto
- **Naming:** CamelCase para componentes React, snake_case para backend Python.
- **UI:** Seguir el sistema de diseño premium definido en `ThemeContext.tsx`.
- **API:** Toda interacción debe pasar por el `httpClient` configurado en mobile.
- **Git:** No realizar commits ni pushes automáticos sin instrucción explícita.

---

## 🤖 Reglas para Agentes de Código
1. **Fuente de Verdad:** Solo `README.md` y `reporte_cambios_gama.md` son válidos.
2. **No Redundancia:** No crear archivos `.md` adicionales para reportes de tareas.
3. **Consistencia:** Mantener siempre sincronizadas las funcionalidades entre Web y Mobile.
4. **Determinismo:** Los cambios deben ser directos y funcionales sin requerir validación manual constante.

---
*Última actualización: 2026-04-24*
