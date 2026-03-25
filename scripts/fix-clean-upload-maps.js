const fs = require('fs');
const path = require('path');

const ROOT = path.join(process.cwd(), 'clean-upload');

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, out);
    } else {
      out.push(full);
    }
  }
  return out;
}

const files = walk(ROOT).filter((file) => {
  const ext = path.extname(file).toLowerCase();
  return ext === '.html' || ext === '.txt' || ext === '.js';
});

const replacements = [
  [
    /https:\/\/storage\.googleapis\.com\/maps-solutions-uqtp8x8eyn\/locator-plus\/o4px\/locator-plus\.html/g,
    'https://www.google.com/maps?q=34%20Kurye%2C%20Istanbul%2C%20Turkey&z=12&output=embed&hl=tr',
  ],
  [
    /https:\/\/storage\.googleapis\.com\/maps-solutions-uqtp8x8eyn\/address-selection\/isk1\/address-selection\.html/g,
    'https://www.google.com/maps?q=Kadikoy%20Istanbul&z=13&output=embed&hl=tr',
  ],
  [
    /https:\/\/storage\.googleapis\.com\/maps-solutions-uqtp8x8eyn\/commutes\/ed0t\/commutes\.html/g,
    'https://www.google.com/maps?q=Taksim%20Istanbul%20to%20Kadikoy%20Istanbul&output=embed&hl=tr',
  ],
  // API key literal in bundled JS, clear it so key-based mode is skipped.
  [/AIzaSyDZG0ecML50ADseq50_0OXvNW_G9OIL50U/g, ''],
  [
    /https:\/\/www\.google\.com\/maps\/embed\/v1\/place\?key=[^&"'<\\]*(?:&|&amp;|\\u0026)q=([^&"'<\\]+)(?:&|&amp;|\\u0026)zoom=([^&"'<\\]+)(?:&|&amp;|\\u0026)language=tr/g,
    'https://www.google.com/maps?q=$1&z=$2&output=embed&hl=tr',
  ],
  [
    /https:\/\/www\.google\.com\/maps\/embed\/v1\/directions\?key=[^&"'<\\]*(?:&|&amp;|\\u0026)origin=([^&"'<\\]+)(?:&|&amp;|\\u0026)destination=([^&"'<\\]+)(?:&|&amp;|\\u0026)mode=[^&"'<\\]+(?:&|&amp;|\\u0026)language=tr(?:&|&amp;|\\u0026)region=TR/g,
    'https://www.google.com/maps?q=$1%20to%20$2&output=embed&hl=tr',
  ],
];

let changedFiles = 0;

for (const file of files) {
  let buffer;
  try {
    buffer = fs.readFileSync(file);
  } catch {
    continue;
  }

  const encodings = ['utf8', 'utf16le'];
  let didUpdate = false;

  for (const encoding of encodings) {
    const original = buffer.toString(encoding);

    // Fast skip for files that clearly do not contain map-related strings.
    if (
      !original.includes('maps/embed/v1') &&
      !original.includes('maps-solutions-uqtp8x8eyn') &&
      !original.includes('AIzaSyDZG0ecML50ADseq50_0OXvNW_G9OIL50U')
    ) {
      continue;
    }

    let content = original;
    for (const [pattern, nextValue] of replacements) {
      content = content.replace(pattern, nextValue);
    }

    if (content !== original) {
      fs.writeFileSync(file, content, encoding);
      changedFiles += 1;
      didUpdate = true;
      break;
    }
  }

  if (didUpdate) {
    continue;
  }
}

console.log(`Changed files: ${changedFiles}`);
