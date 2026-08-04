import fs from 'fs';
import path from 'path';

const pagesDir = path.join(process.cwd(), 'app', 'pages', 'admin');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace double clearNuxtData
  let changed = false;
  if (content.includes('clearNuxtData();\n    clearNuxtData();')) {
    content = content.replace(/clearNuxtData\(\);\s+clearNuxtData\(\);/g, 'clearNuxtData();');
    changed = true;
  }
  
  // Actually, because of different indentation, let's just use regex
  const doubleClearRegex = /clearNuxtData\(\);(\s+)clearNuxtData\(\);/g;
  if (doubleClearRegex.test(content)) {
    content = content.replace(doubleClearRegex, 'clearNuxtData();$1');
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Cleaned up:', filePath);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.vue')) {
      processFile(fullPath);
    }
  }
}

walkDir(pagesDir);
console.log('Done cleaning up');
