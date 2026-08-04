import fs from 'fs';
import path from 'path';

const pagesDir = path.join(process.cwd(), 'app', 'pages');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Replace <img with <NuxtImg
  if (content.includes('<img ')) {
    content = content.replace(/<img /g, '<NuxtImg ');
    changed = true;
  }
  
  if (content.includes('<img\n')) {
    content = content.replace(/<img\n/g, '<NuxtImg\n');
    changed = true;
  }
  
  if (content.includes('<img\r\n')) {
    content = content.replace(/<img\r\n/g, '<NuxtImg\r\n');
    changed = true;
  }

  // Same for closing tag if somehow used
  if (content.includes('</img>')) {
    content = content.replace(/<\/img>/g, '</NuxtImg>');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Optimized images in:', filePath);
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
console.log('Done optimizing images');
