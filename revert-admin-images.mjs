import fs from 'fs';
import path from 'path';

const adminDir = path.join(process.cwd(), 'app', 'pages', 'admin');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  if (content.includes('<NuxtImg ')) {
    content = content.replace(/<NuxtImg /g, '<img ');
    changed = true;
  }
  
  if (content.includes('<NuxtImg\n')) {
    content = content.replace(/<NuxtImg\n/g, '<img\n');
    changed = true;
  }
  
  if (content.includes('<NuxtImg\r\n')) {
    content = content.replace(/<NuxtImg\r\n/g, '<img\r\n');
    changed = true;
  }

  if (content.includes('</NuxtImg>')) {
    content = content.replace(/<\/NuxtImg>/g, '</img>');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Reverted images in:', filePath);
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

walkDir(adminDir);
console.log('Done reverting admin images');
