# 🚀 Easy-Pay: Onboarding Relámpago (Modo Gama)

¡Hola Gama! Hemos reducido la fricción a **CERO**. Ya no tienes que buscar tu IP, ni configurar archivos `.env`, ni abrir múltiples terminales. 

## ⚡ El Único Comando que Necesitas
Abre una terminal en la raíz del proyecto y ejecuta:

```bash
npm run gama
```

---

## 🎯 ¿Qué hace este comando por ti?
1.  **Detecta tu IP Local:** Configura automáticamente la conexión entre tu celular y la PC.
2.  **Genera el .env:** Crea el archivo en `apps/mobile-app` con la configuración correcta.
3.  **Levanta Docker:** Inicia el Backend (FastAPI) y la Base de Datos (MongoDB) en segundos.
4.  **Inicia Expo:** Limpia la caché, instala dependencias y te muestra el **Código QR** en la terminal.

## 📱 Pasos Finales
1.  Espera a que aparezca el **Código QR** en la terminal.
2.  Escanéalo con la app **Expo Go** en tu celular.
3.  ¡Empieza a programar!

## 🧹 Limpieza Total (Si algo falla)
Si quieres resetear todo el entorno, incluyendo los datos de la base de datos:
```bash
docker compose down -v
npm run clean
```

¡Cero fricción, 100% código! 🚀
