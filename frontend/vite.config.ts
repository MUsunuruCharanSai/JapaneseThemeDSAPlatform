import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: Number(process.env.FRONTEND_PORT) || 3000,
    proxy: {
      '/api': {
        target: process.env.BACKEND_URL || 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    // Optimize for production across all devices
    target: 'esnext',
    minify: 'esbuild',
    cssCodeSplit: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          firebase: ['firebase/auth'],
        },
      },
    },
    // Ensure compatibility across different screen sizes
    assetsInlineLimit: 4096,
  },
  // Optimize for different screen resolutions
  css: {
    devSourcemap: true,
  },
  // Define viewport meta tag for responsive design
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
})
