# 🚀 Guía Definitiva de Trabajo: EASY-PAY (WSL + Emulador Android)

Esta guía documenta el flujo de trabajo profesional configurado para desarrollar la app móvil utilizando la potencia de Ubuntu (WSL) desde Windows, junto con herramientas de IA.

---

## 🖥️ 1. Preparación de Pantallas (El Centro de Mando)
Para programar a máxima velocidad, acomoda tus ventanas así:
- **Izquierda:** Editor de código a pantalla completa.
- **Derecha (Arriba):** Emulador de Android (Android Studio).
- **Derecha (Abajo):** Chat de IA (Gemini) para consultar lógica y arquitectura.

---

## 📱 2. Encender el Emulador de Android
Antes de tirar código, levanta el celular virtual:
1. Abre **Android Studio** en Windows.
2. Ve a **Device Manager** (Administrador de dispositivos).
3. Presiona el botón de **Play (▶️)** en tu dispositivo virtual (ej. Pixel 7).
4. Espera a que el celular encienda y déjalo a un lado.

---

## 💻 3. La Regla de las Dos Terminales (En tu Editor)
Todo se ejecuta **dentro del editor** usando la terminal integrada, pero **siempre en Ubuntu**. 
*(Si tu terminal dice `PS` o `C:\`, escribe `wsl` y presiona Enter para cambiarla a verde: `maripneitor@LAPTOP...$`)*.

Abre siempre dos pestañas de terminal en Ubuntu:

* **Terminal 1 (El Motor - Expo):** Úsala SOLO para mantener la app viva.
    ```bash
    cd ~/Proyectos/EASY-PAY/apps/mobile-app
    npx expo start -c
    ```
    *Una vez que cargue el QR, presiona la tecla **`a`** para que la app se abra en el emulador de Android.*

* **Terminal 2 (La Herramienta - Comandos):**
    Úsala para no interrumpir el servidor. Aquí instalas paquetes, creas archivos o usas Git.
    ```bash
    cd ~/Proyectos/EASY-PAY
    npm install <paquete>
    ```

---

## 🤖 4. Flujo de Trabajo "Agéntico"
Ya que el entorno está corriendo limpio:
1. **Pide la lógica:** Solicita a la IA la estructura completa de un componente o vista usando las tecnologías del proyecto (NativeWind, Expo Router).
2. **Aplica con tu editor:** Usa la función de IA de tu editor (como Antigravity) para aplicar el código generado directamente en los archivos de WSL.
3. **Guarda y visualiza:** Al presionar `Ctrl + S`, los cambios aparecerán instantáneamente en el emulador gracias al *Hot Reload*.

---

## 🛠️ Solución a Errores Comunes (Troubleshooting)

**Error: Expo no abre el emulador (adb ENOENT)**
Esto ocurre porque Linux no reconoce el `.exe` de Windows. La solución (que ya aplicamos) es duplicar el archivo sin extensión:
```bash
cp /mnt/c/Users/mario/AppData/Local/Android/Sdk/platform-tools/adb.exe /mnt/c/Users/mario/AppData/Local/Android/Sdk/platform-tools/adb
```

**Error: Dispatcher is null (React Query)**
Ocurre si hay versiones duplicadas de React. Se soluciona borrando `node_modules`, forzando la resolución en el `package.json` raíz (`"overrides": { "react": "18.2.0" }`), y corriendo `npm install` de nuevo.
