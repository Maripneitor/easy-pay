import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    watch: {
      usePolling: true
    },
    // 👇 ESTO ES LO NUEVO
    proxy: {
      '/api': {
        target: 'http://backend:8000', // 'backend' es el nombre del servicio en docker-compose
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, '') // Opcional: si quieres quitar el prefijo /api
      }
    }
  },
  resolve: {
    alias: {
      '@easy-pay/shared': path.resolve(__dirname, '../../packages/shared/index.ts'),
      '@ui': path.resolve(__dirname, './src/ui'),
      '@application': path.resolve(__dirname, './src/application'),
      '@infrastructure': path.resolve(__dirname, './src/infrastructure'),
    }
  }
})
