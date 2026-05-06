import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// En Docker, debemos usar los nombres de servicio (auth-service, etc.)
// En Local (fuera de Docker), usamos 127.0.0.1
const isDocker = process.env.IS_DOCKER === 'true';

const getTarget = (service: string, port: number) =>
  isDocker ? `http://${service}:${port}` : `http://127.0.0.1:${port}`;

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
        target: getTarget('user-service', 8000), // Antes apuntaba a unified-api:8000 [cite: 1, 33]
        changeOrigin: true,
      },
      '/api/groups': {
        target: getTarget('group-service', 8000), // Puerto correcto para grupos [cite: 3, 212]
        changeOrigin: true,
      },
      '/api/stats': {
        target: getTarget('stats-service', 8000), // Puerto para estadísticas [cite: 4, 212]
        changeOrigin: true,
      },
      '/api/ocr': {
        target: getTarget('ocr-service', 8000), // Puerto para OCR [cite: 3, 212]
        changeOrigin: true,
      },
      '/api/notifications': {
        target: getTarget('notification-service', 8000), // Puerto para notificaciones [cite: 6, 212]
        changeOrigin: true,
      }
    }
  },
  resolve: {
    alias: {
      '@easy-pay/domain': path.resolve(__dirname, '../../packages/domain/src/index.ts'),
      '@ui': path.resolve(__dirname, './src/ui'),
      '@services': path.resolve(__dirname, './src/services'),
      '@application': path.resolve(__dirname, './src/application'),
      '@infrastructure': path.resolve(__dirname, './src/infrastructure'),
      '@domain': path.resolve(__dirname, './src/domain'),
    },
    dedupe: ['react', 'react-dom']
  }
})
