import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: './',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      external: [] // Явно указываем внешние зависимости, если нужно
    }
  },
  server: {
    open: true,
    port: 3000
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src') // Добавляем алиас для удобных путей
    }
  }
})
