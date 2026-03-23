# 🐳 Guía de Uso con Docker: EASY-PAY

Esta guía está diseñada para que cualquier persona pueda encender el proyecto usando Docker y navegar por la aplicación móvil en pocos minutos.

---

## 📋 1. Requisitos Previos

Antes de empezar, asegúrate de tener instalados:

1. **Docker Desktop**: Asegúrate de que el icono en tu barra de tareas esté verde ("Running").
2. **Node.js**: Instalado en tu sistema.
3. **pnpm**: `npm install -g pnpm`
4. **Expo Go**: Descargado en tu teléfono móvil.

---

## 🚀 2. Encender el Proyecto en 3 Pasos

Ejecuta estos comandos en la carpeta raíz del proyecto (`EASY-PAY/`):

### Paso A: Instalar Dependencias
```powershell
pnpm install
```

### Paso B: Iniciar Docker
```powershell
docker compose up -d --build
```

### Paso C: Mostrar el Código QR
Para ver el código QR y entrar desde tu móvil, ejecuta:
```powershell
docker compose logs mobile -f
```
*(Espera unos segundos hasta que aparezca el código QR).*

---

## 📱 3. Abrir la App en tu Teléfono

- 🍎 **iOS**: Abre la cámara normal y escanea el QR.
- 🤖 **Android**: Abre la app **Expo Go** y usa "Scan QR Code".

---

## 🛑 4. Apagar el Proyecto

Para apagar todo el sistema correctamente:
```powershell
docker compose down -v
```

---

## 🆘 Problemas Comunes (FAQ)

- **El QR no aparece**: Ejecuta `docker compose down -v` y vuelve a empezar.
- **Error "Worklets Mismatch"**: Reintenta el encendido (es un error de sincronización de caché).
- **Docker no abre**: Asegúrate de que Docker Desktop esté abierto en Windows.
