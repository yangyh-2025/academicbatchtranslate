import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: './', // 使用相对路径
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/service': {
        target: 'http://localhost:8010',
        changeOrigin: true,
      },
      '/static': {
        target: 'http://localhost:8010',
        changeOrigin: true,
      },
    },
  },
})
