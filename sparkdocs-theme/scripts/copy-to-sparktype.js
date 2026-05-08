import { copyThemeBundle } from '../../scripts/theme-copy-utils.js'

async function copyTheme() {
  try {
    console.log('📦 Building theme bundle...')
    const context = await copyThemeBundle(import.meta.url)
    console.log('✓ Copied templates to dist')
    console.log('✓ CSS built by Vite in dist/styles.css')

    console.log('✅ Theme copied to Sparktype successfully!')
    console.log(`   ${context.targetDir}`)
  } catch (error) {
    console.error('❌ Error copying theme:', error.message)
    process.exit(1)
  }
}

copyTheme()
