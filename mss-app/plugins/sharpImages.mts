import { promises as fs } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import type { Plugin, ResolvedConfig } from 'vite';

/**
 * Custom Vite plugin to optimize images using Sharp during build.
 * Converts PNG/JPG to WebP and optimizes for web delivery.
 *
 * Usage: Add to vite.config.ts plugins array
 * Runs only during production builds.
 */
export function sharpImagesPlugin(): Plugin {
  let config: ResolvedConfig;

  return {
    name: 'sharp-images',
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    apply: 'build',
    async closeBundle() {
      // Only run in production build
      if (config.command !== 'build') return;

      const distDir = 'dist';

      try {
        // Find all images in dist directory
        const imageExtensions = ['png', 'jpg', 'jpeg', 'gif'];
        const images = await globFiles(distDir, imageExtensions);

        if (images.length === 0) {
          console.log('✓ No images found to optimize');
          return;
        }

        console.log(`\n⚙️  Optimizing ${images.length} image(s) with Sharp...`);

        let optimized = 0;
        let webpGenerated = 0;

        for (const file of images) {
          const ext = path.extname(file).toLowerCase();
          const baseName = file.slice(0, -ext.length);

          try {
            // Read file into memory, process, and write back
            const buffer = await fs.readFile(file);
            let optimizedBuffer;

            if (ext === '.png') {
              optimizedBuffer = await sharp(buffer).png({ quality: 80, progressive: true }).toBuffer();
            } else if (['.jpg', '.jpeg'].includes(ext)) {
              optimizedBuffer = await sharp(buffer).jpeg({ quality: 80, progressive: true }).toBuffer();
            } else {
              continue; // Skip other formats
            }

            // Write optimized version back
            await fs.writeFile(file, optimizedBuffer);
            optimized++;

            // Generate WebP version
            const webpPath = `${baseName}.webp`;
            const webpBuffer = await sharp(buffer).webp({ quality: 75 }).toBuffer();
            await fs.writeFile(webpPath, webpBuffer);
            webpGenerated++;
          } catch (error) {
            console.warn(`⚠️  Failed to optimize ${file}:`, error instanceof Error ? error.message : error);
          }
        }

        console.log(`✓ Optimized ${optimized} image(s)`);
        console.log(`✓ Generated ${webpGenerated} WebP variant(s)`);
      } catch (error) {
        console.warn('⚠️  Sharp image optimization failed:', error instanceof Error ? error.message : error);
      }
    }
  };
}

/**
 * Helper: Recursively find image files in a directory
 */
async function globFiles(dir: string, extensions: string[]): Promise<string[]> {
  const files: string[] = [];

  async function walk(currentPath: string) {
    try {
      const entries = await fs.readdir(currentPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name);

        if (entry.isDirectory()) {
          await walk(fullPath);
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase();
          if (extensions.includes(ext.slice(1))) {
            files.push(fullPath);
          }
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error: Error | unknown) {
      // Silently skip inaccessible directories
    }
  }

  await walk(dir);
  return files;
}
