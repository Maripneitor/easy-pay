# 💸 EASY-PAY: Ecosistema de Gestión de Gastos Compartidos

¡Bienvenido a **EASY-PAY**! Esta es una plataforma integral diseñada para facilitar el registro y la liquidación de gastos entre amigos y grupos.

---

## 🛠️ 1. Requisitos Previos
Antes de empezar, asegúrate de tener instalado:
*   **Node.js (v20+)**
*   **Docker Desktop** (Para la base de datos y el backend)
*   **Git**

---

## 🚀 2. Instalación por Primera Vez (Quick Start)
Sigue estos pasos para tener el proyecto funcional en menos de 5 minutos:

1.  **Clonar el proyecto:**
    ```bash
    git clone https://github.com/tu-usuario/easy-pay.git
    cd Easy-Pay
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install --legacy-peer-deps
    ```

3.  **Configurar Variables:**
    Copia el archivo de ejemplo y cámbiale el nombre a `.env`:
    ```bash
    cp .env.example .env
    ```

---

## 💻 3. Cómo Correr el Proyecto

### Opción A: Script Automático (Recomendado para Windows)
Este script detecta tu IP, configura los archivos `.env` y abre todas las terminales por ti:
```powershell
./dev.ps1
```

### Opción B: Comandos Manuales
Si prefieres control total, abre 3 terminales y ejecuta:

1.  **Backend & DB:** `docker-compose up -d`
2.  **Web App:** `npm run dev:web`
3.  **Mobile App:** `npm run dev:mobile`

---

## 🚀 Guía de Inicio y Flujo de Trabajo para el Equipo

Para garantizar que todos trabajemos bajo el mismo entorno y evitar los clásicos conflictos de dependencias (como errores con `package-lock.json` o módulos faltantes), utilizaremos Docker Compose como nuestra fuente de la verdad.

Sigue estos pasos cada vez que clones el proyecto por primera vez o bajes cambios importantes.

### 1. Variables de Entorno (Archivos Ignorados)
Por seguridad, los archivos `.env` no se suben a Git. Antes de levantar el proyecto, asegúrate de tener tus variables de entorno locales configuradas.

Copia el archivo de ejemplo en las rutas correspondientes:
```bash
# Ejemplo para el backend y frontend
cp .env.example .env
```

**⚠️ ¡IMPORTANTE PARA DOCKER!**
Si vas a levantar el proyecto usando Docker Compose, asegúrate de agregar la siguiente línea en el archivo `.env` del frontend (`apps/web-app/.env`). Esto le dirá a Vite que enrute las peticiones a la red interna de contenedores y no a localhost (esto ya está automatizado en `docker-compose.yml`, pero es vital tenerlo en cuenta):
```env
IS_DOCKER=true
```

### 2. Flujo de Trabajo: Bajar Cambios y Limpieza Profunda
Si alguien añadió nuevas librerías, hacer un simple `git pull` puede romper tu entorno local. Usa esta secuencia para bajar cambios, limpiar la basura residual y reinstalar todo desde cero.

**Ejecuta esto en la terminal (Raíz del proyecto):**
```powershell
# 1. Traer los últimos cambios del repositorio
git pull origin main

# 2. Borrar dependencias locales y archivos de caché conflictivos (Windows Powershell)
rm -Recurse -Force node_modules, package-lock.json
npm cache clean --force

# 3. Reinstalar dependencias limpias
npm install --legacy-peer-deps
```

### 3. Levantar el Proyecto (Contenedores)
Ya con el código limpio, deja que Docker se encargue de orquestar la base de datos, el backend y el frontend. 

**Para encender el proyecto forzando una reconstrucción limpia:**
```bash
docker-compose up --build
```
*El flag `--build` es la regla de oro: le dice a Docker que vuelva a leer los `package.json` e instale cualquier dependencia nueva dentro del contenedor, asegurando que el entorno sea idéntico al de tus compañeros.*

### 🧹 Comandos de Rescate (Troubleshooting)
Si sientes que el proyecto hace cosas raras, los puertos se quedan pegados o los contenedores no reflejan tus cambios, ejecuta esta limpieza total (nuke) de Docker:

```bash
# Apagar y borrar contenedores, redes y volúmenes huérfanos
docker-compose down -v --remove-orphans

# Limpiar todo el sistema de Docker (Precaución: borra imágenes sin uso)
docker system prune -a --volumes -f
```
Después de esto, vuelve a ejecutar `docker-compose up --build` y tendrás un entorno 100% fresco.

---

## 📱 5. Configuración de Red (Mobile)
Para que el celular (Expo Go) se conecte al backend:
1. Asegúrate de estar en la **misma red Wi-Fi** que la PC.
2. Si usas `./dev.ps1`, la IP se configura sola.
3. Si lo haces manual, pon tu IP local en el `.env` de `apps/mobile-app`.

---

## 🏗️ Estructura del Monorepo
- **`apps/api-backend`**: FastAPI + MongoDB.
- **`apps/web-app`**: React + Vite (Panel Admin).
- **`apps/mobile-app`**: Expo SDK 54 (App Nativa).

---
*Última Actualización: Mayo 2026*
