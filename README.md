# 🚀 EASY-PAY (v2) - Guía de Operación

Bienvenido a **EASY-PAY**. Este monorepositorio te permite trabajar de dos formas: usando Docker para una configuración rápida o de forma local para un desarrollo ágil en móviles.

---

## 📋 Requisitos Previos

- **Git**: Control de versiones.
- **pnpm**: Gestor de paquetes (`npm install -g pnpm`).
- **Node.js (v18+)**: Entorno de ejecución.
- **Docker Desktop**: Para servicios backend y bases de datos.
- **Expo Go**: App en tu móvil para previsualizar la app nativa.

---

## 🛠️ Instalación Inicial

Desde la raíz del proyecto, instala todas las dependencias del monorepo:

```bash
npx pnpm install
```

---

## 🏗️ OPCIÓN 1: Ejecución con Docker (Ecosistema Completo)

Ideal para probar el proyecto completo (Backend, Web y Mobile) con un solo comando.

1. **Levantar todo:**
   ```bash
   docker-compose up --build
   ```
2. **Servicios disponibles:**
   - **App Móvil (Web Mode)**: [http://localhost:8081](http://localhost:8081)
   - **Web App**: [http://localhost:5173](http://localhost:5173)
   - **Backend API**: [http://localhost:8000](http://localhost:8000)
   - **API Docs (Swagger)**: [http://localhost:8000/docs](http://localhost:8000/docs)

3. **Apagar todo:**
   ```bash
   docker-compose down
   ```

---

## 💻 OPCIÓN 2: Ejecución Local (Recomendado para Desarrollo Móvil)

Esta opción es la más rápida para editar la app móvil y ver los cambios al instante en tu teléfono físico o simulador.

### Pasos para la App Móvil (Sin Docker):

1. **Entra a la carpeta:**
   ```bash
   cd apps/mobile-app
   ```
2. **Inicia Expo con limpieza de caché:**
   ```bash
   npx expo start --clear
   ```
3. **Controles:**
   - Presiona `i` para abrir el simulador de iOS.
   - Presiona `a` para Android.
   - Escanea el código QR desde la app **Expo Go** en tu celular.

### Pasos para el Backend (Sin Docker):

Si quieres correr el API de Python localmente:

1. **Entra a la carpeta:**
   ```bash
   cd apps/api-backend
   ```
2. **Instala dependencias y corre:**
   ```bash
   pip install -r requirements.txt
   uvicorn main:app --reload --port 8000
   ```

---

## 📂 Estructura del Proyecto

```
easy-pay/
├── apps/
│   ├── api-backend/      # Backend (Python / FastAPI)
│   ├── web-app/          # Frontend Web (React / Vite)
│   └── mobile-app/       # App Móvil (React Native / Expo / SDK 54)
├── packages/             # Librerías compartidas (domain, ui)
└── docker-compose.yml    # Configuración de Docker
```

---

## 🆘 Solución de Problemas

- **Error de Worklets (Pantalla Roja)**: Asegúrate de que `package.json` en `mobile-app` use `react-native-reanimated: ~3.16.1`. Si acabas de actualizar, corre `npx expo start --clear`.
- **Navegación bloqueada**: Los botones necesitan que el `package.json` tenga `"main": "expo-router/entry"`.
- **Limpiar procesos colgados (Mac/Linux)**:
  ```bash
  lsof -ti:8081,8000,5173 | xargs kill -9
  ```
- **Reset del monorepo**:
  ```bash
  rm -rf node_modules **/node_modules pnpm-lock.yaml
  pnpm install
  ```

---

## 🤝 Contribución

Haz `git pull` antes de empezar. Si añades un paquete, hazlo desde la raíz con `pnpm add <package> --filter <app-name>`.
