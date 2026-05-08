import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

function getThemeRoot(importMetaUrl) {
  const scriptDir = path.dirname(fileURLToPath(importMetaUrl));
  return path.resolve(scriptDir, '..');
}

function getThemeId(themeRoot) {
  return path.basename(themeRoot).replace(/-theme$/, '');
}

export async function resolveThemeContext(importMetaUrl) {
  const themeRoot = getThemeRoot(importMetaUrl);
  const themeId = getThemeId(themeRoot);
  const sparktypeRoot = process.env.SPARKTYPE_ROOT
    ? path.resolve(process.env.SPARKTYPE_ROOT)
    : path.resolve(themeRoot, '..', '..', 'sparktype');
  const sparktypeThemesDir = path.join(sparktypeRoot, 'public', 'themes');

  try {
    await fs.access(sparktypeThemesDir);
  } catch {
    throw new Error(
      [
        `Could not find Sparktype themes directory at ${sparktypeThemesDir}.`,
        'Expected sparktype to be a sibling of sparktype-themes, or set SPARKTYPE_ROOT to override.',
      ].join(' ')
    );
  }

  return {
    themeRoot,
    themeId,
    srcDir: path.join(themeRoot, 'src'),
    distDir: path.join(themeRoot, 'dist'),
    sparktypeRoot,
    sparktypeThemesDir,
    targetDir: path.join(sparktypeThemesDir, themeId),
  };
}

export async function copyThemeBundle(importMetaUrl) {
  const context = await resolveThemeContext(importMetaUrl);

  await fs.cp(context.srcDir, context.distDir, {
    recursive: true,
    force: true,
    filter: (src) => {
      const relativePath = path.relative(context.themeRoot, src);
      return relativePath !== 'src/styles.css';
    },
  });

  await fs.cp(context.distDir, context.targetDir, {
    recursive: true,
    force: true,
  });

  return context;
}
