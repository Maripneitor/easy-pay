const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Iniciando configuración de Easy-Pay...');

// 1. Configurar .env
const envExamplePath = path.join(__dirname, '.env.example');
const envPath = path.join(__dirname, '.env');

if (!fs.existsSync(envPath)) {
    if (fs.existsSync(envExamplePath)) {
        fs.copyFileSync(envExamplePath, envPath);
        console.log('✅ Archivo .env creado desde .env.example.');
    } else {
        console.warn('⚠️ No se encontró .env.example. Por favor configura el entorno manualmente.');
    }
} else {
    console.log('✅ Archivo .env ya existe. Omitiendo creación.');
}

// 2. Limpiar puertos (Cross-platform: Windows/Linux/Mac)
const ports = [8000, 5173, 19000];
const isWindows = process.platform === 'win32';

ports.forEach(port => {
    try {
        if (isWindows) {
            const output = execSync(`netstat -ano | findstr :${port}`).toString();
            const lines = output.trim().split('\n');
            if (lines.length > 0 && lines[0]) {
                const pid = lines[0].trim().split(/\s+/).pop();
                if (pid && pid !== '0') {
                    execSync(`taskkill /F /PID ${pid}`);
                    console.log(`✅ Puerto ${port} liberado (PID: ${pid}).`);
                }
            }
        } else {
            execSync(`npx --yes kill-port ${port}`);
            console.log(`✅ Puerto ${port} liberado.`);
        }
    } catch (e) {
        // Ignorar errores si el puerto ya estaba libre
    }
});

// 3. Instalar dependencias en cascada (via npm workspaces)
console.log('📦 Instalando dependencias en cascada (Root, Web, Mobile)...');
try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Instalación completada.');
} catch (e) {
    console.error('❌ Falló la instalación de dependencias:', e.message);
    process.exit(1);
}

console.log('✨ Configuración finalizada! Ejecuta "docker-compose up" para iniciar.');
