# 🗺️ Mapa de Vistas y Elementos - EASY-PAY

EASY-PAY es una plataforma para gestionar gastos compartidos (estilo Splitwise). Aquí tienes un resumen de las pantallas actuales tanto en la App Móvil como en la Web.

## 📱 App Móvil (Expo)

### Vistas Principales (Tabs)
- **Dashboard (`dashboard.tsx`)**: Resumen de deudas y saldos totales. 
  - *Elementos*: Tarjetas de saldo, lista de deudas pendientes.
  - *Conecta a*: `add-expense`, `settle-up`, `notifications`.
- **Friends (`friends.tsx`)**: Lista de amigos con los que compartes gastos.
  - *Elementos*: Buscador, lista de contactos, saldos individuales.
- **Payments (`payments.tsx`)**: Historial de transacciones realizadas.

### Vistas de Acción
- **Add Expense (`add-expense.tsx`)**: Formulario para registrar un nuevo gasto.
  - *Elementos*: Campo de monto, descripción, selector de amigos/grupo.
  - *Conecta a*: `ocr-scanner` (para leer tickets).
- **OCR Scanner (`ocr-scanner.tsx`)**: Cámara para escanear tickets físicos.
- **Settle Up (`settle-up.tsx`)**: Flujo para pagar deudas.
- **Create Group (`create-group.tsx`)**: Creación de nuevos grupos de gasto.

### Vistas de Usuario & Seguridad
- **Auth (`auth.tsx` / `auth-phone.tsx`)**: Login y registro (Email/Teléfono).
- **Settings (`settings.tsx`)**: Configuración de perfil.
- **Security 2FA (`security-2fa.tsx`)**: Configuración de autenticación de dos factores.

---

## 🌐 Aplicación Web (React + Vite)

La estructura web sigue un patrón similar a la móvil pero optimizada para escritorio.

### Páginas (`src/ui/pages`)
1.  **Landing Page**: Página de inicio para usuarios no registrados.
2.  **Dashboard**: Vista principal con gráficas de gastos y estados de cuenta.
3.  **Authentication**: Login, registro y recuperación de contraseña.
4.  **Group Detail**: Vista detallada de los gastos dentro de un grupo específico.
5.  **Notifications**: Panel de alertas sobre nuevos gastos o pagos recibidos.
6.  **Profile / Settings**: Gestión de cuenta y seguridad 2FA.
7.  **OCR Scanner**: Versión web para subir fotos de recibos y procesarlos.

---

## 🔗 Conexiones Generales

1.  **Login/Registro** ➡️ **Dashboard**
2.  **Dashboard** ➡️ **Add Expense / Register Expense**
3.  **Add Expense** ⬅️➡️ **OCR Scanner**
4.  **Dashboard** ➡️ **Settle Up / Pagos**
5.  **Settings** ➡️ **Two Factor Setup**

---

## 🛠️ Tecnologías Comunes
- **Frontend**: React (Vite) / React Native (Expo).
- **Estilos**: Tailwind CSS / NativeWind.
- **Backend**: API en Node.js (carpeta `apps/api-backend`).
