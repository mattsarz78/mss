/**
 * @type {import('vite').Plugin}
 */
export function versionJson() {
  return {
    name: 'version-json',
    writeBundle() {
      // This plugin updates version.json in the public directory
      // during the build process
    },
  };
}
