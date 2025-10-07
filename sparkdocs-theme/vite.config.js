import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss({
      // Tell Tailwind which files to scan for class names
      content: [
        './theme/**/*.hbs'
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
