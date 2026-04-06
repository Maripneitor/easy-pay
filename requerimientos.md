# Easy-Pay Mobile: Requerimientos y Diseño de Producto

Este documento define la visión, reglas y arquitectura del módulo móvil de **Easy-Pay**.

---

# Bloque 1. Base del producto

## 1. Resumen ejecutivo del módulo mobile
**Easy-Pay** resuelve la fricción y falta de transparencia al dividir cuentas en grupos, eliminando la necesidad de cálculos manuales complejos.
*   **Usuarios:** Comensales en restaurantes, desde el líder que gestiona el ticket hasta los invitados que solo validan su consumo.
*   **Flujo Principal:** Ingreso (Invitado/Cuenta) → Creación/Unión a Mesa → Carga de Consumos (Manual/OCR) → Asignación de Ítems → Cierre y División Dinámica.
*   **Alcance MVP:** Una aplicación funcional, offline-first, que permita llegar hasta el cierre de la mesa y el registro de deudas individuales.

---

## 2. Alcance del MVP mobile

### ✅ Lo que SÍ entra:
*   Onboarding: Login, Registro y "Continuar como Invitado".
*   Mesas: Crear mesa, unirse por **código numérico de 4 a 6 dígitos**, unirse por QR.
*   Consumos: Agregar ítems manuales, escaneo OCR de tickets físicos.
*   Lógica: Revisión de OCR, asignación de ítems a N personas, cálculo automático de propina (regla 10%/5%).
*   UX: Totales individuales, visualización de estados de pago, previsualización de ticket digital.
*   Arquitectura: Sincronización básica offline-first con banner de estado.

### ❌ Lo que NO entra (Fase Futura):
*   Historial de mesas para usuarios invitados (solo local/efímero).
*   Pasarelas de pago reales (Stripe/Apple Pay) integradas.
*   Múltiples líderes gestionando la misma mesa simultáneamente.
*   Cupones de descuento complejos o promociones bancarias.

---

## 3. Actores y roles

| Rol | Puede unirse | Puede agregar ítems | Puede editar sus ítems | Puede asignar ítems | Puede cerrar mesa |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Invitado** | Sí | Sí | Sí, los suyos | No | No |
| **Usuario normal** | Sí | Sí | Sí, los suyos | No | No |
| **Líder** | Sí | Sí | Sí, todos | Sí | Sí |

---

## 4. Reglas de negocio

### 4.1 Gestión de mesa
- El creador de la mesa se convierte automáticamente en el **Líder** único de la sesión.
- Solo el **Líder** puede asignar ítems a otros comensales y ejecutar el cierre final de la mesa.
- Los miembros pueden agregar ítems a la cuenta general, pero no pueden asignarlos a otros participantes ni cerrar la mesa.
- Los miembros solo pueden editar o eliminar los ítems que ellos mismos hayan agregado.
- El Líder puede editar o eliminar cualquier ítem de la mesa.
- Una mesa solo permite nuevos participantes mientras su estado sea `ACTIVA`.

### 4.2 Estados de la mesa
- Una mesa inicia en estado `ACTIVA`.
- Cuando el Líder inicia el subflujo de cierre, la mesa cambia a estado `CERRANDO`.
- Cuando el Líder confirma el cierre, la mesa cambia a estado `CERRADA`.
- Una mesa en estado `CERRADA` ya no permite:
  - agregar ítems
  - editar asignaciones
  - permitir nuevas uniones por QR o código

### 4.3 Cálculos y división
- Todo ítem debe tener un nombre, precio válido y cantidad mayor a cero.
- Los ítems compartidos se dividen en partes iguales entre todos los participantes asignados.
- El subtotal individual de cada participante se calcula con base en los ítems que tenga asignados.
- La propina se calcula de forma global sobre el subtotal de la mesa:
  - si el subtotal es menor a `$3,000 MXN`, la propina sugerida es del `10%`
  - si el subtotal es igual o mayor a `$3,000 MXN`, la propina sugerida es del `5%`
- La propina total se divide equitativamente entre todos los participantes activos de la mesa.
- Todos los montos monetarios deben redondearse a **2 decimales**.

### 4.4 Reglas de asignación
- Ningún ítem debe considerarse liquidado mientras no tenga participantes asignados.
- Un ítem sin asignación puede existir temporalmente durante la captura o edición, pero debe resolverse antes del cierre.
- Solo el Líder puede confirmar la asignación final de un ítem.

