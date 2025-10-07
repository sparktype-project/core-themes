import fs from 'fs/promises'
import path from 'path'

const SPARKTYPE_PATH = '/Users/mattkevan/Sites/sparktype/public/themes/sparkdocs'

async function copyTheme() {
  const themeDir = './theme'
  const distDir = './dist'

  try {
    console.log('📦 Copying theme to Sparktype...')

    // First, copy built CSS from dist to theme directory
    await fs.copyFile(
      path.join(distDir, 'styles.css'),
      path.join(themeDir, 'styles.css')
    )
    console.log('✓ Copied built CSS to theme directory')

    // Then copy entire theme directory to Sparktype
    await fs.cp(themeDir, SPARKTYPE_PATH, {
      recursive: true,
      filter: (src) => {
        // Exclude node_modules and any other dev files
        const shouldExclude = src.includes('node_modules') ||
                             src.includes('.git') ||
                             src.endsWith('.map')
        return !shouldExclude
      }
    })

    console.log('✅ Theme copied to Sparktype successfully!')
    console.log(`   ${SPARKTYPE_PATH}`)
  } catch (error) {
    console.error('❌ Error copying theme:', error.message)
    process.exit(1)
  }
}

copyTheme()
