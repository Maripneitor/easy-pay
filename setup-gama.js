const os = require('os');
const fs = require('fs');
const { execSync, spawn } = require('child_process');

async function main() {
    // 0. Detectar Argumentos
    const args = process.argv.slice(2);
    const isUnach = args.includes('--unach');
    const isUsb = args.includes('--usb');

    // 1. Detectar IP Local o Iniciar Túnel / ADB Reverse
    const interfaces = os.networkInterfaces();
    let localIp = isUsb ? 'localhost' : 'localhost';
    if (!isUsb) {
        for (const name of Object.keys(interfaces)) {
            // Ignorar interfaces virtuales comunes que rompen la conexión con el móvil
            if (name.toLowerCase().includes('wsl') || 
                name.toLowerCase().includes('vbox') || 
                name.toLowerCase().includes('virtual') || 
                name.toLowerCase().includes('docker') ||
                name.toLowerCase().includes('hyper-v')) continue;

            for (const iface of interfaces[name]) {
                if (iface.family === 'IPv4' && !iface.internal) {
                    localIp = iface.address;
                    break;
                }
            }
            if (localIp !== 'localhost') break;
        }
    }

    let apiUrl = `http://${localIp}:8000`;

    if (isUsb) {
        console.log(`\n🔌 [MODO USB ACTIVADO]`);
        console.log(`📡 Mapeando puerto 8000 vía ADB para conexión directa...`);
        try {
            execSync('adb reverse tcp:8000 tcp:8000');
            apiUrl = `http://localhost:8000`;
            console.log(`✅ [1/4] ADB Reverse activo: ${apiUrl}`);
        } catch (e) {
            console.error('❌ Error: No se pudo ejecutar ADB. ¿Tienes el celular conectado y la Depuración USB activa?');
            process.exit(1);
        }
    } else if (isUnach) {
        console.log(`\n🏫 [MODO UNACH ACTIVADO]`);
        console.log(`🌐 Iniciando LocalTunnel para bypass de AP Isolation...`);
        const localtunnel = require('localtunnel');
        let tunnelAttempts = 0;
        const maxAttempts = 3;
        
        while (tunnelAttempts < maxAttempts) {
            try {
                const tunnel = await localtunnel({ port: 8000 });
                apiUrl = tunnel.url;
                console.log(`🚀 [1/4] Túnel activo: ${apiUrl}`);
                
                tunnel.on('close', () => {
                    console.log('⚠️ El túnel API se ha cerrado.');
                });

                tunnel.on('error', (err) => {
                    console.error('❌ Error en el túnel API:', err.message);
                });
                break; 
            } catch (err) {
                tunnelAttempts++;
                console.error(`❌ Intento de túnel ${tunnelAttempts}/${maxAttempts} fallido:`, err.message);
                if (tunnelAttempts >= maxAttempts) {
                    console.error('💥 No se pudo establecer el túnel. Revisa tu conexión.');
                    process.exit(1);
                }
                await new Promise(r => setTimeout(r, 2000));
            }
        }
    } else {
        console.log(`\n🚀 [1/4] IP local detectada: ${localIp}`);
    }

    // 2. Gestión Inteligente de Variables de Env (.env)
    const rootEnvPath = './.env';
    const templatePath = './env.template';
    const envMobilePath = './apps/mobile-app/.env';
    const envBackendPath = './apps/api-backend/.env';

    if (!fs.existsSync(rootEnvPath)) {
        // PASO B: Crear .env raíz desde plantilla si no existe
        console.log(`📝 [2/4] Creando archivo .env principal en la raíz...`);
        if (fs.existsSync(templatePath)) {
            let templateContent = fs.readFileSync(templatePath, 'utf8');
            let finalContent = templateContent.replace(/{{LOCAL_IP}}/g, localIp);
            // Si es UNACH, también queremos que el .env inicial tenga la URL del túnel si es posible, 
            // pero el flujo de Paso B suele ser para la primera vez. 
            // Vamos a mantener la lógica de reemplazo de IP y luego el Paso C lo actualizará si es necesario.
            fs.writeFileSync(rootEnvPath, finalContent);
            
            console.log(`\n🛑 ¡ALTO! He creado tu archivo .env en la raíz del proyecto.`);
            console.log(`👉 Por favor, ábrelo, coloca tu URL de MongoDB Atlas real y vuelve a ejecutar este comando.`);
            process.exit(0);
        } else {
            console.error('❌ Error: No se encontró env.template en la raíz.');
            process.exit(1);
        }
    } else {
        // PASO C: El .env existe, lo actualizamos y distribuimos
        console.log(`🔄 [2/4] Actualizando y distribuyendo variables de entorno...`);
        let envContent = fs.readFileSync(rootEnvPath, 'utf8');
        
        // Actualizar dinámicamente la IP solo si hay una línea activa (no comentada)
        const apiUrLRegex = /^EXPO_PUBLIC_API_URL=.*$/m;
        const newApiUrlLine = `EXPO_PUBLIC_API_URL=${apiUrl}`;
        
        if (apiUrLRegex.test(envContent)) {
            console.log(`📡 URL API Actualizada en .env: ${apiUrl}`);
            envContent = envContent.replace(apiUrLRegex, newApiUrlLine);
        } else {
            console.log(`⚠️ No se encontró una línea activa de EXPO_PUBLIC_API_URL. Añadiéndola...`);
            envContent += `\nEXPO_PUBLIC_API_URL=${apiUrl}`;
        }
        
        // Guardar cambios en el .env raíz y copiar a microservicios
        fs.writeFileSync(rootEnvPath, envContent);
        fs.writeFileSync(envMobilePath, envContent);
        fs.writeFileSync(envBackendPath, envContent);
        console.log(`✅ Variables sincronizadas en todos los servicios.`);
    }

    // 3. Levantar Docker (Backend + BD Cloud)
    console.log(`🐳 [3/4] Levantando contenedores (Docker)...`);
    try {
        execSync('docker compose up -d --build', { stdio: 'inherit' });
    } catch (error) {
        console.error('❌ Error al levantar Docker. Asegúrate de tener Docker Desktop abierto.');
        process.exit(1);
    }

    // 4. Limpiar, instalar y correr Expo
    console.log(`📱 [4/4] Limpiando caché, instalando e iniciando Expo...`);
    const isWin = process.platform === "win32";
    const cleanCmd = isWin
        ? 'cd apps\\mobile-app && if exist .expo rmdir /s /q .expo && npm install --legacy-peer-deps --prefer-offline'
        : 'cd apps/mobile-app && rm -rf .expo && npm install --legacy-peer-deps --prefer-offline';

    try {
        execSync(cleanCmd, { stdio: 'inherit' });
    } catch (e) {
        console.warn('⚠️ Error durante la instalación/limpieza, intentando continuar...');
    }

    console.log(`\n🔥 ¡Todo listo! Escanea el QR con tu celular:\n`);
    const npmCmd = isWin ? 'npm.cmd' : 'npm';
    const expoArgs = ['run', 'start:clean'];
    
    if (isUsb) {
        console.log("🛠️ Iniciando Expo en modo Local (USB)...");
        try { execSync('adb reverse tcp:8081 tcp:8081'); } catch(e) {}
        spawn('npx', ['expo', 'start', '-c'], {
            cwd: './apps/mobile-app',
            stdio: 'inherit',
            shell: true
        });
    } else if (isUnach) {
        console.log("🛠️ Iniciando Expo en modo Túnel...");
        spawn('npx', ['expo', 'start', '-c', '--tunnel'], {
            cwd: './apps/mobile-app',
            stdio: 'inherit',
            shell: true
        });
    } else {
        spawn(npmCmd, expoArgs, {
            cwd: './apps/mobile-app',
            stdio: 'inherit',
            shell: true
        });
    }
}

main().catch(err => {
    console.error('💥 Error crítico en el orquestador:', err);
    process.exit(1);
});

