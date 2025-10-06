import fs from 'fs/promises'
import path from 'path'

const SPARKTYPE_PATH = '../../../sparktype/public/themes/sparksite'

async function copyTheme() {
  const themeDir = './theme'

  try {
    console.log('📦 Copying theme to Sparktype...')

    // Copy entire theme directory
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
