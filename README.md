# 🚀 EASY-PAY (v2)

Bienvenido a **EASY-PAY**. Este proyecto ha sido diseñado para ser fácil de instalar, ejecutar y extender. A continuación encontrarás las instrucciones paso a paso para ponerlo en marcha.

## � Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente en tu computadora:

1.  **Git**: Para descargar el código. [Descargar Git](https://git-scm.com/downloads)
2.  **Docker Desktop**: Para ejecutar la aplicación en contenedores. [Descargar Docker](https://www.docker.com/products/docker-desktop/)
3.  **Visual Studio Code** (Recomendado): Para editar el código. [Descargar VS Code](https://code.visualstudio.com/)

---

## 🛠️ Instalación y Ejecución

Sigue estos pasos para correr el proyecto. ¡Es a prueba de fallos!

### 1. Clonar el repositorio
Abre tu terminal (o consola de comandos) y ejecuta:

```bash
git clone https://github.com/Maripneitor/easy-pay.git
cd easy-pay
```

### 2. Ejecutar con Docker
Una vez dentro de la carpeta del proyecto, ejecuta el siguiente comando. Este comando se encargará de configurar todo (bases de datos, backend, frontend) automáticamente.

```bash
docker-compose up --build
```

> **⏳ Nota:** La primera vez que corras este comando puede tardar unos minutos, ya que descargará las imágenes necesarias y configurará el entorno. ¡Paciencia!

Si ves mensajes de logs corriendo en tu terminal y no hay errores rojos, ¡todo está funcionando!

---

## 🌐 Acceso a la Aplicación

Una vez que el sistema esté corriendo, abre tu navegador web y visita:

| Servicio | URL | Descripción |
| :--- | :--- | :--- |
| **Aplicación Web** | [http://localhost:5173](http://localhost:5173) | La interfaz principal para usuarios. |
| **Backend API** | [http://localhost:8000](http://localhost:8000) | El servidor que procesa los datos. |
| **Documentación API** | [http://localhost:8000/docs](http://localhost:8000/docs) | Documentación automática de los servicios. |

Para detener la aplicación, presiona `Ctrl + C` en la terminal donde corre Docker.

---

## � Estructura del Proyecto

El proyecto sigue una estructura de **Monorepositorio** para mantener todo ordenado:

```
easy-pay/
├── apps/
│   ├── api-backend/      # Código del Backend (Python/FastAPI)
│   ├── web-app/          # Código del Frontend (React/Vite)
│   └── mobile-app/       # (Futuro) Aplicación Móvil
├── packages/             # Librerías compartidas
├── docker-compose.yml    # Configuración de los servicios
└── README.md             # Esta guía
```

## 🤝 Contribución y Trabajo en Equipo

1.  **Siempre** haz un `git pull` antes de empezar a trabajar para tener los últimos cambios.
2.  Si agregas nuevas dependencias, avisa a tu equipo para que reconstruyan su contenedor con `docker-compose up --build`.

## 🆘 Solución de Problemas

- **Error: "Port already in use"**: Asegúrate de no tener otros programas usando los puertos 5173 u 8000.
- **Docker no inicia**: Verifica que Docker Desktop esté abierto y con el ícono en verde.
