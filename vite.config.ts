import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Serve assets from root on Netlify; remove GitHub Pages path
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})
