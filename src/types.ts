export interface VendorEntry {
  /** Source path (relative to root or in node_modules) */
  src: string;
  /** Output path (relative to public folder) */
  out: string;
  /** Optional override for minification */
  minify?: boolean;
}

export interface VendropOptions {
  /** Global minify setting, defaults to true */
  minify?: boolean;
  /** Root directory for resolving files, defaults to process.cwd() */
  rootDir?: string;
}

export type VendropConfig = VendorEntry[];
