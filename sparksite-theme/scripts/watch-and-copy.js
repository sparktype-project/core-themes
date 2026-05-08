import chokidar from 'chokidar';
import { spawn } from 'child_process';
import { copyThemeBundle, resolveThemeContext } from '../../scripts/theme-copy-utils.js';

const context = await resolveThemeContext(import.meta.url);

let copying = false;
let pendingCopy = false;

async function triggerCopy() {
  if (copying) {
    pendingCopy = true;
    return;
  }

  copying = true;
  pendingCopy = false;

  try {
    console.log('📦 Copying theme to Sparktype...');
    const result = await copyThemeBundle(import.meta.url);
    console.log(`✅ Theme copied to ${result.targetDir}`);
  } catch (error) {
    console.error('❌ Error copying theme:', error.message);
  } finally {
    copying = false;
    if (pendingCopy) {
      triggerCopy();
    }
  }
}

console.log(`🚀 Starting Vite build watch in ${context.themeRoot}...`);
const vite = spawn('npx', ['vite', 'build', '--watch'], {
  cwd: context.themeRoot,
  stdio: 'pipe',
  shell: true,
});

vite.stdout.on('data', (data) => {
  const output = data.toString();
  process.stdout.write(output);

  if (output.includes('built in')) {
    triggerCopy();
  }
});

vite.stderr.on('data', (data) => {
  process.stderr.write(data);
});

vite.on('error', (error) => {
  console.error('Failed to start Vite:', error);
  process.exit(1);
});

console.log('👀 Watching source templates for non-CSS changes...');
const watcher = chokidar.watch('src/**/*', {
  cwd: context.themeRoot,
  ignored: ['**/node_modules/**', '**/.git/**', '**/*.map', '**/styles.css'],
  ignoreInitial: true,
  awaitWriteFinish: {
    stabilityThreshold: 100,
    pollInterval: 50,
  },
});

watcher
  .on('change', (filePath) => {
    console.log(`\n🔄 Changed: ${filePath}`);
    triggerCopy();
  })
  .on('add', (filePath) => {
    console.log(`\n➕ Added: ${filePath}`);
    triggerCopy();
  })
  .on('unlink', (filePath) => {
    console.log(`\n➖ Removed: ${filePath}`);
    triggerCopy();
  })
  .on('error', (error) => {
    console.error('Watcher error:', error);
  });

process.on('SIGINT', async () => {
  console.log('\n\n👋 Stopping...');
  vite.kill();
  await watcher.close();
  process.exit(0);
});
