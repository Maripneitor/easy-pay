import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// SIEMPRE usar 127.0.0.1 porque Vite corre en el HOST, no dentro de Docker.
// Los puertos de los contenedores están mapeados al host: 0.0.0.0:8001->8001, etc.
// Los nombres de servicio Docker (auth-service, group-service) SOLO son resolvibles
// dentro de la red interna de Docker — no desde el proceso Node.js del host.
const getTarget = (port: number) => `http://127.0.0.1:${port}`;

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    strictPort: false, // Si 5173 está ocupado, usa el siguiente disponible
    hmr: {
      // El cliente HMR usará automáticamente el host y puerto desde el que se cargó la página.
      // Esto evita ERR_CONNECTION_REFUSED cuando Vite sube de 5173 a 5174.
    },
    watch: {
      usePolling: true
    },
    proxy: {
      '/api/auth': {
        target: getTarget(8001),
        changeOrigin: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('[vite-proxy] ❌ auth-service error:', err.message);
          });
        },
      },
      '/api/groups': {
        target: getTarget(8002),
        changeOrigin: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('[vite-proxy] ❌ group-service error:', err.message);
          });
        },
      },
      '/api/stats': {
        target: getTarget(8003),
        changeOrigin: true,
      },
      '/api/ocr': {
        target: getTarget(8004),
        changeOrigin: true,
      },
      '/api/notifications': {
        target: getTarget(8005),
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
    },
    dedupe: ['react', 'react-dom']
  }
})
