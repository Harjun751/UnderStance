import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/

const backendHost = process.env.BACKEND_HOST || '127.0.0.1'
const backendPort = process.env.BACKEND_PORT || '3001'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/questions': `http://${backendHost}:${backendPort}`,
    },
  },
})
