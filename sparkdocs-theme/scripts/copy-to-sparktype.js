import fs from 'fs/promises'
import path from 'path'

const SPARKTYPE_PATH = '/Users/mattkevan/Sites/sparktype/public/themes/sparkdocs'

async function copyTheme() {
  const srcDir = './src'
  const distDir = './dist'

  try {
    console.log('📦 Copying theme to Sparktype...')

    // Copy source templates to dist (Vite already built CSS there)
    await fs.cp(srcDir, distDir, {
      recursive: true,
      force: true,
      errorOnExist: false,
      filter: (src) => {
        // Skip src/styles.css - it's built by Vite to dist/styles.css
        const relativePath = path.relative(process.cwd(), src)
        return relativePath !== 'src/styles.css' && !relativePath.endsWith('/styles.css')
      }
    })

    // Ensure destination exists
    await fs.mkdir(SPARKTYPE_PATH, { recursive: true })

    // Copy complete dist to Sparktype
    await fs.cp(distDir, SPARKTYPE_PATH, {
      recursive: true,
      force: true
    })

    console.log('✅ Theme copied to Sparktype!')
  } catch (error) {
    console.error('❌ Error copying theme:', error.message)
    process.exit(1)
  }
}

copyTheme()
