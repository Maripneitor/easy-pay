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

## 🚦 Flujo de Trabajo Local (Eficiente)

Para trabajar con **Easy-Pay** de forma 100% local, sigue este flujo cada vez que empieces o termines una sesión de desarrollo:

### 1. Flujo de Encendido (Startup)
Sigue este orden para que todos los servicios se comuniquen correctamente:

1.  **Desarrollo Rápido (Recomendado):**
    *   **Dispositivo Físico:** Instala "Expo Go" en tu teléfono. Al ejecutar `npx expo start`, escanea el código QR. Elimina la necesidad de Android Studio y usa tu cámara real.
    *   **Prototipado en Web:** Presiona la tecla `w` en la terminal para abrir la app en el navegador instantáneamente de forma súper rápida para UI.
2.  **Guía de Windows (Nativa):** Si necesitas obligatoriamente el simulador de Android Studio, consulta la [Guía de Windows](./README_WINDOWS.md).

2.  **Encender la DB y Backend (Docker):**
    En la raíz del proyecto ejecuta:
    ```bash
    docker compose up -d
    ```

3.  **Verificar Variables (Si cambias de Red/WiFi):**
    Asegúrate de actualizar tu IP en el archivo `.env` de la raíz si el simulador no conecta:
    ```env
    EXPO_PUBLIC_API_URL=http://192.168.X.X:8000
    ```

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
*   **Limpieza Profunda:** `docker compose down -v` (borra la DB local si hay datos corruptos).

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

