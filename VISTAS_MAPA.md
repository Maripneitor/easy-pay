# 🗺️ Mapeo de Vistas - Aplicación Móvil (Easy-Pay)

Este documento detalla cada pantalla de la aplicación móvil, su propósito y los elementos que componen su interfaz de usuario.

---

## 1. Nombre de la Pantalla / Vista: AuthScreen (Login / Registro)
**Propósito Principal:** Permitir a los usuarios acceder a su cuenta, crear una nueva o entrar como invitados.

### Elementos de Texto (Estáticos y Dinámicos):
- **Títulos:** "Easy-Pay", "¡Hola, invitado!" [Estado: Modo Invitado].
- **Subtítulos:** "Sin matemáticas, sin dramas", "Dinos cómo debemos llamarte para asignarte tus consumos".
- **Etiquetas (Labels):** "Nombre completo", "Email", "Contraseña", "Tu Nombre / Apodo", "O continúa con".
- **Mensajes de error/validación:** "Por favor completa todos los campos", "Contraseña incorrecta" [Estado Condicional].

### Elementos Interactivos (Botones y Controles):
- **Botones Principales (CTA):** 
    - Botón "Entrar" / "Crear Cuenta" - Acción: Valida credenciales e inicia sesión/registro.
    - Botón "Entrar a Dashboard" [Estado: Modo Invitado] - Acción: Crea sesión temporal.
- **Botones Secundarios:**
    - Selector "Iniciar Sesión" / "Registrarse" (Tabs).
    - Botón "Continuar como Invitado" - Acción: Cambia la vista al formulario de invitado.
    - Botón "Google" / "Apple" - Acción: Autenticación social.
    - Botón "Volver" - Acción: Regresa al login desde el modo invitado.
    - Icono de "ojo" - Acción: Muestra/Oculta caracteres de la contraseña.
- **Campos de Entrada (Inputs):** Input de nombre, email, contraseña y apodo de invitado.

### Elementos Visuales / Estructurales:
- **Imágenes/Iconos:** Logo de Easy-Pay, Iconos de MaterialIcons (mail, lock, person, person-add).
- **Decoración:** Fondos difuminados (blobs) azules.

---

## 2. Nombre de la Pantalla / Vista: OnboardingScreen
**Propósito Principal:** Configuración inicial del perfil del usuario tras el registro.

### Elementos de Texto (Estáticos y Dinámicos):
- **Títulos:** "Completemos tu perfil", "Ajustes financieros", "Todo listo para empezar".
- **Subtítulos:** "¿Cómo prefieres que te llamen?", "Configura tu moneda local", "¡Bienvenido a EasyPay!".
- **Etiquetas (Labels):** "Nombre Público", "Elige tu moneda", "Tus datos están protegidos".

### Elementos Interactivos (Botones y Controles):
- **Botones Principales (CTA):** "Siguiente Paso" / "Comenzar ahora" - Acción: Avanza en el stepper.
- **Botones Secundarios:** 
    - "Omitir por ahora" - Acción: Salta la configuración.
    - Opciones de Moneda (MXN, USD, EUR) - Acción: Selecciona moneda base.
- **Campos de Entrada (Inputs):** Input de "Nombre Público".

### Elementos Visuales / Estructurales:
- **Imágenes/Iconos:** Foto de perfil de usuario (placeholder), icono de cámara, icono de celebración, icono de escudo.
- **Navegación:** Stepper (indicador de progreso de 3 puntos).

---

## 3. Nombre de la Pantalla / Vista: DashboardScreen (Inicio)
**Propósito Principal:** Centro de control principal con resumen financiero y acceso a operaciones rápidas.

### Elementos de Texto (Estáticos y Dinámicos):
- **Títulos:** "Hola, [Nombre Usuario]", "Easy-Pay Dashboard".
- **Subtítulos:** "Operaciones Rápidas", "Actividad Reciente".
- **Etiquetas (Labels):** "Saldo Total", "Me Deben", "Debes" [Dinámicos: Montos monetarios], "Ver Todo".
- **Estados Condicionales:** "¡Aún no hay actividad!" (Si la lista está vacía).

