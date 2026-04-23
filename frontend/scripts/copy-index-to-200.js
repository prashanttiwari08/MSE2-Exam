import fs from 'fs';
import path from 'path';

const dist = path.resolve('dist');
const src = path.join(dist, 'index.html');
const dest = path.join(dist, '200.html');

try {
  fs.copyFileSync(src, dest);
  console.log('Copied index.html to 200.html');
} catch (err) {
  console.error('Failed to copy index.html to 200.html:', err);
  process.exit(1);
}
