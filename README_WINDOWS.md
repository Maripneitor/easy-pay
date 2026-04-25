         # 🪟 Guía de Desarrollo en Windows (Simulador Android)

Esta guía explica cómo correr la aplicación **Easy-Pay** en Windows de forma nativa utilizando el simulador de Android Studio.

> [!TIP]
> **Desarrollo Rápido (Recomendado):** Si tu PC tiene poca memoria o experimentas "congelamientos" con Android Studio, te recomendamos fuertemente **Desarrollar en Dispositivo Físico**:
> 1. Instala la app "Expo Go" en tu teléfono móvil.
> 2. Ejecuta `npx expo start` y escanea el código QR. ¡Es 10x más rápido y puedes probar cámara u OCR!
> 3. También puedes presionar `w` para probar en Web de inmediato.

## 🛠️ 1. Requisitos Previos

Asegúrate de tener instalado y configurado:

- **Android Studio** con un dispositivo virtual (AVD) creado.
- **Node.js** (v18+) y **npm**.
- **Java JDK (17 es recomendable)**.
- **Variables de Entorno**:
  - `ANDROID_HOME`: Apuntando a tu SDK de Android (ej: `C:\Users\mario\AppData\Local\Android\Sdk`).
  - `PATH`: Debe incluir `%ANDROID_HOME%\platform-tools`.

---

## 🚀 2. Flujo de Trabajo (Paso a Paso)

Sigue este orden para que todo funcione correctamente y sin interrupciones:

### A. Encender el Simulador

1. Abre **Android Studio**.
2. Ve a **Device Manager**.
3. Inicia tu dispositivo virtual (clic en el botón de **Play** ▶️).
   > **Tip**: Mantén el simulador siempre visible a un lado de tu editor.

### B. Levantar el Backend (Opcional pero Recomendado)

Si necesitas que la app se conecte al servidor para login o registro:

```powershell
docker compose up -d
```

### C. Correr la Aplicación Móvil

Abre una terminal (PowerShell), navega al proyecto móvil y ejecuta:

```powershell
cd apps/mobile-app
npm start
```

_Este comando arrancará el servidor Metro. Cuando veas el código QR en la terminal, presiona la tecla **`a`** para abrir la app en el simulador de Android. Puede tardar unos minutos la primera vez al compilar la versión de desarrollo._

---

## 🔄 3. Desarrollo y Cambios Automáticos

Una vez que la aplicación esté corriendo en el simulador:

- **Hot Reload**: Cuando edites cualquier archivo en `apps/mobile-app`, al guardar (`Ctrl + S`), los cambios aparecerán **instantáneamente** en el simulador.
- **Metro Bundler**: Verás una terminal abierta que gestiona el JS. Desde ahí puedes presionar **`r`** para recargar si algo se traba.
- **Menú de Desarrollador**: Dentro del simulador, presiona `Ctrl + M` (o usa la tecla **`m`** en la terminal) para abrir el menú de Expo y ver opciones avanzadas.

---

## 🌐 4. Problemas de Conexión (IP)

> [!IMPORTANT]
> **Problemas de Conexión (IP):**
> Si la app no se conecta al backend local, revisa el archivo `.env` en la raíz y asegúrate de que `EXPO_PUBLIC_API_URL` apunte a tu **IP local**. **No uses `localhost`** en el dispositivo móvil/simulador.
>
> 1. Obtén tu IP con `ipconfig`.
> 2. Actualiza el `.env`:
>    ```env
>    EXPO_PUBLIC_API_URL=http://192.168.1.XX:8000
>    ```
>
> 3. **Uso de ADB Reverse (Recomendado):** Para evitar problemas de firewall, puedes reenviar los puertos directamente a tu dispositivo/simulador usando el script incluido:
>    ```powershell
>    powershell ./scripts/adb-reverse.ps1
>    ```

---

## 🧹 Limpieza en caso de errores

Si algo se queda "pegado" o no reconoce los cambios:

1. Cierra la terminal de Metro (Ctrl + C).
2. Ejecuta: `npm start` nuevamente y presiona `a`.

> [!TIP]
> Si los errores persisten, intenta limpiar la caché con: `npm start -- -c` dentro de `apps/mobile-app`.