### Elementos Interactivos (Botones y Controles):
- **Botones Principales (CTA):**
    - "Nueva Mesa" - Acción: Navega a creación de grupo.
    - "Unirse mesa" - Acción: Abre scanner QR.
    - "Liquidar" - Acción: Navega a flujo de pagos.
- **Botones Secundarios:**
    - Icono "Ojo" - Acción: Oculta/Muestra montos financieros.
    - Avatar de usuario - Acción: Abre ajustes.
    - Tarjetas de Actividad - Acción: Abre detalle de gasto o mesa.
- **Otros controles:** Carousel de tarjetas de resumen financiero.

### Elementos Visuales / Estructurales:
- **Imágenes/Iconos:** Logo, Avatar de usuario, Iconos de MaterialIcons (wallet, restaurant, qr-code, handshake).
- **Barras de navegación:** Bottom Tab Bar (Home, Friends, Payments, QR, Settings).

---

## 4. Nombre de la Pantalla / Vista: CreateGroupScreen
**Propósito Principal:** Configurar el nombre y detalles de una nueva mesa de consumo.

### Elementos de Texto (Estáticos y Dinámicos):
- **Títulos:** "Crear Mesa".
- **Subtítulos:** "Inicia una nueva sesión para dividir la cuenta".
- **Etiquetas (Labels):** "Nombre de la Mesa", "Descripción (Opcional)", "Rol: Líder".

### Elementos Interactivos (Botones y Controles):
- **Botones Principales (CTA):** "Iniciar Sesión de Mesa" - Acción: Crea la mesa en la API y navega al ticket.
- **Botones Secundarios:** Botón "Atrás" (Chevron).
- **Campos de Entrada (Inputs):** Input de nombre del restaurante, área de texto para descripción.

### Elementos Visuales / Estructurales:
- **Imágenes/Iconos:** Icono de tienda/negocio, icono de información.

---

## 5. Nombre de la Pantalla / Vista: NewMesaScreen (Ticket Virtual)
**Propósito Principal:** Gestión en tiempo real de los ítems de la mesa y asignación de participantes.

### Elementos de Texto (Estáticos y Dinámicos):
- **Títulos:** "[Nombre de la Mesa]" (Ej: Sonora Grill).
- **Subtítulos:** "Sincronizado" / "Cambios Pendientes" [Estado: Sync Status].
- **Etiquetas (Labels):** "Miembros", "Ítems", "Totales", "Consumos", "Total Acumulado", "Tú debes pagar" [Estado: Summary].
- **Mensajes dinámicos:** "Faltan $X.XX" (En botón principal) [Estado Condicional].

### Elementos Interactivos (Botones y Controles):
- **Botones Principales (CTA):** 
    - "Cerrar y Dividir Mesa" [Estado: Solo Líder y si el total coincide].
    - "Confirmar Cierre" (En modal de confirmación).
- **Botones Secundarios:**
    - Selector de Tabs (Miembros, Ítems, Totales).
    - Icono "QR Scanner" - Acción: Abre cámara para unir gente.
    - Botón "OCR Compare" - Acción: Abre comparación con ticket escaneado.
    - Tarjetas de Platillo - Acción: Abre detalle de ítem.
    - Avatares de participantes - Acción: Asigna/Desasigna el platillo al usuario.
- **Otros controles:** Modal de confirmación de cierre con overlay oscuro.

### Elementos Visuales / Estructurales:
- **Imágenes/Iconos:** Avatares de amigos con bordes de colores, iconos de restaurante, check-circle.
- **Navegación:** Botón de retroceso y barra de estado de sincronización.

---

## 6. Nombre de la Pantalla / Vista: OCRScannerScreen
**Propósito Principal:** Interfaz de cámara para capturar y analizar tickets físicos mediante IA.

