# Vendrop 🚀

**Vendrop** is a powerful and flexible tool designed to automate the process of copying and minifying vendor assets (like JavaScript dependencies) from `node_modules` or local folders to your public distribution folder.

It works seamlessly as a **CLI**, a **Vite Plugin**, or an **Astro Integration**.

## ✨ Features

- 📦 **Automated Copying**: Easily move files from `node_modules` to your public folder.
- ⚡ **On-the-fly Minification**: Uses [Terser](https://terser.org/) to minify JavaScript files automatically.
- 🧩 **Multi-environment**: Built-in support for Vite and Astro.
- 🛠️ **Config-driven**: Use a simple `vendrop.config.mjs` for all your projects.
- 🔍 **Smart Resolution**: Automatically looks into `node_modules` if a local file is not found.

---

## 🚀 Installation

```bash
# Using npm
npm install -D vendrop

# Using pnpm
pnpm add -D vendrop

# Using yarn
yarn add -D vendrop
```

---

## 🛠️ Usage

### 1. Unified Configuration (`vendrop.config.mjs`)

Create a `vendrop.config.mjs` file in your project root to share settings across CLI, Vite, and Astro.

```javascript
/** @type {import('vendrop').VendropConfig} */
export default [
  {
    // Resolves automatically from node_modules/jquery/dist/jquery.js
    src: 'jquery/dist/jquery.js', 
    out: 'public/vendors/jquery.min.js'
  },
  {
    src: 'bootstrap/dist/js/bootstrap.bundle.js',
    out: 'public/vendors/bootstrap.min.js'
  },
  {
    src: 'src/scripts/local-utils.js',
    out: 'public/vendors/utils.min.js',
    minify: false // Disable minification for this specific entry
  }
];
```

### 2. Use as CLI

If you have a `vendrop.config.mjs`, just run:
```bash
npx vendrop
```

Or use flags for one-off tasks:
```bash
npx vendrop --src jquery/dist/jquery.js --out public/vendors/jquery.min.js
```

### 3. Use with Vite

Add it to your `vite.config.js`:

```javascript
import { defineConfig } from 'vite';
import { viteVendrop } from 'vendrop';
import config from './vendrop.config.mjs';

export default defineConfig({
  plugins: [
    viteVendrop(config)
  ]
});
```

### 4. Use with Astro

Add it as an integration in `astro.config.mjs`:

```javascript
import { defineConfig } from 'astro/config';
import { astroVendrop } from 'vendrop';
import config from './vendrop.config.mjs';

export default defineConfig({
  integrations: [
    astroVendrop(config)
  ]
});
```

### 5. Use as Standalone (Node.js)

```javascript
import { vendrop } from 'vendrop';

await vendrop([
  { src: 'jquery/dist/jquery.js', out: 'public/vendors/jquery.min.js' }
]);
```

---

## ⚙️ Configuration Options

### `VendorEntry`
| Property | Type | Description |
| :--- | :--- | :--- |
| `src` | `string` | Source path (relative to root or in `node_modules`). |
| `out` | `string` | Destination path (relative to your project root). |
| `minify` | `boolean` | (Optional) Override global minification for this file. |

### `VendropOptions`
| Property | Type | Description |
| :--- | :--- | :--- |
| `minify` | `boolean` | Global minification toggle. Defaults to `true`. |
| `rootDir` | `string` | Base directory for path resolution. Defaults to `process.cwd()`. |

---

## 📄 License

MIT © [J.P. Esparza](https://github.com/fames)
