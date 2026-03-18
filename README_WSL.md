# 🛠️ Guía de Trabajo en Ubuntu (WSL2) - EASY-PAY

Esta guía te ayudará a trabajar en el proyecto de forma rápida, sin usar Docker y aprovechando la potencia de Ubuntu en tu Windows.

## 🚀 Cómo entrar y preparar la terminal

1.  **Abrir Ubuntu**: Busca "Ubuntu" en tu menú de inicio de Windows y ábrelo.
2.  **Ir al proyecto**: Tu proyecto está en la carpeta de Windows, pero puedes acceder desde Ubuntu así:
    ```bash
    cd /mnt/c/Users/mario/OneDrive/Documentos/Proyectos/EASY-PAY
    ```
    *(Tip: puedes crear un acceso directo escribiendo `ln -s /mnt/c/Users/mario/OneDrive/Documentos/Proyectos/EASY-PAY ~/easy-pay` y luego entrar solo con `cd ~/easy-pay`)*.

3.  **Instalar dependencias (la primera vez)**:
    Si no lo has hecho en Ubuntu, instala `pnpm` y las dependencias:
    ```bash
    npm install -g pnpm
    pnpm install
    ```

---

## 📱 Trabajar en la Parte Móvil (Expo)

Para trabajar de manera rápida sin Docker en la app móvil:

1.  **Entrar a la carpeta**:
    ```bash
    cd apps/mobile-app
    ```
2.  **Iniciar Expo**:
    ```bash
    npx expo start
    ```
3.  **Abrir en tu celular**: Escanea el código QR con la app **Expo Go** (disponible en Play Store/App Store). 
    *Nota: Asegúrate de que tu celular y tu PC estén en la misma red Wi-Fi.*

---

## 🌐 Trabajar en la Web (Vite)

Si necesitas trabajar en el panel web:

1.  **Entrar a la carpeta**:
    ```bash
    cd apps/web-app
    ```
2.  **Iniciar servidor de desarrollo**:
    ```bash
    npm run dev
    ```
3.  **Abrir en el navegador**: Entra a `http://localhost:5173` (o el puerto que te indique la terminal).

---

## ⚙️ Backend (API)

Si necesitas que el backend esté corriendo:

1.  **Entrar a la carpeta**:
    ```bash
    cd apps/api-backend
    ```
2.  **Iniciar**:
    ```bash
    npm run dev
    ```

---

## 💡 Consejos de Velocidad
- **No uses Docker para desarrollo**: Docker es genial para producción, pero para programar día a día, correr los comandos directamente en la terminal de Ubuntu es mucho más rápido.
- **VS Code**: Desde la terminal de Ubuntu, puedes escribir `code .` para abrir el proyecto en VS Code con la extensión de WSL activa.