### Elementos de Texto (Estáticos y Dinámicos):
- **Etiquetas:** "AI Scanner Pro", "Detectando Recibo...", "Lectura Exitosa" [Estado: Post-procesado].
- **Subtítulos:** "Capturar para Procesar", "12 ITEMS IDENTIFICADOS", "Analizando..." [Estado: Cargando].

### Elementos Interactivos (Botones y Controles):
- **Botones Principales (CTA):**
    - Obturador (Botón circular) - Acción: Toma la foto.
    - "REVISAR RESULTADOS" - Acción: Navega a la comparativa.
- **Botones Secundarios:**
    - Botón "Cerrar" (X).
    - Botón "Flash".
    - "DESCARTAR Y REPETIR" - Acción: Limpia la imagen y vuelve a la cámara.

### Elementos Visuales / Estructurales:
- **Cámara:** Viewfinder con bordes animados azules "escaneando".
- **Feedback:** Activity indicator grande durante el análisis de IA.

---

## 7. Nombre de la Pantalla / Vista: OCRReviewScreen
**Propósito Principal:** Validar y corregir los datos extraídos por el OCR comparándolos con los datos manuales.

### Elementos de Texto (Estáticos y Dinámicos):
- **Títulos:** "Revisión OCR".
- **Subtítulos:** "Comparativa vs. Ticket".
- **Etiquetas (Labels):** "Diferencia", "Faltante", "Coincidencia" (Contadores), "Manual", "Ticket OCR".

### Elementos Interactivos (Botones y Controles):
- **Botones Principales (CTA):** "Confirmar Hallazgos" - Acción: Agrega los ítems detectados a la mesa.
- **Botones Secundarios:** 
    - "Usar valor del ticket" - Acción: Sobrescribe el valor manual con el del OCR.
    - Flecha de retroceso.

### Elementos Visuales / Estructurales:
- **Visualización de discrepancias:** Bordes amarillos para diferencias de precio, azules para ítems nuevos.
- **Iconos:** Rayo de IA, check de coincidencia, alerta de error.

---

## 8. Nombre de la Pantalla / Vista: ItemDetailScreen
**Propósito Principal:** Modificar o eliminar un platillo específico.

### Elementos de Texto (Estáticos y Dinámicos):
- **Títulos:** "Detalle del Platillo".
- **Etiquetas (Labels):** "Nombre", "Precio Unitario", "Cant.", "Consumido por".
- **Mensajes de aviso:** "Solo el autor o el líder pueden editar este platillo" [Estado Condicional].

### Elementos Interactivos (Botones y Controles):
- **Botones Principales (CTA):** "Guardar Cambios" - Acción: Actualiza el ítem en la base de datos.
- **Botones Secundarios:**
    - Icono "Basura" - Acción: Abre alerta de confirmación para eliminar.
    - Botón "Cerrar" (X).
- **Campos de Entrada (Inputs):** Input de nombre, precio (numérico) y cantidad (numérico).

### Elementos Visuales / Estructurales:
- **Imágenes/Iconos:** Icono de platillo/cubiertos, icono de usuario verificado (Líder).

---
---

# 🎨 Mapa de Temas y Colores

Este análisis desglosa el sistema de diseño visual de la aplicación, identificando la paleta base y su comportamiento dinámico entre los 6 temas disponibles (Light, Default/Dark, Vibrant, Serene, Earth, Pink).

## 1. Paleta de Colores Base (Raw Colors)

| Nombre del Color | Valor Hex | Descripción Visual |
| :--- | :--- | :--- |
| **Azul Primario (Default)** | `#38bdf8` | Azul cielo brillante (Sky 400). |
| **Azul Primario (Light)** | `#2196F3` | Azul Material Design estándar. |
| **Rojo Mate (Vibrant)** | `#f87171` | Rojo suave, no agresivo. |
| **Verde Bosque (Serene)** | `#34d399` | Verde esmeralda suave. |
| **Ámbar (Earth)**| `#fbbf24` | Amarillo cálido tipo miel. |
| **Rosa Lomecan (Pink)** | `#ff4081` | Rosa vibrante / Magenta. |
| **Fondo Profundo** | `#050a15` | Azul medianoche casi negro. |
| **Fondo Nieve** | `#F8FAFC` | Blanco grisáceo muy claro. |
| **Gris Pizarra** | `#94a3b8` | Gris azulado para textos secundarios. |

