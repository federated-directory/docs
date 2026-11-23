/**
 * Generate sitemap.xml for the documentation site
 * This script runs after the VitePress build to create a sitemap of all pages
 */

import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream, readdirSync, readFileSync, statSync } from 'fs';
import { join, extname, resolve, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SITE_URL = 'https://docs.federated.directory';
const OUTPUT_DIR = resolve(__dirname, '../docs/.vitepress/dist');
const SITEMAP_PATH = join(OUTPUT_DIR, 'sitemap.xml');

// Get all HTML files from the build directory
function getHtmlFiles(dir, fileList = []) {
  const files = readdirSync(dir);
  
  files.forEach(file => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    
    if (stat.isDirectory()) {
      getHtmlFiles(filePath, fileList);
    } else if (extname(file) === '.html') {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Convert file path to URL
function filePathToUrl(filePath) {
  // Get relative path from OUTPUT_DIR
  let relativePath = relative(OUTPUT_DIR, filePath)
    .replace(/\\/g, '/')
    .replace(/\.html$/, '');
  
  // Handle index files (should map to directory URL)
  if (relativePath.endsWith('/index') || relativePath === 'index') {
    relativePath = relativePath.replace(/\/index$/, '').replace(/^index$/, '');
  }
  
  // Ensure path starts with /
  if (relativePath && !relativePath.startsWith('/')) {
    relativePath = '/' + relativePath;
  }
  
  // Root should be just /
  return relativePath || '/';
}

// Generate the sitemap
async function generateSitemap() {
  console.log('Generating sitemap...');
  
  const htmlFiles = getHtmlFiles(OUTPUT_DIR);
  const stream = new SitemapStream({ hostname: SITE_URL });
  const writeStream = createWriteStream(SITEMAP_PATH);
  
  stream.pipe(writeStream);
  
  // Add all pages to sitemap
  htmlFiles.forEach(filePath => {
    const url = filePathToUrl(filePath);
    const urlLower = url.toLowerCase();

    // Skip redirect stubs for pages that have moved (see docs/public/*.html)
    if (readFileSync(filePath, 'utf8').includes('<!-- redirect-stub -->')) {
      return;
    }
    
    // Skip unwanted pages
    if (urlLower === '/404' || urlLower === '/readme' || urlLower.includes('/404') || urlLower.includes('/readme')) {
      return;
    }
    
    // Determine priority and change frequency based on URL
    let priority = 0.5;
    let changefreq = 'weekly';
    
    if (url === '/' || url === '/index') {
      priority = 1.0;
      changefreq = 'daily';
    } else if (url.startsWith('/getting-started') || url === '/developer/api-reference') {
      priority = 0.9;
      changefreq = 'daily';
    } else if (url.startsWith('/developer')) {
      priority = 0.8;
      changefreq = 'weekly';
    } else if (url.startsWith('/administrator')) {
      priority = 0.7;
      changefreq = 'weekly';
    }
    
    stream.write({
      url: url || '/',
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
    });
  });
  
  stream.end();
  
  await streamToPromise(stream);
  console.log(`✓ Sitemap generated at ${SITEMAP_PATH}`);
  console.log(`  Total pages: ${htmlFiles.length}`);
}

generateSitemap().catch(err => {
  console.error('Error generating sitemap:', err);
  process.exit(1);
});
