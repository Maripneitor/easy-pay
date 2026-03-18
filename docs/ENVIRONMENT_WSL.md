# 🛠️ Entorno de Desarrollo en WSL2 (Ubuntu)

Esta guía explica cómo trabajar en el proyecto de forma nativa en Ubuntu, lo que ofrece la mejor velocidad y compatibilidad.

---

## 🚀 1. Configuración de la Terminal

Tu proyecto vive en: `/home/maripneitor/Proyectos/EASY-PAY`

### Preparación (Solo la primera vez)
1. Abre tu terminal de Ubuntu.
2. Asegúrate de tener `pnpm`:
   ```bash
   npm install -g pnpm
   ```
3. Instala las dependencias:
   ```bash
   cd ~/Proyectos/EASY-PAY
   pnpm install
   ```

---

## 📱 2. Desarrollo de la App Móvil (Flujo Profesional)

Para una experiencia óptima con el emulador de Android en Windows:

### El Centro de Mando
1. **Inicia el Emulador**: Abre Android Studio en Windows -> Device Manager -> Play (▶️).
2. **Usa dos terminales en tu editor:**

**Terminal 1 (Expo Start):**
```bash
cd ~/Proyectos/EASY-PAY/apps/mobile-app
npx expo start -c
```
*Presiona **`a`** para abrir en el emulador.*

**Terminal 2 (Comandos):**
Úsala para instalar paquetes o manejar Git sin detener el servidor.

---

## 🌐 3. Desarrollo Web y Backend

### Web (React + Vite)
```bash
cd ~/Proyectos/EASY-PAY/apps/web-app
npm run dev
```

### Backend (FastAPI / Node)
```bash
cd ~/Proyectos/EASY-PAY/apps/api-backend
npm run dev
```

---

## 💡 Consejos de Oro
- **VS Code**: Escribe `code .` desde la terminal de Ubuntu para abrir el editor con la extensión WSL.
- **Hot Reload**: Al trabajar en `/home/...`, los cambios se reflejan instantáneamente en el emulador.
- **Sincronización**: Evita usar `/mnt/c/` para desarrollo activo; el rendimiento en `/home/` es hasta 10 veces mayor.