## 2. Mapeo Semántico por Tema (Comportamiento)

| Elemento de Interfaz | Modo Claro (Light) | Modo Oscuro (Default) | Temas Coloridos (Vibrant/etc) |
| :--- | :--- | :--- | :--- |
| **Fondo Principal** | `#F8FAFC` | `#050a15` | Basado en tono (ej: `#1a0a0a`) |
| **Tarjetas (Cards)** | `#FFFFFF` | `#0c1425` | Tono oscuro del color base |
| **Tarjetas Secundarias** | `rgba(241, 249, 0.8)` | `rgba(30, 41, 59, 0.4)` | Alpha del color base |
| **Texto Principal** | `#0f172a` (Negro Azulado) | `#ffffff` (Blanco) | `#ffffff` / `#f8fafc` |
| **Texto Secundario** | `#64748b` | `#94a3b8` | Tono aclarado del primario |
| **Botones (Fondo)** | `#2196F3` (Azul) | `#38bdf8` (Primario) | Color Primario del Tema |
| **Botones (Texto)** | `#FFFFFF` | `#050a15` (o Blanco) | `#ffffff` |
| **Bordes y Divisores** | `rgba(33, 150, 243, 0.1)` | `rgba(56, 189, 248, 0.2)` | Color base con 20% opacidad |
| **Cristal (GlassBg)** | `rgba(0, 0, 0, 0.03)` | `rgba(255, 255, 255, 0.05)` | `rgba(255, 255, 255, 0.05)` |

### Estados del Sistema (Globales):
- **Errores/Peligro:** Modo Claro `#f43f5e` (Rose 500) | Modo Oscuro `#fb7185` (Rose 400).
- **Éxito:** Modo Claro `#10b981` (Emerald 500) | Modo Oscuro `#34d399` (Emerald 400).
- **Advertencia:** `#f59e0b` (Amber 500) en todos los modos.

---

## 3. Detección de Inconsistencias (Hardcoded Colors)

Se han identificado múltiples archivos donde los colores están **"quemados" (hardcoded)** usando clases de Tailwind o estilos en línea, ignorando el `ThemeContext` dinámico. Esto causará que estas pantallas no se vean correctamente al cambiar de tema.

### Hallazgos Críticos:
1. **`auth.tsx` & `auth-phone.tsx`**:
   - Poseen fondos fijos en `#0f172a` y `#1e293b`.
   - Botones con `bg-[#2196F3]` fijo (No cambia a Rojo en tema Vibrant).
   - Textos con `text-slate-400` fijos que desaparecen en fondos claros.

2. **`onboarding.tsx`**:
   - Usa `bg-blue-600` y `bg-[#0d1425]` de forma estática.
   - Si el usuario elige tema "Earth" (Ámbar), los indicadores de paso seguirán siendo azules.

3. **`ocr-scanner.tsx`**:
   - Interfaz totalmente oscura fijada en `#0f172a` y `bg-black`.
   - Elementos visuales como `border-blue-500` que no respetan el color de marca seleccionado.

4. **`Dashboard (index.tsx)`**:
   - Los gradientes de las estadísticas (`STATS`) tienen colores fijos (`#06b6d4`, `#f43f5e`) que podrían chocar visualmente con los temas Vibrant o Serene.

> [!WARNING]
> **Recomendación de Arquitectura:** Se sugiere reemplazar las clases de Tailwind estáticas (ej: `bg-blue-600`) por estilos dinámicos que consuman el objeto `theme` del `ThemeContext`, o definir una paleta de colores personalizada en `tailwind.config.js` que use variables CSS/Nativas sincronizadas con el contexto.

