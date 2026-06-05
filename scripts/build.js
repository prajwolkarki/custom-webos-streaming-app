const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'src');
const DIST = path.join(__dirname, '..', 'dist');

const JS_FILES = [
  'config/config.js',
  'utils/constants.js',
  'utils/helpers.js',
  'utils/storage.js',
  'utils/urlBuilder.js',
  'api/request.js',
  'api/vidsrcApi.js',
  'navigation/keyHandler.js',
  'navigation/focusManager.js',
  'navigation/spatialNavigation.js',
  'app.js',
];

const CSS_FILES = [
  'styles/variables.css',
  'styles/global.css',
  'styles/focus.css',
  'styles/tv-optimizations.css',
];

if (!fs.existsSync(DIST)) {
  fs.mkdirSync(DIST, { recursive: true });
}

const bundle = JS_FILES.map(f => {
  const content = fs.readFileSync(path.join(SRC, f), 'utf-8');
  return `/* ${f} */\n${content}`;
}).join('\n\n');

fs.writeFileSync(path.join(DIST, 'bundle.js'), bundle);

const cssBundle = CSS_FILES.map(f => {
  const content = fs.readFileSync(path.join(SRC, f), 'utf-8');
  return `/* ${f} */\n${content}`;
}).join('\n\n');

fs.writeFileSync(path.join(DIST, 'bundle.css'), cssBundle);

fs.copyFileSync(
  path.join(__dirname, '..', 'index.html'),
  path.join(DIST, 'index.html')
);

let html = fs.readFileSync(path.join(DIST, 'index.html'), 'utf-8');
html = html.replace(
  /<link rel="stylesheet" href="src\/styles\/variables\.css">[\s\S]*?<link rel="stylesheet" href="src\/styles\/tv-optimizations\.css">/,
  `<link rel="stylesheet" href="bundle.css">`
);
html = html.replace(
  /<script src="src\/config\/config\.js"><\/script>[\s\S]*?<script src="src\/app\.js"><\/script>/,
  `<script src="bundle.js"></script>`
);
fs.writeFileSync(path.join(DIST, 'index.html'), html);

// Copy webOS package manifest
fs.copyFileSync(path.join(__dirname, '..', 'appinfo.json'), path.join(DIST, 'appinfo.json'));

// Copy assets
const assetsDir = path.join(__dirname, '..', 'assets');
const distAssets = path.join(DIST, 'assets');
if (fs.existsSync(assetsDir)) {
  copyRecursiveSync(assetsDir, distAssets);
}

// Copy services
const servicesDir = path.join(__dirname, '..', 'services');
const distServices = path.join(DIST, 'services');
if (fs.existsSync(servicesDir)) {
  copyRecursiveSync(servicesDir, distServices);
}

console.log('Build complete: dist/ ready for packaging');

function copyRecursiveSync(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyRecursiveSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
