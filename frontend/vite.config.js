import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,                // 1
    environment: 'jsdom',         // 2
    setupFiles: './src/setup.js', // 3
    reporters: ['default', 'verbose'],
  },
})