### 4.5 Sincronización y conflictos
- La aplicación opera bajo un enfoque **offline-first**.
- Las acciones realizadas sin conexión se almacenan en una cola local de sincronización.
- Al recuperar conexión, las acciones pendientes se reintentan automáticamente.
- El servidor determina la versión oficial del estado de la mesa.
- Las acciones exclusivas del Líder tienen prioridad funcional sobre las acciones de los miembros cuando exista conflicto.

### 4.6 Bloqueadores de cierre
- No se puede cerrar la mesa si existe al menos un ítem sin asignar.
- No se puede cerrar la mesa si existe una sincronización crítica pendiente.
- No se puede cerrar la mesa si el estado oficial de la mesa no ha sido confirmado por el sistema.

---

# Bloque 2. Flujo del usuario

## 5. Flujo principal paso a paso

### Flujo Ideal (Golden Path)
1. Usuario entra a la app y elige "Continuar como Invitado".
2. Crea una nueva mesa para el grupo.
3. Escanea el ticket físico (OCR) o agrega gastos manualmente.
4. Revisa y corrige precios en la vista de revisión si usó OCR.
5. El Líder asigna los consumos a los participantes correspondientes.
6. El sistema calcula los totales individuales más la propina correspondiente.
7. El Líder inicia el **Subflujo de Cierre** y confirma la división.
8. Cada usuario visualiza su deuda individual y el resumen final.

### Flujos Secundarios
*   **Unirse por QR:** Escaneo directo desde el dashboard para entrar a una mesa existente.
*   **Unirse por Código:** Ingreso manual del código numérico proporcionado por el líder.
*   **Consultar Estado de Pago:** Ver quién ha liquidado su parte tras el cierre.

---

## 6. Mapeo de vistas (Flujo Completo)

| Vista | Propósito | Quién la usa | Acciones | Validaciones | Estado exitoso | Estado de error | Navega a |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `auth.tsx` | Onboarding | Todos | Login/Invitado | Mail/Pass válidos | Sesión activa | Error credenc. | `dashboard` |
| `dashboard.tsx` | Inicio | Todos | Crear/Unirse | Usuario autentic. | Lista de grupos | Error de red | `new-mesa` |
| `join-code.tsx` | Unión Manual | Miembro | Digitar código | 4-6 dígitos num. | Ingreso a mesa | Código inválido | `new-mesa` |
| `scan-qr.tsx` | Unión Cámara | Miembro | Escanear QR | QR legible | Ingreso a mesa | QR no válido | `new-mesa` |
| `new-mesa.tsx` | Gestión Mesa | Líder/Miembro | Asignar/Ver | Rol validado | Mesa gestionada | Sync error | `Summary` |
| `add-expense.tsx` | Carga Manual | Todos | Crear Ítem | Nombre/Precio | Ítem agregado | Datos incompletos | `new-mesa` |
| `ocr-review.tsx` | Conciliación | Líder | Validar/Editar | OCR procesado | Items listos | Lectura fallida | `new-mesa` |
| `item-detail.tsx` | Edición Ítem | Líder | Modificar/Borrar | Precio > 0 | Ítem guardado | Error validac. | `new-mesa` |
| `payment-status.tsx`| Ver deudas | Todos | Consultar | Mesa cerrada | Lista de pagos | Error carga | `dashboard` |
| `Summary (Subv.)` | Resumen Final | Todos | Ver Ticket | Cierre iniciado | Ticket generado | Error cálculo | `dashboard` |

---

## 10. Navegación y rutas

*   **Acceso Invitado:** El invitado navega directamente al `dashboard.tsx` tras asignar su nombre.
*   **Cierre de Mesa:** El Ticket Digital se maneja como un **Subflujo de Cierre** dentro de `new-mesa.tsx` para evitar saltos bruscos de navegación.
*   **QR y Códigos:** Solo permiten la unión a mesas con estado `ACTIVA`.

---

# Bloque 3. Estados y datos

## 7. Estados especiales y manejo de errores

| Caso | Qué lo provoca | Qué ve el usuario | Qué hace el sistema |
| :--- | :--- | :--- | :--- |
| **Código inválido** | Ingreso incorrecto | Toast: "Código no encontrado" | Bloquea entrada |
| **Sin conexión** | Red caída | Banner "Modo Offline" | Encola cambios locales |
| **Conflicto ítem** | Edición simultánea | Toast: "Cambio re-sincronizado" | Aplica versión oficial |
| **OCR Baja Conf.** | Lectura borrosa | Alerta: "Revisar precios" | Forza paso por `ocr-review` |
| **Mesa Cerrada** | Intentar unirse tarde | Mensaje: "Mesa finalizada" | Redirige al Dashboard |

