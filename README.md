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

## 🚦 Guía de Inicio Rápido con Docker (Mac)

Si quieres correr todo el sistema (Web, Mobile, API y DB) rápidamente en tu Mac, utiliza estos comandos:

### 1. Encender el Sistema
Para encender todos los servicios en segundo plano:
```bash
docker compose up -d
```

### 2. Ver que todo esté bien (Logs)
Para ver si la Web y el Mobile ya cargaron (espera a que veas el código QR):
```bash
docker compose logs -f frontend mobile
```
*Tip: Para ver logs del Backend (errores de login, etc.): `docker compose logs -f backend`*

### 3. Abrir la App Mobile
En Docker, Expo no es interactivo. Sigue estos pasos:
- **Simulador iOS**: Abre **Safari** dentro del simulador e ingresa: `exp://localhost:8081`
- **Android/Celular Físico**: Escanea el código QR que aparece en los logs.
- **Web App**: Entra a `http://localhost:5173`.

### 4. Apagar el Sistema
Para detener todos los contenedores y liberar memoria:
```bash
docker compose down
```

---

## 📁 Estructura del Monorepositorio

- `apps/mobile-app`: Aplicación móvil con Expo y React Native.
- `apps/web-app`: Panel administrativo con React y Vite.
- `apps/api-backend`: Servidor FastAPI (Python).
- `packages/`: Lógica compartida.

---

## 🛠️ Tecnologías Principales
- **Móvil**: Expo, React Native, NativeWind.
- **Web**: React, Vite, Tailwind CSS.
- **Backend**: FastAPI (Python).
- **Base de Datos**: MongoDB (Local en Docker o Atlas).

