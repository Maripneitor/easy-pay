# 🌐 Easy-Pay Web Dashboard

Esta es la interfaz de administración y visualización web del ecosistema **Easy-Pay**. Proporciona un panel de control para gestionar grupos, visualizar gastos y administrar el perfil de usuario desde cualquier navegador.

---

## 🚀 Tecnologías
- **Core:** React 18
- **Construcción:** Vite
- **Estilos:** Tailwind CSS
- **Estado/Datos:** Hooks personalizados y Context API para sincronización con el Backend.

---

## ⚙️ Estado de la Aplicación Web

### Funcionalidades Implementadas
- **Dashboard de Usuario**: ✅ Visualización de grupos activos y saldos generales.
- **Detalle de Grupo**: ✅ Lista de ítems registrados y balances entre miembros.
- **Gestión de Perfil**: ✅ Edición de datos personales y visualización de estadísticas.
- **Seguridad**: ✅ Configuración de 2FA y flujo de recuperación de contraseña.

### Limitaciones Actuales
- La interfaz web sigue los patrones de la App Móvil pero no incluye el escaneo OCR (exclusivo de Mobile).
- Algunas visualizaciones de gráficos en la web utilizan datos de mock en áreas donde el microservicio de estadísticas aún no está plenamente integrado.

---

## 🛠️ Desarrollo

### Instalación
```bash
npm install
```

### Ejecución
```bash
npm run dev
```
La aplicación se servirá por defecto en `http://localhost:5173`.

---

## 🧪 Notas de Integración
La Web App consume los endpoints definidos en el `api-backend`. Asegúrate de que las variables de entorno en `.env` apunten a la IP correcta del servidor FastAPI (normalmente el puerto 8000 para core y 8001 para estadísticas).
