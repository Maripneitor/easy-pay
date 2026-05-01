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
        target: 'http://192.168.1.9:8000', // Apunta al backend en Megacable
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
