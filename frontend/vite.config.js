import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Try port 3000 first
    open: true,
    strictPort: false, // Allow Vite to try other ports if 3000 is in use
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Will be dynamically updated by our API service
        changeOrigin: true,
      }
    }
  }
})
