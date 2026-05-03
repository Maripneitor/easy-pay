# Easy-Pay: Comparativa de Ecosistemas (Web vs. Mobile)

Este documento detalla la paridad de funcionalidades, el estado operativo y la infraestructura técnica de las plataformas Web y Móvil de Easy-Pay.

## 📊 Tabla Comparativa de Funcionalidades

| Funcionalidad | Web App (Desktop) | Mobile App (Expo) | Estado Operativo |
| :--- | :---: | :---: | :---: |
| **Autenticación (Login/Reg)** | ✅ Full | ✅ Full | 🟢 Operativo |
| **Seguridad 2FA** | ✅ Configuración | ✅ Configuración | 🟢 Operativo |
| **Recuperación Contraseña** | ✅ Implementado | ✅ Implementado | 🟢 Operativo |
| **Dashboard / Estadísticas** | ✅ Avanzado (Gráficas) | ✅ Resumen | 🟢 Operativo |
| **Gestión de Grupos** | ✅ Completo | ✅ Completo | 🟢 Operativo |
| **Unirse por Código/QR** | ✅ Código | ✅ QR + Código | 🟢 Operativo |
| **Registro de Gastos** | ✅ Formulario | ✅ Formulario | 🟢 Operativo |
| **Escaneo OCR (Recibos)** | ✅ Carga Archivo | ✅ Cámara + Revisión | 🟢 Operativo |
| **Gestión de Pagos (Wallet)** | ✅ Tarjetas Espejo | ✅ Listado Tarjetas | 🟢 Operativo |
| **Asistente de Liquidación** | ✅ Wizard (Pasos) | ✅ Directo | 🟢 Operativo |
| **Arqueo de Caja** | ✅ Premium | ❌ N/A | 🟢 Operativo |
| **Notificaciones** | ❌ Push (Web) | ✅ Nativo/Expo | 🟡 En Desarrollo |

---

## 🛠️ Estado Técnico y Conectividad

### 🌐 Infraestructura Común
Ambas aplicaciones están integradas mediante un backend unificado en **FastAPI** y una base de datos **MongoDB Atlas**.

- **API Base URL**: `http://192.168.1.5:8000/api` (Configurable vía `.env`).
- **Sincronización**: Utilizan Repositorios unificados para asegurar que los saldos y grupos sean idénticos en tiempo real.

### 💻 Web App (React + Vite)
- **Tecnologías**: React 18, Tailwind CSS, Framer Motion, Lucide Icons.
- **Enfoque**: Optimizado para pantallas grandes, gestión administrativa pesada y visualización detallada de estadísticas.
- **Estado**: Totalmente conectado y funcional. Se han corregido errores de contraste en 2FA y sintaxis en la gestión de pagos.

### 📱 Mobile App (Expo Router)
- **Tecnologías**: React Native, Expo Router, NativeWind (Tailwind), Lucide Native.
- **Enfoque**: Optimizado para la inmediatez, uso de cámara para OCR y escaneo de códigos QR en puntos de venta.
- **Estado**: Operativo en red local. Soporta el flujo completo desde onboarding hasta liquidación de deudas.

---

## 🚀 Diferenciadores Clave

### Experiencia Web (Desktop Optimization)
- **Arqueo de Caja**: Módulo financiero avanzado para cuadre de caja diario.
- **Wizard de Liquidación**: Interfaz guiada por pasos para dividir cuentas complejas (propina, división equitativa vs manual).
- **Diseño Premium**: Uso de Glassmorphism avanzado y animaciones fluidas para una sensación de software de escritorio moderno.

### Experiencia Mobile (On-the-go)
- **QR Scanner**: Integración nativa con la cámara para unirse a grupos de forma instantánea.
- **Navegación por Gestos**: Uso de `tabs` y navegación nativa para mayor fluidez.
- **OCR Directo**: Permite tomar una foto del recibo y procesarlo inmediatamente sin subir archivos manualmente.

---

## 📋 Próximos Pasos (Roadmap)
1. **Push Notifications**: Sincronizar alertas de pago entre Web y Mobile.
2. **Offline Mode**: Cacheo de grupos en Mobile para consulta sin conexión.
3. **Reportes PDF**: Generación de reportes de liquidación exportables desde la Web.

---
**Easy-Pay © 2026** - *Engineering for Seamless Payments.*
