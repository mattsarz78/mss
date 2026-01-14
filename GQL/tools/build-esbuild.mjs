import { build } from 'esbuild';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
const deps = Object.keys(pkg.dependencies || {});

// Externalize common native/prisma bits and all dependencies to keep node_modules in prod image
const external = [
  '@prisma/client',
  '@prisma/engines',
  '@prisma/debug',
  '@prisma/get-platform',
  // mark all dependencies as external so we don't bundle node_modules into the output
  ...deps
];

const entry = path.resolve('./index.mts');
const outdir = path.resolve('./dist');

try {
  await build({
    entryPoints: [entry],
    bundle: true,
    platform: 'node',
    format: 'esm',
    target: ['node24'],
    outfile: path.join(outdir, 'index.js'),
    sourcemap: false,
    external,
    logLevel: 'info',
    // Keep path imports as-is for JSON files and generated .mjs imports
    loader: { '.ts': 'ts', '.mts': 'ts', '.js': 'js', '.mjs': 'js', '.json': 'json' }
  });
  globalThis.console.log('esbuild: bundle complete ->', path.join(outdir, 'index.js'));
} catch (err) {
  globalThis.console.error(err);
  globalThis.process?.exit?.(1);
}
