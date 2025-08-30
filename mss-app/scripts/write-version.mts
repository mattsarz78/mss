import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function getVersion() {
  try {
    // Try to get Git commit hash first
    const sha = execSync('git rev-parse --short HEAD', {
      cwd: resolve(__dirname, '..'),
      stdio: ['ignore', 'pipe', 'ignore']
    })
      .toString()
      .trim();
    return sha;
  } catch {
    // Fallback to package.json version or timestamp
    try {
      const pkg = JSON.parse(readFileSync(resolve(__dirname, '../package.json'), 'utf8'));
      return pkg.version || Date.now().toString();
    } catch {
      return Date.now().toString();
    }
  }
}

(async () => {
  const version = await getVersion();
  const outDir = resolve(__dirname, '../dist');

  // Ensure dist directory exists
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }

  const versionData = { version, timestamp: Date.now(), environment: process.env.NODE_ENV || 'production' };

  const outPath = resolve(outDir, 'version.json');
  writeFileSync(outPath, JSON.stringify(versionData, null, 2));
  console.log(`✨ Version file written to ${outPath}`);
  console.log(`📦 Version: ${version}`);
})().catch((error) => {
  console.error('Failed to write version file:', error);
  process.exit(1);
});
