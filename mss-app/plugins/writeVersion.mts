import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { type Plugin } from 'vite';

export function versionJson(): Plugin {
  return {
    name: 'version-json',
    buildStart() {
      const version = getVersion();
      const outDir = resolve(__dirname, '../public');

      const versionData = { version, timestamp: Date.now(), environment: process.env.NODE_ENV || 'production' };

      const outPath = resolve(outDir, 'version.json');
      writeFileSync(outPath, JSON.stringify(versionData, null, 2));
      console.log(`✨ Version file written to ${outPath}`);
      console.log(`📦 Version: ${version}`);
    }
  };
}

function getVersion() {
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
