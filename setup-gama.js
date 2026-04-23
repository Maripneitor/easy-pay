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

// 2. Crear .env automáticamente desde plantilla
const templatePath = './env.template';
const envMobilePath = './apps/mobile-app/.env';
const envBackendPath = './apps/api-backend/.env';

if (fs.existsSync(templatePath)) {
    const templateContent = fs.readFileSync(templatePath, 'utf8');
    const finalContent = templateContent.replace(/{{LOCAL_IP}}/g, localIp);
    fs.writeFileSync(envMobilePath, finalContent);
    fs.writeFileSync(envBackendPath, finalContent);
    console.log(`✅ [2/4] Archivos .env distribuidos desde plantilla`);
} else {
    fs.writeFileSync(envMobilePath, `EXPO_PUBLIC_API_URL=http://${localIp}:8000\n`);
    console.log(`⚠️ [2/4] Plantilla no encontrada. Generando .env básico`);
}

// 3. Levantar Docker (Backend + BD)
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