---

## 8. Definición de estados de cada entidad

*   **Estado de Mesa:** `ACTIVA` | `CERRANDO` (en resumen) | `CERRADA`
*   **Estado de Pago:** `PENDIENTE` | `PAGANDO` | `PAGADO` | `ERROR_PAGO`
*   **Estado de Sincronización:** `SYNCED` | `PENDING` | `OFFLINE` | `CONFLICT`
*   **Estado de OCR:** `SIN_ESCANEAR` | `PROCESANDO` | `REVISADO` | `CONCILIADO`

---

## 9. Modelo de datos mobile (Lógico)

*   **User/Guest:** `{ id, name, email?, isGuest }`
*   **Mesa:** `{ id, code, leaderId, participants[], items[], status, subtotal, tip, total }`
*   **Item:** `{ id, name, price, quantity, assignedTo[] }`
*   **PaymentStatus:** `{ participantId, mesaId, amountDue, amountPaid, status }`
*   **DigitalTicket:** `{ mesaId, participantId, subtotal, tip, total, generatedAt }`
*   **SyncQueue:** `{ action, payload, retryCount }`

---

## 13. Matriz de Datos por Vista (Contenido Actual)

Detalle de qué información consume y muestra cada pantalla directamente del store global.

| Vista | Datos de Entrada (Consumo) | Datos de Salida (Muestra) | Cálculos en Pantalla |
| :--- | :--- | :--- | :--- |
| **Dashboard** | Lista de Mesas Activas, Perfil Usuario | Nombre de Mesa, Código, Rol del Usuario | N/A |
| **Mesa Activa** | Objeto `Mesa` completo, Participantes | Lista de ítems, Avatares, Precios base | Progreso de asignación |
| **OCR Review** | Resultados brutos de la API OCR | Comparativa Manual vs Ticket, Diferencias | % de coincidencia sugerido |
| **Add Expense** | Lista de Participantes de la Mesa | Inputs de Nombre/Precio, Checkbox de involucrados | División preliminar dinámica |
| **Item Detail** | Propiedades de un `Item` específico | Quién lo agregó, quién lo comparte | División individual del ítem |
| **Summary** | Totales, Items Asignados, Regla de Propina | Subtotal, Propina (5%/10%), Total Grupo | Deuda exacta por persona |
| **Payment Status**| Estado de deuda individual | Monto a pagar, QR de pago (futuro) | Saldo restante |

---

## 14. Matriz de Visibilidad por Rol (Perspectiva de Datos)

Cómo cambia la visualización de datos según el tipo de usuario.

*   **Líder:** 
    *   Ve todos los botones de acción (Editar, Borrar, Asignar).
    *   Ve el botón "Cerrar Mesa".
    *   Ve quién no ha asignado sus ítems.
*   **Invitado / Miembro:**
    *   Ve sus propios ítems con opción de edición limitada.
    *   Ve el resumen del grupo pero sin permisos de modificación global.
    *   Ve un banner: "Esperando a que el líder cierre la mesa".

---

# Bloque 4. UX y validación

## 11. Criterios de aceptación por vista

### `join-code.tsx`
*   Permite ingresar un código numérico de 4 a 6 dígitos.
*   Muestra error si la mesa está cerrada o no existe.
*   Redirige a la mesa activa tras una validación exitosa.

### `ocr-review.tsx`
*   Muestra diferencias entre el ticket original y la carga manual.
*   Permite aceptar correcciones sugeridas por la IA.
*   Actualiza la lista final de ítems al confirmar la conciliación.

### Cierre de Mesa
*   Solo el Líder puede disparar el cierre.
*   El sistema bloquea el cierre si hay ítems sin asignar o errores de sincronización.
*   Genera el ticket digital con la división de propina 10%/5% correcta.

---

## 12. Interacción Usuario-Vista (Feedback UX)

Esta sección detalla cómo la interfaz comunica estados y reacciona a las acciones del usuario para mantener una experiencia "premium".

