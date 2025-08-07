import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, './src'),
      "@pages": path.resolve(__dirname, './src/pages'),
      "@components": path.resolve(__dirname, './src/components'),
      "@context": path.resolve(__dirname, './src/context'),
      "@utils": path.resolve(__dirname, './src/utils'),
      "@styles": path.resolve(__dirname, './src/styles'),
      "@hooks": path.resolve(__dirname, './src/hooks'),
      "@type": path.resolve(__dirname, './src/type'),
    }
  }
})
