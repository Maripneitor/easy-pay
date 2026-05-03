import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
export default defineConfig({
    plugins: [react()],
    server: {
        host: true,
        port: 5173,
        watch: {
            usePolling: true
        },
        // 👇 PROXY PARA MICROSERVICIOS
        proxy: {
            '/api/auth': {
                target: 'http://auth-service:8001',
                changeOrigin: true,
            },
            '/api/groups': {
                target: 'http://group-service:8002',
                changeOrigin: true,
            },
            '/api/stats': {
                target: 'http://stats-service:8003',
                changeOrigin: true,
            },
            '/api/ocr': {
                target: 'http://ocr-service:8004',
                changeOrigin: true,
            },
            '/api/notifications': {
                target: 'http://notification-service:8005',
                changeOrigin: true,
            }
        }
    },
    resolve: {
        alias: {
            '@easy-pay/domain': path.resolve(__dirname, '../../packages/domain/src/index.ts'),
            '@ui': path.resolve(__dirname, './src/ui'),
            '@application': path.resolve(__dirname, './src/application'),
            '@infrastructure': path.resolve(__dirname, './src/infrastructure'),
        }
    }
});
