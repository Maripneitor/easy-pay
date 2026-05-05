Para tener el control total en tres terminales separadas, ejecuta estos comandos desde la **carpeta raíz** del proyecto (`Easy-Pay`):

### 1. Terminal BACKEND (Docker)

Este comando levantará todos los microservicios en segundo plano.

```powershell
npm run dev:backend

docker-compose up unified-api
```

### 2. Terminal WEB (Vite)

Este comando iniciará el servidor de desarrollo para la aplicación web en el puerto 5173.

```powershell
npm run dev:web
```

### 3. Terminal MOBILE (Expo)

Este comando iniciará el Metro Bundler para la aplicación móvil con la configuración de red local (LAN).

```powershell
npm run dev:mobile
```

---

**Tip Pro:** Si prefieres ver todo en una sola terminal combinada (usando `concurrently`), puedes simplemente ejecutar:

```powershell
npm run dev
```

Pero si prefieres debuguear por separado, la opción de las 3 terminales anteriores es la mejor.
