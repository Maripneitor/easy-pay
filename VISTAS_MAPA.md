# 🗺️ Mapa de Arquitectura de Navegación - Easy-Pay

Este documento detalla la estructura jerárquica de navegación de la plataforma Easy-Pay, incluyendo flujos web y móviles, acciones de usuario y transiciones de vista.

---

## 🌳 Árbol de Navegación Web (`apps/web-app`)

La navegación web se centra en un flujo de gestión de grupos y gastos, con un panel de control (Dashboard) como núcleo tras la autenticación.

- 🏠 **Landing Page** (`/`)
  - 🔘 Botón "Empezar ahora" / "Iniciar Sesión" ➔ Redirige a **Auth** (`/auth`)
  - 🔘 Botón "Crear Grupo" (Hero) ➔ Redirige a **Auth** (`/auth`) (si no hay sesión) o **Crear Grupo** (`/create-group`)
  - 🔘 Botón "Escanear QR" (Hero) ➔ Redirige a **Escanear QR** (`/qr-scanner`)
  - 🔘 Enlaces de Navegación (Anchor links) ➔ Scroll a secciones (`#pain-points`, `#how-it-works`, etc.)
- 🔑 **Autenticación** (`/auth`)
  - 📑 Pestaña "Iniciar Sesión" ➔ Muestra Formulario de Login
    - 🔘 Botón "Entrar" ➔ Redirige a **Dashboard** (`/dashboard`)
  - 📑 Pestaña "Registrarse" ➔ Muestra Formulario de Registro
    - 🔘 Botón "Crear Cuenta" ➔ Redirige a **Dashboard** (`/dashboard`)
  - 🔘 Botón "Continuar como Invitado" ➔ Redirige a **Landing Page** (`/`)
  - 🔘 Enlace "¿Olvidaste tu contraseña?" ➔ Redirige a **Recuperar Contraseña** (`/recover-password`)
- 📊 **Dashboard** (`/dashboard`) [Protegido]
  - 🔘 Botón "Crear Grupo" ➔ Redirige a **Crear Grupo** (`/create-group`)
  - 🗂️ Tarjeta de Grupo ➔ Redirige a **Detalle de Grupo** (`/group/:id`)
  - 🔔 Icono "Notificaciones" ➔ Redirige a **Notificaciones** (`/notifications`)
  - 📂 **Barra Lateral (Sidebar)**:
    - 🔘 Botón "Inicio" ➔ Redirige a **Dashboard** (`/dashboard`)
    - 🔘 Botón "Crear Grupo" ➔ Redirige a **Crear Grupo** (`/create-group`)
    - 🔘 Botón "Mis Pagos" ➔ Redirige a **Mis Pagos** (`/my-payments`)
    - 🔘 Botón "Notificaciones" ➔ Redirige a **Notificaciones** (`/notifications`)
    - 🔘 Tarjeta de Perfil / "Configuración" ➔ Redirige a **Perfil** (`/profile`)
    - 🔘 Botón "Cerrar Sesión" ➔ Cierra sesión y redirige a **Auth** (`/auth`)
- 👥 **Crear Grupo** (`/create-group`) [Protegido]
  - 📑 Pestaña "CREAR"
    - 🔘 Botón "Confirmar y Crear" ➔ Redirige a **Detalle de Grupo** (`/group/:id`)
  - 📑 Pestaña "UNIRSE"
    - 🔘 Botón "Unirse ahora" ➔ Redirige a **Detalle de Grupo** (`/group/:id`)
    - 🔘 Botón "Escanear QR" ➔ Activa cámara para unirse
- 🔍 **Detalle de Grupo** (`/group/:id`) [Protegido]
  - 🔘 Botón "Registrar Gasto" (Plus / FAB) ➔ Redirige a **Registrar Gasto** (`/group/:groupId/register-expense`)
  - 🔘 Botón "Volver" ➔ Redirige a **Dashboard** (`/dashboard`)
  - 📑 Pestaña "Actividad" ➔ Muestra lista de gastos realizados
  - 📑 Pestaña "Saldos" ➔ Muestra balance entre miembros
  - 📑 Pestaña "Integrantes" ➔ Muestra QR de invitación y lista de miembros
  - 🔘 Botón "Liquidar" (en balance negativo) ➔ Abre **Modal de Liquidación**
    - 📂 **Modal de Liquidación**:
      - 🔘 Opción "Tarjeta/Transferencia/Efectivo" ➔ Redirige a **Liquidar Deuda** (`/group/:id/settle-up`)
- 📝 **Registrar Gasto** (`/group/:id/register-expense`) [Protegido]
  - 🔘 Botón "Confirmar Gasto" ➔ Registra y redirige a **Detalle de Grupo** (`/group/:id`)
  - 🔘 Botón "Volver" ➔ Redirige a **Detalle de Grupo** (`/group/:id`)
- 💰 **Liquidar Deuda** (`/group/:id/settle-up`) [Protegido]
  - 🔘 Botón "Confirmar Pago" ➔ Procesa y redirige a **Detalle de Grupo** (`/group/:id`)