| Acción | Reacción Visual / Feedback | Componente Responsable |
| :--- | :--- | :--- |
| **Carga de Pantalla** | Skeletons de carga o Spinners minimalistas. | `MotiView` / `ActivityIndicator` |
| **Acción Exitosa** | Toast de confirmación en la parte superior/inferior. | `Toast` (Context) |
| **Error de Cámara/OCR** | Borde rojo dinámico y vibración suave (Haptics). | `ocr-scanner.tsx` |
| **Cambio de Tab** | Transición lateral suave (Slide). | `new-mesa.tsx` (Internal Tabs) |
| **Sync Pendiente** | Banner amarillo persistente con contador de la cola. | `SyncStatus` |
| **Pull to Refresh** | Animación de actualización de datos de la mesa. | `ScrollView` (RefreshControl) |
| **Cierre de Mesa** | Overlay difuminado (Blur) y modal de confirmación. | `Summary (Modal)` |

---

## 15. Mapeo Detallado de Acciones y Datos (Screen-by-Screen)

Este apartado detalla qué botones existen en cada pantalla, qué acción disparan y de dónde provienen los datos mostrados.

### A. Dashboard (Operaciones y Resumen)
| Elemento | Acción | Datos Mostrados |
| :--- | :--- | :--- |
| **Boton "Nueva Mesa"** | Crea una mesa instantánea (Líder). | Saldo Total, "Me Deben", "Debes". |
| **Boton "Unirse mesa"** | Navega al escáner QR (`/qr`). | N/A. |
| **Boton "Liquidar"** | Abre flujo de saldar deudas. | Lista de deudas pendientes. |
| **Pinch "Ojo" (Balance)** | Alterna visibilidad de montos. | Montos reales vs `***.**`. |
| **Lista "Actividad"** | Acceso a detalles de consumos. | Título, Fecha, Monto, Tipo (Owe/Rec). |
| **Avatar / Perfil** | Navega a `setting.tsx`. | Foto de perfil y nombre del Auth. |

### B. Unión a Mesa (Code/QR)
| Elemento | Acción | Datos Mostrados |
| :--- | :--- | :--- |
| **Input de Código** | Valida el string ingresado. | Feedback de "Buscando mesa...". |
| **Scanner QR** | Procesa cámara; une al usuario. | Status de cámara (Permisos). |
| **Boton "Validar"** | Llama a `joinMesa` en el store. | Error en código / Éxito. |

### C. Mesa Activa (`new-mesa.tsx`)
| Elemento | Acción | Datos Mostrados |
| :--- | :--- | :--- |
| **Tab: Miembros** | Muestra quiénes están en la mesa. | Nombres, Avatares, Status (Online). |
| **Tab: Ítems** | Lista central de consumos. | Platillo, Precio, Quién lo comparte. |
| **Tab: Totales** | Resumen financiero grupal. | Subtotal, Propina (10%/5%), Total. |
| **Boton "ADD (+)"** | Navega a `add-expense.tsx`. | N/A. |
| **Boton "OCR Compare"** | Abre `ocr-review.tsx`. | N/A. |
| **Main Button (Líder)** | Abre subflujo de Cierre. | Monto faltante vs Monto cargado. |
| **Boton Salir (Back)** | Alerta de "Abandonar mesa". | Nombre de la Mesa. |

### D. Alta de Gasto (`add-expense.tsx`)
| Elemento | Acción | Datos Mostrados |
| :--- | :--- | :--- |
| **Input Nombre/Precio** | Define el nuevo ítem. | N/A. |
| **Checkboxes Miembros**| Selecciona con quién dividir. | Lista de participantes activos. |
| **Boton "Seleccionar Todos"**| Marca a todos los participantes. | N/A. |
| **Boton "Guardar Gasto"** | Inyecta el ítem al store. | Cálculo dinámico: `$ Share p/p`. |

### E. Detalle/Edición (`item-detail.tsx`)
| Elemento | Acción | Datos Mostrados |
| :--- | :--- | :--- |
| **Boton "Borrar"** | Elimina ítem tras confirmación. | Nombre del ítem. |
| **Input Precio/Cant** | Actualiza el monto del ítem. | Datos actuales del store. |
| **Badge "TÚ" / Otros** | Indica quién cargó el gasto. | AutorId del ítem. |
| **Boton "Guardar"** | Llama a `updateItem`. | N/A. |

---

# Bloque 5. Ejecución del proyecto

## 16. Decisiones abiertas y Pendientes

*   ¿Los pagos parciales (pagar solo una fracción de la deuda individual) entran en el MVP?
*   ¿El ticket digital será una vista exportable (imagen/PDF)?
*   Reglas para pagos realizados por terceros dentro del mismo grupo.

