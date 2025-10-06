import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    outDir: 'theme',
    emptyOutDir: false,
    rollupOptions: {
      input: './src/styles.css',
      output: {
        assetFileNames: 'styles.css'
      }
    }
  }
})
