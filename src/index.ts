import { runVendrop } from './core.js';
import type { VendorEntry, VendropOptions } from './types.js';

export * from './types.js';
export { runVendrop, runVendrop as vendrop } from './core.js';

/**
 * Vite Plugin for Vendrop.
 * Returns a plain object to avoid type conflicts between different Vite versions.
 */
export function viteVendrop(
  entries: VendorEntry[],
  options: VendropOptions = {}
): any {
  return {
    name: 'vite-plugin-vendrop',
    async buildStart() {
      await runVendrop(entries, options);
    },
    async configureServer() {
      await runVendrop(entries, options);
    }
  };
}

/**
 * Astro Integration for Vendrop.
 */
export function astroVendrop(
  entries: VendorEntry[],
  options: VendropOptions = {}
) {
  return {
    name: 'astro-vendrop',
    hooks: {
      'astro:config:setup': ({ updateConfig }: any) => {
        updateConfig({
          vite: {
            plugins: [viteVendrop(entries, options)]
          }
        });
      }
    }
  };
}
