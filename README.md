# 💸 EASY-PAY: Ecosistema de Gestión de Gastos Compartidos

¡Bienvenido a **EASY-PAY**! Esta es una plataforma integral diseñada para facilitar el registro y la liquidación de gastos entre amigos y grupos. El sistema combina una aplicación móvil nativa, un backend potente y una interfaz web de administración, todo orquestado mediante **Docker**.

---

## 🏗️ 1. Arquitectura del Sistema (100% Dockerizado)

El proyecto está estructurado como un **Monorepositorio** con servicios orquestados:

- **🐍 API Backend (`apps/api-backend`)**: API Unificada basada en **FastAPI**. Gestiona Auth, Grupos, Gastos y Estadísticas en un solo punto de entrada (Puerto 8000).
- **🌐 Web App (`apps/web-app`)**: Panel administrativo construido con **React + Vite**.
- **📱 Mobile App (`apps/mobile-app`)**: App nativa con **Expo SDK 54**. (Se corre localmente para conectar con Expo Go).
- **🗄️ Database**: **MongoDB** local persistente mediante volúmenes de Docker.

---

## 🚀 2. Inicio Rápido (The One-Command Start)

Para levantar todo el ecosistema (Backend + Web + DB) con un solo comando:

```powershell
# 1. Configurar IP y entorno (Detecta tu IP local automáticamente)
./start-all.ps1

# 2. Levantar el ecosistema Docker
docker-compose up --build
```

> [!TIP]
> Si estás en la red restringida de la UNACH, el script `start-all.ps1` configurará automáticamente los túneles y la IP necesaria.

---

## 🛠️ 3. Comandos de Mantenimiento y Rescate

Si el entorno se vuelve inestable o quieres empezar desde cero:

### Limpieza Profunda (Rescue Script)
Ejecuta el script de rescate para borrar caches, `node_modules` y carpetas temporales:
```powershell
./clean-install.ps1
```

### Comandos Útiles de Docker
- **Ver Logs:** `docker-compose logs -f`
- **Bajar Todo:** `docker-compose down`
- **Reiniciar Limpio:** `docker system prune -a` (Borra imágenes y contenedores huérfanos).
- **Reinstalar en Docker:** `docker-compose up --build --force-recreate`

---

## ⚙️ 4. Configuración de Red (Mobile)

Para que el celular (Expo Go) se conecte al backend de la PC:
1. Asegúrate de que ambos estén en la misma red Wi-Fi.
2. El archivo `.env` debe tener `EXPO_PUBLIC_API_URL=http://<TU_IP_LOCAL>:8000`.
3. Si la red bloquea conexiones directas, usa el modo **Localtunnel** incluido en el script de inicio.

---

## 📜 5. Documentación Oficial
- [Requerimientos del Proyecto](./requerimientos.md): Especificaciones técnicas y funcionales.
- [Diagnóstico de Red](./DIAGNOSTICO.md): Guía para resolver problemas de conexión en la UNACH.
- [Estado del Despliegue](./ESTADO_DEL_DESPLIEGUE.md): Resumen de la infraestructura actual.

---
*Última Actualización DevOps: Abril 2026*
