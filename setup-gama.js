const os = require('os');
const fs = require('fs');
const { execSync, spawn } = require('child_process');

// 1. Detectar IP Local
const interfaces = os.networkInterfaces();
let localIp = 'localhost';
for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
        if (iface.family === 'IPv4' && !iface.internal) {
            localIp = iface.address;
            break;
        }
    }
    if (localIp !== 'localhost') break;
}
console.log(`\n🚀 [1/4] IP local detectada: ${localIp}`);

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
    
    // Actualizar dinámicamente la IP por si cambió de red
    const apiUrLRegex = /^EXPO_PUBLIC_API_URL=.*$/m;
    const newApiUrl = `EXPO_PUBLIC_API_URL=http://${localIp}:8000`;
    
    if (apiUrLRegex.test(envContent)) {
        envContent = envContent.replace(apiUrLRegex, newApiUrl);
    } else {
        envContent += `\n${newApiUrl}`;
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
    ? 'cd apps\\mobile-app && if exist node_modules rmdir /s /q node_modules && if exist .expo rmdir /s /q .expo && if exist package-lock.json del package-lock.json && npm install --legacy-peer-deps'
    : 'cd apps/mobile-app && rm -rf node_modules .expo package-lock.json && npm install --legacy-peer-deps';

execSync(cleanCmd, { stdio: 'inherit' });

console.log(`\n🔥 ¡Todo listo! Escanea el QR con tu celular:\n`);
const npmCmd = isWin ? 'npm.cmd' : 'npm';
spawn(npmCmd, ['run', 'start:clean'], {
    cwd: './apps/mobile-app',
    stdio: 'inherit'
});
