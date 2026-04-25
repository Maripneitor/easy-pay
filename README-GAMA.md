# 🚀 Easy-Pay: Onboarding Automático Definitivo

¡Bienvenido al repositorio de Easy-Pay! Hemos automatizado toda la infraestructura para que no pierdas tiempo configurando puertos, IPs o entornos virtuales. 

El proyecto consta de:
* **Backend Fragmentado:** FastAPI + MongoDB Atlas (Cloud). 
  - `main.py` (Puerto 8000): Autenticación y Grupos.
  - `main_stats.py` (Puerto 8001): Servicio de Estadísticas.
* **Mobile:** React Native + Expo SDK 54 + NativeWind.
* **Web:** React + Vite (Puerto 5173).

---

## 📋 Requisitos Previos
1. Tener **Docker Desktop** instalado y **abierto** en tu computadora.
2. Tener Node.js instalado.
3. Tener la app **Expo Go** en tu celular (conectado al mismo Wi-Fi que tu PC).

---

## 🛠️ Cómo iniciar el proyecto (Flujo Mágico)

Solo necesitas la terminal de tu editor en la raíz del proyecto:

### Paso 1: Generar tu entorno
Ejecuta el siguiente comando:
```bash
npm run gama
```
El script detectará que no tienes un archivo de configuración, creará uno basado en la plantilla y **pausará la ejecución** por seguridad.

### Paso 2: Configurar Base de Datos
1. Localiza el archivo `.env` que se acaba de crear en la **raíz** del proyecto.
2. Edita la variable `MONGO_URL` con el string de conexión a **MongoDB Atlas** (solicita el password al equipo).

### Paso 3: ¡Todo listo para despegar!
Vuelve a ejecutar el mismo comando:
```bash
npm run gama
```
El script ahora actualizará tu IP local automáticamente, levantará los contenedores de Docker y lanzará el entorno de Expo. ¡Escanea el código QR y empieza a codear!

---

## 🏫 **Modo Universidad (Red Bloqueada / UNACH)**
Si estás en una red pública que bloquea la conexión entre tu celular y tu PC, usa este comando en lugar del normal:
```bash
npm run gama:unach
```
*(Esto usará LocalTunnel para sacar tu base de datos y backend a internet, y lanzará Expo en modo túnel, saltándose cualquier restricción de la red).*

🔌 **Plan B Infalible (Cable USB):**
Si el internet de la universidad es demasiado lento para el túnel, conecta tu celular por cable USB, habilita la Depuración USB y usa el script con el flag `--usb` (o ejecuta `adb reverse tcp:8000 tcp:8000`).

---

## 🔒 Seguridad y Buenas Prácticas
* **Variables de Entorno:** Nunca subas el archivo `.env` a GitHub. Ya está configurado en el `.gitignore` para tu protección.
* **IP Local:** No te preocupes por tu IP. El script `setup-gama.js` la detecta e inyecta en el sistema cada vez que inicias el proyecto.
* **Limpieza Profunda:** Si el sistema falla por caché, usa `npm run clean` para resetear el entorno.

---
*Easy-Pay Developer Experience Team*