- 👤 **Perfil de Usuario** (`/profile`) [Protegido]
  - 🔘 Botón "Editar Perfil" ➔ Redirige a **Datos Personales** (`/profile/personal-data`)
  - 🔘 Botón "Seguridad 2FA" ➔ Redirige a **Configurar 2FA** (`/2fa-setup`)
  - 🔘 Botón "Cerrar Sesión" ➔ Redirige a **Auth** (`/auth`)
- 🔐 **Seguridad y Otros**
  - 🛡️ **Configurar 2FA** (`/2fa-setup`) ➔ Redirige a **Verificar 2FA** (`/2fa-verify`)
  - 📧 **Recuperar Contraseña** (`/recover-password`)
  - 🤳 **Unirse vía QR** (`/qr-scanner`) ➔ Redirige a **Detalle de Grupo** tras éxito

---

## 📱 Árbol de Navegación Móvil (`apps/mobile-app`)

La navegación móvil utiliza un sistema de pestañas (Tabs) para las funciones principales y una pila de pantallas (Stack) para flujos específicos y modales.

- 🏁 **Onboarding / Landing** (`/`)
  - 🔘 Botón "Crear Mesa" / "Unirme" ➔ Redirige a **Auth** (`/auth`)
  - 🔘 Botón "Comenzar Gratis" ➔ Redirige a **Auth** (`/auth`)
- 🔑 **Autenticación** (`/auth`)
  - 📑 Modo "Login" / "Register"
    - 🔘 Botón "Entrar" ➔ Redirige a **Dashboard** (`/(tabs)`)
    - 🔘 Botón "Crear Cuenta" ➔ Redirige a **Configuración de Seguridad** (`/security-setup`)
  - 🔘 Botón "Continuar como Invitado" ➔ Abre prompt de nombre
    - 🔘 Botón "Entrar a Dashboard" ➔ Redirige a **Dashboard** (`/(tabs)`)
- 🏠 **Tab Barra Inferior (Main Tabs)**
  - 🔘 **Inicio** (`/(tabs)/index` - Dashboard)
    - 🔘 Avatar ➔ Redirige a **Ajustes** (`/settings`)
    - 🔘 Acción Rápida "Nueva Mesa" ➔ Redirige a **Nueva Mesa** (`/new-mesa`)
    - 🔘 Acción Rápida "Unirse mesa" ➔ Cambia a **Tab QR**
    - 🔘 Acción Rápida "Liquidar" ➔ Redirige a **Liquidar** (`/settle-up`)
    - 🗂️ Tarjeta "Mesa en curso" ➔ Redirige a **Nueva Mesa** (`/new-mesa`)
    - 📑 Lista "Actividad Reciente" ➔ Click en ítem redirige a **Detalle de Gasto** (`/expense/receipt/[id]`)
  - 🔘 **Grupos** (`/(tabs)/group`)
    - 🔘 Botón "+" ➔ Redirige a **Crear Grupo** (`/create-group`)
    - 🗂️ Tarjeta de Grupo ➔ Redirige a **Detalle de Grupo** (`/(tabs)/group/[id]`)
    - 🔘 Botón FAB "Añadir" ➔ Redirige a **Nueva Mesa** (`/new-mesa`)
  - 🔘 **QR / Escáner** (`/(tabs)/qr`)
    - 📷 Interfaz de Cámara ➔ Escanea QR para unirse a mesa/grupo.
  - 🔘 **Cartera** (`/(tabs)/payments`)
    - 🔘 Ver historial de transacciones.
  - 🔘 **Alertas** (`/(tabs)/notifications`)
    - 🔘 Ver notificaciones de pagos y grupos.
- 🥘 **Flujo de Mesa / Gasto**
  - 🍽️ **Nueva Mesa / Mesa Activa** (`/new-mesa`)
    - 🔘 Botón "Escanear QR" (Header) ➔ Redirige a **Escanear QR** (`/scan-qr`)
    - 📑 Pestañas Internas: Miembros, Ítems, Totales.
    - 🔘 Botón "OCR Compare" ➔ Redirige a **Revisión OCR** (`/ocr-review`)
    - 🔘 Tarjeta de Ítem ➔ Redirige a **Detalle de Ítem** (`/item-detail`)
    - 🔘 Botón "Cerrar y Dividir Mesa" ➔ Abre **Confirmación de Cierre**
  - 📄 **Detalle de Gasto** (`/expense/receipt/[id]`)
  - 📸 **Escáner OCR** (`/ocr-scanner`)
- 👥 **Flujo de Grupo Detallado** (`/(tabs)/group/[id]`)
  - 📑 Pestañas Internas: Miembros, Ítems, Totales.
  - 🔘 Botón "Cerrar y Dividir Mesa" ➔ Finaliza flujo de grupo.
- ⚙️ **Configuración y Perfil** (`/settings`)
  - 🔘 Botón "Seguridad de Cartera" ➔ Abre Modal **Seguridad** (`/wallet/security`)
  - 🔘 Gestión de Métodos de Pago ➔ Abre Modales (`/wallet/methods/new`, `/wallet/methods/[id]`)
  - 🔘 Cerrar Sesión ➔ Redirige a **Landing** (`/`)
- 🛠️ **Modales y Utilidades**
  - ➕ **Añadir Amigo** (`/friends/add`) [Modal]
  - 🛡️ **Configuración Seguridad** (`/security-setup`)
  - 🕒 **Historial Detallado** (`/wallet/history/[id]`) [Modal]
