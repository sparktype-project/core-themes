import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss({
      // Scan source templates for Tailwind classes
      content: [
        './src/**/*.hbs'
      ]
    })
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: './src/styles.css',
      output: {
        assetFileNames: 'styles.css'
      }
    }
  }
})