---

## 17. Plan de Implementación (Módulo Mobile)

Este plan detalla el orden de ejecución para garantizar un MVP robusto y funcional antes de la expansión a la plataforma Web.

### **Fase 1: Base Técnica y Arquitectura**
*   Configurar navegación con **Expo Router**.
*   Definir tipos globales (`Mesa`, `Participant`, `SyncQueue`, etc.).
*   Crear Store Global para estado de mesa, sesión y sincronización.
*   Implementar persistencia local y el componente `SyncStatus`.

### **Fase 2: Onboarding y Acceso**
*   Vistas: `auth.tsx` y `dashboard.tsx`.
*   Flujo "Continuar como Invitado" con asignación de nombre efímero.
*   Feedback de errores en credenciales.

### **Fase 3: Creación y Unión a Mesa**
*   Vistas: `join-code.tsx`, `scan-qr.tsx`.
*   Generación de código numérico de 4 a 6 dígitos.
*   Validación de estado `ACTIVA` para permitir ingreso.

### **Fase 4: Gestión de Mesa Activa**
*   Vista: `new-mesa.tsx`.
*   Implementación de Tabs internas: Miembros, Ítems, Totales.
*   Identificación de roles (Líder vs Miembro).

### **Fase 5: Alta Manual de Ítems**
*   Vista: `add-expense.tsx`.
*   Validación de campos y guardado instantáneo en estado global.
*   Encolado offline si no hay red.

### **Fase 6: OCR y Conciliación**
*   Vistas: `ocr-scanner.tsx`, `ocr-review.tsx`.
*   Captura, procesamiento y vista de comparación entre ticket y manual.
*   Revisión obligatoria en caso de baja confianza.

### **Fase 7: Edición de Ítems**
*   Vista: `item-detail.tsx`.
*   Permisos por rol: Miembros (solo propios) / Líder (todos).

### **Fase 8: Asignación de Consumos**
*   Lógica de reparto dentro de `new-mesa.tsx`.
*   División automática de costos compartidos.

### **Fase 9: Cálculo de Propina y Totales**
*   Implementación estricta de la regla **10% (subtotal < $3k) / 5% (subtotal ≥ $3k)**.
*   Redondeo a 2 decimales en todos los montos individuales.

### **Fase 10: Estado de Pago**
*   Vista: `payment-status.tsx`.
*   Visualización de deudas solo tras el cierre de mesa.

### **Fase 11: Subflujo de Cierre**
*   Vista interna `Summary` en `new-mesa.tsx`.
*   Bloqueo de cierre por ítems sin asignar o errores de sync.

### **Fase 12: Ticket Digital**
*   Representación lógica de deuda por participante.
*   Vista de resumen final (preparada para futura exportación a PDF).

### **Fase 13: Estados Especiales y Manejo de Errores**
*   Implementación de Toasts y Banners para: Código Inválido, Sin Conexión, Conflicto de Edición.

### **Fase 14: Offline-First y Sincronización**
*   Gestión de la cola `SyncQueue`.
*   Reintentos automáticos y resolución de estados (`OFFLINE`, `SYNCED`, `CONFLICT`).

### **Fase 15: Validación Final (Checklist)**
*   Acceso invitado funcionando.
*   División y propina exacta.
*   Bloqueo de cierres inválidos.
*   E2E funcional del flujo Unión → OCR → Asignación → Cierre.

---

## 18. Estatus de implementación — Versión 1.0 (Módulo Mobile)

| Módulo | Estado | Notas |
| :--- | :--- | :--- |
| **Arquitectura (Offline-First)** | 100% | `MesaContext` + `SyncQueue` implementados. |
| **Autenticación / Invitado** | 100% | Login, Registro e Invitado funcional. |
| **Creación/Unión de Mesa** | 100% | Código QR y Numérico integrados al store. |
| **Mesa Activa (Core)** | 100% | Gestión de ítems y participantes en tiempo real. |
| **OCR y Conciliación** | 100% | Escaneo + Inyección de ítems al estado global. |
| **Gastos Manuales** | 100% | Alta manual con división dinámica. |
| **Subflujo de Cierre** | 100% | Bloqueos por rol y cálculo de propina final. |
| **Pagos y Ticket Digital** | 90% | Resumen visual listo, PDF pendiente. |

---
*Este documento es el eje rector para el desarrollo Mobile y sirve como base para las pruebas de calidad (QA).*
