#!/usr/bin/env node
/**
 * Copy all .webp files from dist/images to public/images
 * Usage: pnpm copy-webp
 *
 * This is useful for:
 * - Pre-generating WebP variants in public/ for development
 * - Keeping public/images in sync with built WebP versions
 * - Testing WebP variants before deployment
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

const distImagesDir = path.join(projectRoot, 'dist', 'images');
const publicImagesDir = path.join(projectRoot, 'public', 'images');

async function copyWebpFiles() {
  try {
    // Check if dist/images exists
    try {
      await fs.access(distImagesDir);
    } catch {
      console.warn(`⚠️  dist/images not found. Have you run 'pnpm build' yet?`);
      console.log(`📝 Run 'pnpm build' first to generate WebP files.`);
      process.exit(1);
    }

    // Create public/images if it doesn't exist
    try {
      await fs.mkdir(publicImagesDir, { recursive: true });
    } catch (error) {
      console.error(`❌ Failed to create public/images:`, error instanceof Error ? error.message : error);
      process.exit(1);
    }

    // Read all files in dist/images
    const files = await fs.readdir(distImagesDir);
    const webpFiles = files.filter((file) => file.endsWith('.webp'));

    if (webpFiles.length === 0) {
      console.log(`ℹ️  No .webp files found in dist/images`);
      process.exit(0);
    }

    console.log(`\n📋 Copying ${webpFiles.length} .webp file(s) from dist/images to public/images...`);

    let copied = 0;
    let skipped = 0;

    for (const file of webpFiles) {
      const srcPath = path.join(distImagesDir, file);
      const destPath = path.join(publicImagesDir, file);

      try {
        await fs.copyFile(srcPath, destPath);
        copied++;
      } catch (error) {
        console.warn(`⚠️  Failed to copy ${file}:`, error instanceof Error ? error.message : error);
        skipped++;
      }
    }

    console.log(`✓ Copied ${copied} file(s)`);
    if (skipped > 0) {
      console.log(`⚠️  Skipped ${skipped} file(s)`);
    }
    console.log(`\n🎉 Done! WebP files are now available in public/images\n`);
  } catch (error) {
    console.error(`❌ Error:`, error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

copyWebpFiles();
