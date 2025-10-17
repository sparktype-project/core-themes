import chokidar from 'chokidar'
import { spawn } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..')
const SPARKTYPE_PATH = '/Users/matt/Sites/sparktype/public/themes/sparksite'

let copying = false
let pendingCopy = false

async function copyTheme() {
  if (copying) {
    pendingCopy = true
    return
  }

  copying = true
  pendingCopy = false

  const { default: fs } = await import('fs/promises')

  try {
    console.log('📦 Copying theme to Sparktype...')

    await fs.cp(path.join(rootDir, 'theme'), SPARKTYPE_PATH, {
      recursive: true,
      filter: (src) => {
        const shouldExclude = src.includes('node_modules') ||
                             src.includes('.git') ||
                             src.endsWith('.map')
        return !shouldExclude
      }
    })

    console.log('✅ Theme copied!')
  } catch (error) {
    console.error('❌ Error copying theme:', error.message)
  } finally {
    copying = false
    if (pendingCopy) {
      copyTheme()
    }
  }
}

// Start Vite in watch mode
console.log('🚀 Starting Vite build watch...')
const vite = spawn('npx', ['vite', 'build', '--watch'], {
  cwd: rootDir,
  stdio: 'pipe',
  shell: true
})

let buildCount = 0
vite.stdout.on('data', (data) => {
  const output = data.toString()
  process.stdout.write(output)

  // Only copy when build completes (not on start)
  if (output.includes('built in') && buildCount > 0) {
    copyTheme()
  }
  if (output.includes('built in')) {
    buildCount++
  }
})

vite.stderr.on('data', (data) => {
  process.stderr.write(data)
})

vite.on('error', (error) => {
  console.error('Failed to start Vite:', error)
  process.exit(1)
})

// Watch for changes in theme directory (excluding styles.css which Vite handles)
console.log('👀 Watching for theme changes...')
const watcher = chokidar.watch('theme/**/*', {
  cwd: rootDir,
  ignored: ['**/node_modules/**', '**/.git/**', '**/*.map', '**/styles.css'],
  ignoreInitial: true,
  awaitWriteFinish: {
    stabilityThreshold: 100,
    pollInterval: 50
  }
})

watcher
  .on('change', (filePath) => {
    console.log(`\n🔄 Changed: ${filePath}`)
    copyTheme()
  })
  .on('add', (filePath) => {
    console.log(`\n➕ Added: ${filePath}`)
    copyTheme()
  })
  .on('error', (error) => {
    console.error('Watcher error:', error)
  })

// Handle cleanup
process.on('SIGINT', () => {
  console.log('\n\n👋 Stopping...')
  vite.kill()
  watcher.close()
  process.exit(0)
})
