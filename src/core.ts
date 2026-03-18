import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { minify as terserMinify } from "terser";
import path from "path";
import chalk from 'chalk';
import ora from 'ora';
import type { VendorEntry, VendropOptions } from './types.js';

/**
 * Core function to process vendor files.
 */
export async function runVendrop(
  entries: VendorEntry[],
  options: VendropOptions = {}
): Promise<void> {
  const rootDir = options.rootDir || process.cwd();
  const globalMinify = options.minify ?? true;

  console.log(chalk.cyan('\n  🚀 Vendrop: Processing vendors...\n'));

  for (const entry of entries) {
    const spinner = ora({ text: `Processing: ${entry.src}`, color: 'cyan' }).start();

    try {
      // 1. Resolve source path
      let srcPath = path.isAbsolute(entry.src) ? entry.src : path.join(rootDir, entry.src);

      // 2. Try resolving from node_modules if not found directly
      if (!existsSync(srcPath)) {
        const nodeModulesPath = path.join(rootDir, 'node_modules', entry.src);
        if (existsSync(nodeModulesPath)) {
          srcPath = nodeModulesPath;
        } else {
          spinner.fail(chalk.red(`Could not find: ${entry.src}`));
          continue;
        }
      }

      // 3. Output path resolution
      const outPath = path.isAbsolute(entry.out) ? entry.out : path.join(rootDir, entry.out);
      const outDir = path.dirname(outPath);

      // 4. Read source
      const code = readFileSync(srcPath, "utf-8");

      // 5. Minify if enabled
      const shouldMinify = entry.minify ?? globalMinify;
      let finalCode = code;

      if (shouldMinify && (entry.src.endsWith('.js') || entry.src.endsWith('.mjs'))) {
        const result = await terserMinify(code, { compress: true, mangle: true });
        if (result.code) finalCode = result.code;
      }

      // 6. Deploy
      mkdirSync(outDir, { recursive: true });
      writeFileSync(outPath, finalCode);

      spinner.succeed(chalk.green(`Deployed to: ${entry.out}`));
    } catch (error: any) {
      spinner.fail(chalk.red(`Failed ${entry.src}: ${error.message}`));
    }
  }

  console.log(chalk.cyan('\n  ✦ Vendors deployed. Ready for liftoff.\n'));
}
