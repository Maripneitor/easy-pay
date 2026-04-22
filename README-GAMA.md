# 🚀 Guía de Onboarding para Gama - Proyecto Easy-Pay

¡Hola Gama! Bienvenido a la nueva arquitectura de **Easy-Pay**. Esta guía está diseñada para que puedas levantar el proyecto en tu máquina local sin fricciones, resolviendo de antemano los problemas comunes de caché y configuración de red que surgen con las actualizaciones masivas de Expo SDK 54 y NativeWind.

Esta rama (`mario`) contiene la refactorización total de la UI a un estilo premium "Fluid Architect" y la migración a NativeWind. Sigue estos pasos al pie de la letra para asegurar que todo funcione correctamente.

---

## 📂 1. Estructura del Proyecto y Reglas de Oro

El proyecto es un monorepo dividido principalmente en dos grandes áreas:

*   **`apps/api-backend`**: El corazón del sistema. Desarrollado en Python con **FastAPI**. Aquí se gestionan los grupos, gastos y la lógica de negocio. La base de datos es **MongoDB**.
*   **`apps/mobile-app`**: La aplicación móvil desarrollada con **Expo (SDK 54)**, React Native y NativeWind para el estilizado.

### 💡 Reglas de Oro del Backend:
1.  **Entorno Virtual**: Siempre, antes de tocar nada en `apps/api-backend`, asegúrate de tener activado el entorno virtual (`.venv`).
2.  **Endpoints**: Los controladores principales están en `apps/api-backend/main.py` y las rutas en la carpeta `routes/`.
3.  **Persistencia**: Trabajamos con MongoDB. Si necesitas ver los datos en vivo, asegúrate de tener acceso a la instancia configurada en el `.env` del backend.

---

## 🧹 Paso 1: Pull y Purga de Dependencias (CRÍTICO)

Para evitar conflictos de versiones con el nuevo SDK de Expo, debemos "limpiar la casa" antes de instalar:

1.  **Actualiza tu código:**
    ```bash
    git checkout mario
    git pull origin mario
    ```

2.  **Limpieza Profunda (En `apps/mobile-app`):**
    Borra las carpetas de dependencias y el lockfile para evitar colisiones:
    ```bash
    cd apps/mobile-app
    # En Windows (PowerShell)
    Remove-Item -Recurse -Force node_modules, .expo
    Remove-Item package-lock.json

    # En Mac/Linux
    rm -rf node_modules .expo package-lock.json
    ```

3.  **Instalación Limpia:**
    ```bash
    npm install --legacy-peer-deps
    ```

---

## 🌐 Paso 2: Configuración de Red y Variables (.env)

El celular necesita saber dónde vive tu servidor backend. No uses `localhost`, usa tu IP privada.

1.  **Obtén tu IP Local:**
    *   **Windows:** Abre terminal y corre `ipconfig` (busca "Dirección IPv4" en tu adaptador Wi-Fi).
    *   **Mac/Linux:** Corre `ifconfig` o `ip addr`.

2.  **Configura el Mobile:**
    Ve al archivo `apps/mobile-app/.env` y actualiza la URL:
    ```env
    # Reemplaza <TU_IP> por tu dirección real (ej: 192.168.1.15)
    EXPO_PUBLIC_API_URL=http://<TU_IP>:8000
    ```

---

## ⚡ Paso 3: El Flujo de las 3 Terminales

Abre 3 terminales distintas en la raíz del proyecto para mantener los servicios corriendo:

### 🔹 Terminal 1: Infraestructura (Docker)
Si necesitas servicios de soporte (como la base de datos local):
```bash
docker compose up -d
```

### 🔹 Terminal 2: Backend (Python)
```bash
cd apps/api-backend
# Activar venv (Windows)
.\.venv\Scripts\activate
# Activar venv (Mac/Linux)
source .venv/bin/activate

# Lanzar servidor
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 🔹 Terminal 3: Mobile (Expo)
```bash
cd apps/mobile-app
# Limpia caché de Expo al iniciar
npm run start:clean
# Si tienes problemas de red persistentes, prueba:
# npx expo start -c --offline
```

---

## 🔌 Paso 4: Conexión del Teléfono por Cable USB

Si prefieres no depender del Wi-Fi para las pruebas, el cable USB es lo más estable:

1.  **Habilita el Teléfono:** Activa la **"Depuración USB"** en las "Opciones de Desarrollador" de tu Android.
2.  **Conecta y Mapea:** Una vez conectado a la PC, corre estos comandos para que el teléfono "vea" los puertos de tu computadora como si fueran suyos:
    ```bash
    adb reverse tcp:8000 tcp:8000
    adb reverse tcp:8081 tcp:8081
    ```
3.  **Lanzar en Expo Go:** Abre la app **Expo Go** en tu celular. Debería detectar automáticamente la sesión de desarrollo o puedes escanear el código QR que generó la Terminal 3.

---

¡Listo! Con esto deberías tener el entorno de **Easy-Pay** volando. Si tienes dudas con alguna ruta de NativeWind o la lógica de los nuevos grupos, avísame. 🚀
