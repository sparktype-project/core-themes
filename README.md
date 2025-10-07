# Sparktype Theme Development

This repository contains the development projects for Sparktype themes built with Tailwind CSS 4 and Vite.

## Structure

```
sparktype-themes/
├── sparksite-theme/     # Development project for sparksite theme
└── sparkdocs-theme/     # Development project for sparkdocs theme
```

Each theme project has this clean structure:
```
sparksite-theme/
├── src/                 # Source (git tracked) - matches built theme layout
│   ├── styles.css       # Tailwind source
│   ├── base.hbs
│   ├── theme.json
│   ├── layouts/
│   └── partials/
└── dist/                # Built bundle (gitignored)
    ├── styles.css       # Built by Vite
    ├── base.hbs         # Copied from src
    ├── theme.json       # Copied from src
    ├── layouts/         # Copied from src
    └── partials/        # Copied from src
```

## Development Workflow

### Initial Setup

```bash
cd sparksite-theme  # or sparkdocs-theme
npm install
```

### Development (Watch Mode)

**Option 1: Vite watch (CSS only)**
```bash
npm run dev
```
Watches `src/styles.css` and `src/theme/**/*.hbs`, rebuilds CSS to `dist/styles.css`

**Option 2: Full watch (CSS + auto-copy)**
```bash
npm run watch
```
Watches entire `src/` folder, rebuilds CSS and copies everything to Sparktype on any change

### Manual Build & Copy

```bash
# Build CSS only
npm run build

# Build and copy to Sparktype
npm run build:copy

# Copy only (without rebuilding)
npm run copy
```

## How It Works

1. **Source**: `src/` contains theme exactly as it will be built
   - `src/styles.css` - Tailwind source (replaced by built version)
   - `src/*.hbs`, `src/*.json` - Template files (copied as-is)

2. **Build**: Vite scans `src/**/*.hbs` for Tailwind classes, builds `dist/styles.css`

3. **Bundle**: Copy script copies `src/*` to `dist/` (except styles.css which is built), then to Sparktype

## Important Notes

- **Edit `src/` only**: The `dist/` directory is completely generated
- **Vite watches `src/`**: No infinite loops - Vite never watches its own output
- **Simple git tracking**: Only `src/`, `scripts/`, and `package.json` are tracked
- **Each theme is independent**: Separate dependencies and builds

## Tailwind 4 Features

### Custom Tokens
Define in `src/styles.css`:
```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";

@theme {
  --color-primary: #0d6efd;
  --color-background: #f8f9fa;
  --font-sans: Inter, system-ui, sans-serif;
}
```

### Using in Templates
Edit `src/**/*.hbs`:
```html
<div class="bg-[--color-primary] font-sans p-6 rounded-lg shadow-md">
  Content
</div>
```

Or use standard Tailwind utilities:
```html
<div class="flex gap-4 items-center justify-between">
  <h1 class="text-3xl font-bold">Title</h1>
  <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
    Click me
  </button>
</div>
```

## Git Workflow

**What's tracked:**
- `src/` - All source files (CSS + templates)
- `scripts/` - Build scripts
- `package.json` - Dependencies
- `vite.config.js` - Build configuration

**What's ignored:**
- `dist/` - Complete generated bundle
- `node_modules/` - Dependencies
