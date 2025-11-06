import fs from 'fs/promises'
import path from 'path'

const SPARKTYPE_PATH = '/Users/matt/Sites/sparktype/public/themes/sparksite'

async function copyTheme() {
  const srcDir = './src'
  const distDir = './dist'

  try {
    console.log('📦 Building theme bundle...')

    // 1. Copy all source files except styles.css (which is built by Vite)
    await fs.cp(srcDir, distDir, {
      recursive: true,
      force: true,
      filter: (src) => {
        // Skip src/styles.css - it's built by Vite to dist/styles.css
        const relativePath = path.relative(process.cwd(), src)
        return relativePath !== 'src/styles.css' && !relativePath.endsWith('/styles.css')
      }
    })
    console.log('✓ Copied templates to dist')

    // 2. Built CSS is already in dist/styles.css from Vite
    console.log('✓ CSS built by Vite in dist/styles.css')

    // 3. Copy complete dist to Sparktype
    await fs.cp(distDir, SPARKTYPE_PATH, {
      recursive: true,
      force: true
    })

    console.log('✅ Theme copied to Sparktype successfully!')
    console.log(`   ${SPARKTYPE_PATH}`)
  } catch (error) {
    console.error('❌ Error copying theme:', error.message)
    process.exit(1)
  }
}

copyTheme()
