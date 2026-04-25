# 💸 EASY-PAY: Gestión de Gastos Compartidos

¡Bienvenido a **EASY-PAY**! Esta es una plataforma integral diseñada para facilitar el registro y la liquidación de gastos entre amigos y grupos. El sistema combina una aplicación móvil nativa con un backend potente y una interfaz web de administración.

---

## 🏗️ 2. Arquitectura del Sistema

El proyecto está estructurado como un **Monorepositorio** que interactúa con servicios distribuidos:

- **📱 Mobile App (`apps/mobile-app`)**: Desarrollada con **Expo SDK 54** y **React Native**. Utiliza una arquitectura de capas (Infrastructure, Application, UI) y un sistema de temas dinámico.
- **🐍 Backend (`apps/api-backend`)**: Basado en **FastAPI**. Actualmente fragmentado en tres servicios lógicos que comparten la misma base de datos MongoDB:
  - `main.py`: Gestión de Usuarios y Autenticación.
  - `main_groups.py`: Lógica de Grupos y Gastos.
  - `main_stats.py`: Servicio de Estadísticas y Gráficos.
- **🌐 Web App (`apps/web-app`)**: Panel administrativo construido con **React + Vite + TailwindCSS**.
- **🗄️ Base de Datos**: **MongoDB Atlas** (en la nube) para persistencia global.

---

## ⚙️ 3. Estado de Funcionalidades

### 🔐 Autenticación y Seguridad
- **Registro de Usuarios**: ✅ Completo (incluye bypass de desarrollo para duplicados).
- **Inicio de Sesión**: ✅ Completo (JWT Auth).
- **2FA (Doble Factor)**: ✅ Completo (Configuración y verificación mediante código).
- **Cambio de Contraseña**: ✅ Completo (Validación de contraseña actual y nueva).
- **Recuperación de Cuenta**: ✅ Completo (Flujo basado en correo y 2FA).

### 👥 Gestión de Grupos
- **Creación de Grupos**: ✅ Completo.
- **Unión por Código**: ✅ Completo.
- **Eliminación de Grupos**: ✅ Completo (Eliminación lógica y física).
- **Visualización de Balances**: ✅ Completo (Cálculo en tiempo real de deudas).

### 🧾 Gestión de Gastos (Ítems)
- **Registro Manual**: ✅ Completo (Asignación selectiva a miembros).
- **Edición de Gastos**: ✅ Completo (Endpoint listo, UI integrada).
- **Escaneo OCR**: ⚠️ Parcial (Interfaz de cámara funcional, pero el procesamiento es **Simulado**).

### 📊 Otros
- **Estadísticas**: ✅ Completo (Gráficos circulares y de barras funcionales).
- **PWA (Versión Web de Mobile)**: ✅ Completo (Exportación estática disponible).

---

## 🐛 4. Problemas y Riesgos Detectados

- **Fragmentación del Backend**: La existencia de tres archivos `main*.py` independientes genera redundancia y dificulta el despliegue coherente.
- **Estabilidad Mobile**: El uso de "shims" para `moti` y `react-native-worklets` es una medida temporal para evitar crashes en la arquitectura New Architecture de Expo, lo que limita las animaciones avanzadas.
- **OCR Simulado**: El sistema promete IA en la interfaz, pero la lógica de extracción de datos de la imagen no está conectada a un servicio real de Visión Artificial.
- **Liquidación Estática**: La pantalla `settle-up` muestra datos fijos y no realiza transacciones reales ni actualizaciones de estado en la DB.

---

## 🚧 5. Trabajo Pendiente

- **Unificación del Backend**: Consolidar los tres puntos de entrada en una sola API robusta o definir formalmente la arquitectura de microservicios.
- **Integración OCR Real**: Conectar el `ocr-scanner` con un servicio como Google Cloud Vision o AWS Textract.
- **Módulo de Pagos**: Implementar una pasarela real (Stripe/PayPal) o al menos un sistema de confirmación de pago manual que actualice los balances.
- **Notificaciones Push**: Activar el `NotificationProvider` con Firebase (FCM) para avisos de nuevos gastos o deudas pendientes.

---

## ▶️ 6. Cómo Ejecutar el Proyecto

### Requisitos
- Docker Desktop.
- Node.js LTS.
- Expo Go en dispositivo móvil.

### Pasos
1. **Configurar Red**: Asegúrate de que tu PC y móvil estén en la misma red.
2. **Setup Automático**:
   ```bash
   npm run gama  # Detecta tu IP y configura el .env
   ```
3. **Levantar Backend**:
   ```bash
   docker compose up -d
   ```
4. **Iniciar Mobile**:
   ```bash
   cd apps/mobile-app
   npx expo start --lan
   ```

---
*Última Auditoría Técnica: Abril 2026*
