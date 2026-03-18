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

## 🚦 Guía de Inicio Rápido

Si acabas de descargar el proyecto, elige tu camino:

### 1. Solo quiero probarlo rápido (Docker)
Si tienes Docker instalado y quieres ver la app corriendo sin configurar nada:
👉 [**Guía de Docker**](./docs/DOCKER_USAGE.md)

### 2. Quiero programar y hacer cambios (WSL + Emulador)
Si vas a desarrollar nuevas funcionalidades, esta es la forma profesional y rápida:
👉 [**Guía de Entorno de Desarrollo**](./GUIA_ENTORNO.md)

---

## 📚 Documentación por Categoría

Para entender mejor el proyecto, consulta estas guías:

| Categoría | Documento | Descripción |
| :--- | :--- | :--- |
| **Arquitectura** | [**Mapa del Proyecto**](./docs/PROJECT_MAP.md) | Estructura de vistas y pantallas. |
| **Desarrollo** | [**Reglas de Código**](./docs/CODING_GUIDELINES.md) | Cómo evitar errores comunes y estándares. |
| **Entorno** | [**Configuración WSL**](./docs/ENVIRONMENT_WSL.md) | Detalles técnicos de la terminal en Ubuntu. |

---

## 📁 Estructura del Monorepositorio

- `apps/mobile-app`: Aplicación móvil desarrollada con Expo y React Native.
- `apps/web-app`: Panel administrativo web con React y Vite.
- `apps/api-backend`: Servidor y lógica de negocio.
- `packages/`: Componentes y tipos compartidos entre todas las apps.

---

## 🛠️ Tecnologías Principales
- **Móvil**: Expo, React Native, NativeWind (Tailwind CSS).
- **Web**: React, Vite, Tailwind CSS.
- **Backend**: FastAPI (Python) / Node.js.
- **Base de Datos**: PostgreSQL.
