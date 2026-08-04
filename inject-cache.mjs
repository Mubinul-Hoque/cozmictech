import fs from 'fs';
import path from 'path';

const apiDir = path.join(process.cwd(), 'server', 'api', 'admin');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('clearPublicCache')) return;

  const returnRegex = /(return\s+\{\s*success:\s*true[\s\S]*?\})/g;
  
  if (returnRegex.test(content)) {
    // Only add clearPublicCache if it's a mutating method (POST, PUT, DELETE)
    // Actually, we can just replace all `return { success: true... }` 
    // with `await clearPublicCache(); return { success: true... }` 
    // as GET requests don't usually return { success: true } as their main body.
    
    // Let's do it safely.
    content = content.replace(returnRegex, 'await clearPublicCache();\n      $1');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated:', filePath);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

walkDir(apiDir);
console.log('Done injecting clearPublicCache');
