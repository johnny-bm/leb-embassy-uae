const fs = require('fs');
const path = require('path');

const headerEn = fs.readFileSync('partials/header.html', 'utf8');
const footerEn = fs.readFileSync('partials/footer.html', 'utf8');
const headerAr = fs.readFileSync('partials/header-ar.html', 'utf8');
const footerAr = fs.readFileSync('partials/footer-ar.html', 'utf8');

const enFiles = [
  'index.html', 'embassy.html', 'contact.html',
  'news.html', 'services.html', 'service-passports.html', 'service-visa.html',
  'service-civil-status.html', 'service-poa.html', 'service-certificates.html',
  'service-palestinian-travel.html', '_downloads.html'
];

const businessFiles = [
  'business/index.html', 'business/bilateral-trade.html',
  'business/embassy-services.html', 'business/investor-resources.html',
  'business/useful-links.html'
];

const arFiles = [
  'ar/index.html', 'ar/embassy.html', 'ar/contact.html',
  'ar/business.html', 'ar/news.html', 'ar/services.html'
];

function inject(content, header, footer, root) {
  return content
    .replace('<!--HEADER-->', header.replaceAll('{{ROOT}}', root))
    .replace('<!--FOOTER-->', footer.replaceAll('{{ROOT}}', root));
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function copyDir(src, dest) {
  ensureDir(dest);
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(srcPath, destPath);
    else fs.copyFileSync(srcPath, destPath);
  }
}

ensureDir('dist');
ensureDir('dist/ar');
ensureDir('dist/business');

for (const file of enFiles) {
  if (!fs.existsSync(file)) continue;
  const out = inject(fs.readFileSync(file, 'utf8'), headerEn, footerEn, '');
  fs.writeFileSync(path.join('dist', file), out);
}

for (const file of businessFiles) {
  if (!fs.existsSync(file)) continue;
  const out = inject(fs.readFileSync(file, 'utf8'), headerEn, footerEn, '../');
  fs.writeFileSync(path.join('dist', file), out);
}

fs.copyFileSync('business.html', path.join('dist', 'business.html'));

for (const file of arFiles) {
  if (!fs.existsSync(file)) continue;
  const out = inject(fs.readFileSync(file, 'utf8'), headerAr, footerAr, '../');
  fs.writeFileSync(path.join('dist', file), out);
}

copyDir('images', 'dist/images');
copyDir('styles', 'dist/styles');

console.log('Build complete → dist/');
