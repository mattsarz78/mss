import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Generate SHA-256 hashes for inline scripts and styles
 * for Content-Security-Policy header
 */

function hashContent(content) {
  return crypto.createHash('sha256').update(content).digest('base64');
}

function extractInlineContent(html) {
  const styles = [];
  const scripts = [];

  // Extract inline styles
  const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/g;
  let match;
  while ((match = styleRegex.exec(html)) !== null) {
    const content = match[1].trim();
    if (content) {
      styles.push({ content, hash: `'sha256-${hashContent(content)}'` });
    }
  }

  // Extract inline scripts
  const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/g;
  while ((match = scriptRegex.exec(html)) !== null) {
    const content = match[1].trim();
    if (content) {
      scripts.push({ content, hash: `'sha256-${hashContent(content)}'` });
    }
  }

  return { styles, scripts };
}

// Read index.html
const indexPath = path.join(process.cwd(), 'index.html');
const html = fs.readFileSync(indexPath, 'utf-8');

const { styles, scripts } = extractInlineContent(html);

console.log('=== Inline Style Hashes ===');
styles.forEach((style, i) => {
  console.log(`\nStyle ${i + 1}:`);
  console.log(`Hash: ${style.hash}`);
  console.log(`Content preview: ${style.content.substring(0, 100)}...`);
});

console.log('\n=== Inline Script Hashes ===');
scripts.forEach((script, i) => {
  console.log(`\nScript ${i + 1}:`);
  console.log(`Hash: ${script.hash}`);
  console.log(`Content preview: ${script.content.substring(0, 100)}...`);
});

console.log('\n=== CSP Directives ===');
const styleHashes = styles.map((s) => s.hash).join(' ');
const scriptHashes = scripts.map((s) => s.hash).join(' ');

console.log(`\nAdd to script-src: ${scriptHashes}`);
console.log(`Add to style-src: ${styleHashes}`);

console.log('\n=== Updated CSP Example ===');
console.log(`script-src 'self' ${scriptHashes} 'strict-dynamic' *.twitter.com ...`);
console.log(`style-src 'self' ${styleHashes} *.mattsarzsports.com ...`);
