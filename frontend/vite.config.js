import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite config for frontend dev
// - runs on 127.0.0.1:5173
// - proxies /api to backend at http://localhost:5000
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
      ,
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
