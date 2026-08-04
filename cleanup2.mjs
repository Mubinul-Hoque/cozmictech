import fs from 'fs';
import path from 'path';

const pagesDir = path.join(process.cwd(), 'app', 'pages', 'admin');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  const regex = /clearNuxtData\(\);\s+useToast\(\)\.success\((.*?)\);\s+clearNuxtData\(\);/g;
  if (regex.test(content)) {
    content = content.replace(regex, "clearNuxtData();\n    useToast().success($1);");
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
