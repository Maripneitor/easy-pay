# Reporte de Diagnóstico de Conexiones a Internet - Easy-Pay

Este reporte detalla el estado actual de la conectividad y el entorno de desarrollo del proyecto Easy-Pay, enfocado en los problemas detectados en la red de la UNACH y la integración con dispositivos móviles.

## 1. Estado Actual de la Conectividad

- **Entorno de Red UNACH:**
    - Se ha identificado que la red institucional de la UNACH presenta restricciones significativas (firewalls, posibles proxies y filtrado de DNS).
    - **Bloqueos:** Puertos comúnmente utilizados para desarrollo (8081 para Metro, 8000 para FastAPI, 3000 para Web) pueden estar restringidos, impidiendo la visibilidad entre el PC y el celular.
    - **DNS:** Se han detectado errores de resolución en contenedores Docker cuando se trabaja bajo esta red.

- **Solución de Red Alternativa (Celular/Starlink):**
    - Se está utilizando una conexión vía Hotspot (Celular o Starlink Mini) para evadir las restricciones institucionales.
    - **IP Local detectada:** `192.168.1.101` (vía adaptador USB WiFi).
    - **Gateway:** `192.168.1.254`.
    - Esta red permite la libre comunicación entre dispositivos y el acceso a servicios externos como MongoDB Atlas.

## 2. Problemas Detectados y Causas

| Problema | Causa Probable |
| :--- | :--- |
| **App no conecta con el celular** | Aislamiento de red en UNACH (AP Isolation) que impide que dos dispositivos en la misma WiFi se vean entre sí. |
| **"No cargaba" / Errores de red** | El Metro Bundler (Expo) no podía servir el bundle al celular debido al firewall de Windows o bloqueos de la red UNACH. |
| **Errores en Docker** | DNS de la UNACH no resuelve correctamente dentro del puente (bridge) de Docker. |
| **Lentitud/Timeouts** | Proxies institucionales inspeccionando tráfico HTTPS. |

## 3. Especificaciones del Entorno

- **Sistema Operativo:** Windows (Nativo).
- **WSL:** **NO SE ESTÁ UTILIZANDO WSL.** Todo el desarrollo corre sobre el sistema de archivos y terminales de Windows (PowerShell/CMD).
- **Herramientas de Bypass:** Se ha implementado el uso de `localtunnel` y configuraciones dinámicas en `setup-gama.js` para facilitar la conexión cuando se está en entornos restrictivos.

## 4. Recomendaciones y Soluciones

1. **Priorizar Red Externa:** Continuar usando el Hotspot del celular o Starlink para pruebas con el dispositivo físico.
2. **Uso de USB/ADB:** En caso de fallas en la WiFi, utilizar `adb reverse` para mapear los puertos del backend y el bundler directamente por cable USB.
3. **Configuración de Firewall:** Asegurar que los puertos 19000, 19001, 8081 y 8000 estén abiertos en el Firewall de Windows para el perfil de red "Privada".
4. **Localtunnel:** Usar el flag `--unach` en los scripts de inicio para exponer el backend si se requiere acceso remoto fuera de la red local.

---
*Reporte generado automáticamente por Antigravity AI.*
