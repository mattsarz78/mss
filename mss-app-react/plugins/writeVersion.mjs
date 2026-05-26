import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function versionJson() {
  return {
    name: 'version-json',
    writeBundle() {
      // This plugin updates version.json in the public directory
      // during the build process
    },
  };
}
