
const fs = require('node:fs');
const path = require('node:path');

const DOCS_DIR = path.join(__dirname, '../docs');

// Regex to find Markdown links: [text](url) and <url>
// We only care about http/https links
const LINK_REGEX = /\[.*?\]\((https?:\/\/[^\s\)]+)\)|<(https?:\/\/[^>]+)>/g;

async function getAllFiles(dir) {
  const files = fs.readdirSync(dir, { recursive: true });
  return files
    .filter(f => f.endsWith('.md'))
    .map(f => path.join(dir, f));
}

async function checkUrl(url) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      headers: {
        // Some sites (e.g. Microsoft AppSource/Marketplace) return 403 for
        // non-browser User-Agents, so we impersonate a common browser here.
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    clearTimeout(timeoutId);

    if (response.ok) return { url, status: response.status, ok: true };
    
    // Some servers reject HEAD, try GET
    if (response.status === 405 || response.status === 403 || response.status === 404) {
       const controller2 = new AbortController();
       const timeoutId2 = setTimeout(() => controller2.abort(), 8000);
       const response2 = await fetch(url, {
         method: 'GET',
         signal: controller2.signal,
         headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
       });
       clearTimeout(timeoutId2);
       if (response2.ok) return { url, status: response2.status, ok: true };
       return { url, status: response2.status, ok: false };
    }

    return { url, status: response.status, ok: false };
  } catch (error) {
    return { url, error: error.message, ok: false };
  }
}

async function run() {
  console.log('Scanning for external links in docs/...');
  const files = await getAllFiles(DOCS_DIR);
  const links = new Set();
  const linkSources = {}; // map url -> [files]

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    let match;
    while ((match = LINK_REGEX.exec(content)) !== null) {
      const url = match[1] || match[2];
      if (url) {
        links.add(url);
        if (!linkSources[url]) linkSources[url] = [];
        linkSources[url].push(path.relative(DOCS_DIR, file));
      }
    }
  }

  console.log(`Found ${links.size} unique external links.`);
  console.log('Verifying links...');

  const results = [];
  const limit = 5;
  const urls = Array.from(links);
  
  for (let i = 0; i < urls.length; i += limit) {
    const batch = urls.slice(i, i + limit);
    const batchResults = await Promise.all(batch.map(checkUrl));
    results.push(...batchResults);
    process.stdout.write(`\rChecked ${results.length}/${urls.length}`);
  }
  console.log('\n');

  const broken = results.filter(r => !r.ok);

  if (broken.length === 0) {
    console.log('✅ All external links are valid!');
  } else {
    console.error(`❌ Found ${broken.length} broken links:\n`);
    for (const b of broken) {
      console.error(`- URL: ${b.url}`);
      console.error(`  Status/Error: ${b.status || b.error}`);
      console.error(`  Found in: ${linkSources[b.url].join(', ')}`);
      console.error('');
    }
    process.exit(1);
  }
}

run().catch(console.error);
