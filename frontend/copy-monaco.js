import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, 'node_modules', 'monaco-editor', 'min', 'vs');
const destDir = path.join(__dirname, 'public', 'monaco-editor', 'vs');

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

try {
  if (fs.existsSync(srcDir)) {
    console.log(`Copying Monaco Editor assets from ${srcDir} to ${destDir}...`);
    copyDir(srcDir, destDir);
    console.log('Monaco Editor assets copied successfully!');
  } else {
    console.error(`Error: Source directory ${srcDir} does not exist.`);
  }
} catch (err) {
  console.error('Error copying Monaco Editor assets:', err);
  process.exit(1);
}
