# 💸 EASY-PAY: Gestión de Gastos Compartidos

¡Bienvenido a **EASY-PAY**! Esta es una plataforma integral (Móvil, Web y API) diseñada para facilitar el registro y la liquidación de gastos entre amigos y grupos, al estilo de Splitwise pero con un enfoque moderno y rápido.

---

## 🌟 ¿Qué es EASY-PAY?
EASY-PAY permite:
- **Registrar gastos** rápidamente desde el móvil.
- **Escanear tickets** físicos usando OCR (Inteligencia Artificial).
- **Gestionar deudas** y saldos en tiempo real.
- **Liquidar deudas** con flujos de pago intuitivos.
- **Seguridad avanzada** con autenticación de dos factores (2FA).

---

## 🚀 Guía Rápida de Inicio (Nuevos Desarrolladores)

¿Acabas de unirte al equipo y tienes 0 experiencia con el setup? Sigue estos 3 pasos exactos:

### Paso 1: Instalación de dependencias
Abre una terminal en la raíz del proyecto y ejecuta el siguiente comando para preparar todos los entornos:
```bash
npm install && cd apps/mobile-app && npm install
```

### Paso 2: Configuración de la IP en el `.env`
Tu móvil o emulador necesita saber cómo llegar al servidor backend. Para esto, no puedes usar `localhost`.
1. Busca tu **Dirección IPv4** (En Windows abre CMD y pon `ipconfig`, en Mac/Linux pon `ifconfig`). Ejemplo: `192.168.1.15`.
2. Ve al archivo `apps/mobile-app/.env` y configúralo así:
   `EXPO_PUBLIC_API_URL=http://TUI.P.A.QUI:8000`

### Paso 3: Arranque Mágico
Ve a la carpeta de la app móvil y usa nuestro script diseñado a prueba de fallos de caché:
```bash
cd apps/mobile-app
npm run start:clean
```
**¿Cómo lo veo?**
- **En tu celular (Recomendado):** Descarga la app "Expo Go", abre la cámara y escanea el código QR gigante que sale en tu terminal.
- **En la computadora:** Si tienes Android Studio abierto, simplemente presiona la tecla `a` en esa misma terminal y el emulador arrancará solito.

---

## 🚦 Flujo de Trabajo Local (Eficiente)

Para trabajar con **Easy-Pay** de forma 100% local, sigue este flujo cada vez que empieces o termines una sesión de desarrollo:

### 1. Flujo de Encendido (Startup)
Sigue este orden para que todos los servicios se comuniquen correctamente:

> [!TIP]
> **Desarrollo Rápido (Recomendado):**
> *   **Dispositivo Físico:** Instala "Expo Go" en tu teléfono. Al ejecutar `npx expo start`, escanea el código QR. Elimina la necesidad de Android Studio y usa tu cámara real.
> *   **Prototipado en Web:** Presiona la tecla `w` en la terminal para abrir la app en el navegador instantáneamente de forma súper rápida para UI.

2.  **Guía de Windows (Nativa):** Si necesitas obligatoriamente el simulador de Android Studio, consulta la [Guía de Windows](./README_WINDOWS.md).

2.  **Encender la DB y Backend (Docker):**
    En la raíz del proyecto ejecuta:
    ```bash
    docker compose up -d
    ```

> [!IMPORTANT]
> **Verificar Variables (Si cambias de Red/WiFi):**
> Asegúrate de actualizar tu IP en el archivo `.env` de la raíz si el simulador no conecta (no uses `localhost` para móviles):
> ```env
> EXPO_PUBLIC_API_URL=http://192.168.X.X:8000
> ```

4.  **Encender la App Mobile (Metro):**
    En otra terminal:
    ```bash
    cd apps/mobile-app
    npm start
    ```
    **Atajos útiles en la terminal:**
    *   **`a`**: Abre la app en el emulador de **Android**.
    *   **`i`**: Abre la app en el simulador de **iOS** (MacOS).
    *   **`w`**: Abre el prototipo en la **Web**.
    *   **`r`**: Fuerza una recarga de la app si se congela.
    *   **`m`**: Abre el menú de desarrollo (también puedes usar `Ctrl + M` o `Cmd + M` en el emulador).

### 2. Flujo de Apagado (Shutdown)
Para liberar memoria y procesos de red:

1.  **Detener Metro Bundler:** `Ctrl + C` en la terminal de Expo/Metro.
2.  **Apagar Contenedores:**
    ```bash
    docker compose down
    ```

### 3. Tips de Desarrollo
*   **Logs del Backend:** `docker compose logs -f backend` (para ver errores de 2FA o Login).
*   **Reiniciar Backend:** `docker compose restart backend`.

> [!CAUTION]
> **Limpieza Profunda:** `docker compose down -v` borra definitivamente la base de datos local. Úsalo solo si detectas datos corruptos y no te importa perder el historial local.

## 🪟 Configuración Inicial en Windows (Expo)

Si estás desarrollando desde Windows, sigue estos pasos para asegurar que el entorno de Expo funcione correctamente:

### 1. Requisitos de Software
*   **Node.js LTS**: Descarga e instala la versión LTS desde [nodejs.org](https://nodejs.org/).
*   **Git for Windows**: Necesario para clonar y gestionar el repositorio.
*   **Java JDK 17**: Recomendado para compatibilidad con Android Studio.

### 2. Preparación de la Terminal
> [!WARNING]
> **Error de Scripts en PowerShell:**
> Por defecto, Windows bloquea la ejecución de scripts. Si recibes un error al ejecutar `npm` o `expo`, abre PowerShell como **Administrador** y ejecuta:
> `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

### 3. Pasos para Correr la App
1.  **Instalar dependencias**:
    ```powershell
    npm install --legacy-peer-deps
    ```
2.  **Navegar a la carpeta móvil**:
    ```powershell
    cd apps/mobile-app
    ```
3.  **Iniciar Expo**:
    ```powershell
    npx expo start
    ```

> [!IMPORTANT]
> **Conectividad y Firewall:**
> Windows Defender suele bloquear las conexiones entrantes de Expo. 
> *   Asegúrate de que tu PC y tu teléfono estén en la **misma red WiFi**.
> *   Si el código QR no carga, intenta cambiar el modo de conexión a **Tunnel** ejecutando: `npx expo start --tunnel`.

### 4. Uso de WSL2 (Opcional pero Recomendado)
Si prefieres un entorno Linux dentro de Windows, puedes usar WSL2 con Ubuntu. Asegúrate de instalar Node.js dentro de la instancia de WSL y no usar la versión de Windows para evitar conflictos de rutas.

---

## 📁 Estructura del Monorepositorio

- `apps/mobile-app`: Aplicación móvil con Expo y React Native.
- `apps/web-app`: Panel administrativo con React y Vite.
- `apps/api-backend`: Servidor FastAPI (Python).
- `packages/`: Lógica compartida.

---

## 🛠️ Tecnologías Principales
- **Móvil**: Expo, React Native, NativeWind.
- **Web**: React, Vite, Tailwind CSS.
- **Backend**: FastAPI (Python).
- **Base de Datos**: MongoDB (Local en Docker o Atlas).

