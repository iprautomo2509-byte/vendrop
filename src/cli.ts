#!/usr/bin/env node
import { runVendrop } from './core.js';
import path from 'path';
import { existsSync } from 'fs';
import chalk from 'chalk';

async function main() {
  const args = process.argv.slice(2);
  const rootDir = process.cwd();

  // 1. Try to load config file if no args or if requested
  const configPath = path.join(rootDir, 'vendrop.config.mjs');
  const hasConfig = existsSync(configPath);

  if (hasConfig && args.length === 0) {
    try {
      const { default: config } = await import(`file://${configPath}`);
      if (Array.isArray(config)) {
        await runVendrop(config);
        return;
      }
    } catch (err: any) {
      console.error(chalk.red(`Error loading config: ${err.message}`));
      process.exit(1);
    }
  }

  // 2. Handle CLI arguments
  const src = args[args.indexOf('--src') + 1];
  const out = args[args.indexOf('--out') + 1];

  if (src && out) {
    await runVendrop([{ src, out }]);
    return;
  }

  // 3. Show Help
  console.log(chalk.yellow(`
  Usage:
    vendrop --src <input> --out <output>
    
    Or create a vendrop.config.mjs:
    export default [
      { src: 'jquery/dist/jquery.js', out: 'public/vendors/jquery.min.js' }
    ]
  `));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
