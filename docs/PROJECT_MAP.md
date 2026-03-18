# 🗺️ Mapa del Proyecto: Vistas y Elementos

EASY-PAY es una plataforma para gestionar gastos compartidos. Aquí tienes un resumen de las pantallas actuales.

---

## 📱 App Móvil (Expo)

### Vistas Principales (Tabs)
- **Dashboard (`dashboard.tsx`)**: Resumen de deudas y saldos totales.
- **Friends (`friends.tsx`)**: Lista de contactos y saldos individuales.
- **Payments (`payments.tsx`)**: Historial de transacciones.

### Vistas de Acción
- **Add Expense (`add-expense.tsx`)**: Registrar un nuevo gasto.
- **OCR Scanner (`ocr-scanner.tsx`)**: Escaneo de tickets.
- **Settle Up (`settle-up.tsx`)**: Flujo de pago de deudas.
- **Create Group (`create-group.tsx`)**: Creación de grupos.

### Vistas de Usuario
- **Auth**: Login y registro.
- **Settings**: Perfil y configuración.
- **Security 2FA**: Autenticación de dos factores.

---

## 🌐 Aplicación Web (React + Vite)

### Páginas (`src/ui/pages`)
1. **Landing Page**: Inicio público.
2. **Dashboard**: Panel principal con gráficas.
3. **Authentication**: Gestión de acceso.
4. **Group Detail**: Detalle de gastos por grupo.
5. **Notifications**: Alertas del sistema.

---

## 🛠️ Stack Tecnológico
- **Frontend**: React (Vite) y React Native (Expo).
- **Estilos**: Tailwind CSS y NativeWind.
- **Backend**: FastAPI (Python) y Node.js.
- **Infraestructura**: Docker y PostgreSQL.
