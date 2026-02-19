# 🚀 EASY-PAY (v2)

Bienvenido a **EASY-PAY**. Este proyecto ha sido diseñado para ser fácil de instalar, ejecutar y extender. A continuación encontrarás las instrucciones paso a paso para ponerlo en marcha, incluso si es tu primera vez usando Docker.

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente en tu computadora:

1.  **Git**: Para descargar el código. [Descargar Git](https://git-scm.com/downloads)
2.  **Docker Desktop**: Para ejecutar la aplicación en contenedores. ** IMPORTANTE: Debe estar instalado y ejecutándose (icono de ballena en la barra de tareas).** [Descargar Docker](https://www.docker.com/products/docker-desktop/)
3.  **Visual Studio Code** (Recomendado): Para editar el código. [Descargar VS Code](https://code.visualstudio.com/)

---

## 🛠️ Guía Rápida de Instalación y Ejecución

Sigue estos pasos para correr el proyecto. ¡Es a prueba de fallos!

### 1. Clonar el repositorio
Abre tu terminal (PowerShell, CMD o Terminal en VS Code) y ejecuta:

```bash
git clone https://github.com/Maripneitor/easy-pay.git
cd easy-pay
```

### 2. Ejecutar con Docker (La forma fácil)
Una vez dentro de la carpeta del proyecto, ejecuta el siguiente comando. Este comando "mágico" descargará, construirá y conectará todo por ti.

```bash
docker-compose up --build
```

> **⏳ Nota:** La primera vez que corras este comando puede tardar unos **5 a 10 minutos**, ya que descargará las imágenes necesarias (node, python) y configurará el entorno. ¡Paciencia!
> 
> Verás muchos textos bajando en la terminal. Cuando veas mensajes como "Ready to accept connections" o "Vite server running", ¡ya estás listo!

### 3. Detener la Aplicación
Para detener todo **correctamente**, presiona `Ctrl + C` en la terminal donde está corriendo Docker.

Si quieres borrar todo para empezar de cero (útil si algo falla), usa:

```bash
docker-compose down
```

---

## 🌐 Acceso a la Aplicación

Una vez que el sistema esté corriendo, abre tu navegador web y visita:

| Servicio | URL | Descripción |
| :--- | :--- | :--- |
| **Aplicación Web** | [http://localhost:5173](http://localhost:5173) | La interfaz principal para usuarios (Dashboard, Pagos, etc). |
| **Backend API** | [http://localhost:8000](http://localhost:8000) | El servidor que procesa los datos. |
| **Documentación API** | [http://localhost:8000/docs](http://localhost:8000/docs) | Documentación automática (Swagger) de los servicios del backend. |

---

## 🆘 Solución de Problemas Comunes (Troubleshooting)

Aquí tienes los comandos "salvavidas" para cuando las cosas no funcionan como esperas.

### 🔴 "Docker no inicia" o errores de conexión
**Solución:** Verifica que **Docker Desktop** esté abierto y con el ícono en verde o blanco en tu barra de tareas. Docker debe estar corriendo *antes* de ejecutar los comandos.

### 🔴 "Error: Port already in use" (Puerto en uso)
**Solución:** Significa que otro programa (o una instancia vieja de Easy-Pay) está usando los puertos 5173 u 8000.
1. Ejecuta `docker-compose down` para apagar cualquier contenedor viejo.
2. Cierra otras terminales que puedan estar corriendo servidores.
3. Intenta de nuevo `docker-compose up --build`.

### 🔴 Cambios en el código no se ven reflejados
**Solución:** A veces Docker se queda con una versión "cacheada" vieja. Fuerza una reconstrucción limpia con:
```bash
docker-compose down -v
docker-compose up --build
```
*(El flag `-v` borra los volúmenes temporales, forzando una instalación limpia).*

### 🔴 Errores extraños de Node/NPM ("esbuild", "platform mismatch")
**Solución:** Esto pasa si instalaste `node_modules` en tu Windows/Mac pero Docker intenta usarlos en Linux.
**Arreglo:** Borra la carpeta `node_modules` de tu carpeta `apps/web-app` local y vuelve a correr `docker-compose up --build`. Docker usará sus propios módulos internos correctamente.

---

## 📂 Estructura del Proyecto

El proyecto sigue una estructura de **Monorepositorio** para mantener todo ordenado:

```
easy-pay/
├── apps/
│   ├── api-backend/      # 🧠 Cerebro: Código del Backend (Python/FastAPI)
│   ├── web-app/          # 🎨 Cara: Código del Frontend (React/Vite/Tailwind)
│   └── mobile-app/       # 📱 Futuro: Aplicación Móvil
├── packages/             # 📦 Librerías compartidas (types, configs)
├── docker-compose.yml    # ⚙️ Configuración maestra de Docker
└── README.md             # 📖 Esta guía
```

## 🤝 Contribución y Trabajo en Equipo

1.  **Siempre** haz un `git pull` antes de empezar a trabajar para tener los últimos cambios.
2.  Si agregas nuevas librerías (npm install o pip install), avisa a tu equipo para que ellos también corran `docker-compose up --build`.
