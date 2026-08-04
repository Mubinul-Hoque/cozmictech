import fs from 'fs';
import path from 'path';

const pagesDir = path.join(process.cwd(), 'app', 'pages', 'admin');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Add clearNuxtData() before useToast().success(...) if it's not already there
  const toastRegex = /useToast\(\)\.success\((.*?)\);/g;
  if (toastRegex.test(content) && !content.includes('clearNuxtData();')) {
    content = content.replace(toastRegex, 'clearNuxtData();\n    useToast().success($1);');
    changed = true;
  }

  // Also look for method: 'DELETE' calls, and inject clearNuxtData() before the next refresh()
  // This is a bit trickier, but usually it's `refresh();` or `refreshSomething();` right after.
  // We can just find `method: 'DELETE'` and then the closest refresh call.
  // Actually, we can just replace `refresh();` with `clearNuxtData(); refresh();`
  // and `refreshNuxtData(` with `clearNuxtData(); refreshNuxtData(`.
  // But wait! If we do it globally, it applies everywhere.
  
  // Let's replace `refresh(` (if it's `refresh()` or `refreshCats()` etc) 
  // Wait, better to inject it carefully.
  
  const refreshRegex = /await\s+refreshNuxtData\(/g;
  if (refreshRegex.test(content) && !content.includes('clearNuxtData();\n    await refreshNuxtData')) {
    content = content.replace(refreshRegex, 'clearNuxtData();\n    await refreshNuxtData(');
    changed = true;
  }
  
  const plainRefreshRegex = /(\s+)refresh\(\);/g;
  if (plainRefreshRegex.test(content) && !content.includes('clearNuxtData();\n')) {
    content = content.replace(plainRefreshRegex, '$1clearNuxtData();$1refresh();');
    changed = true;
  }

  // Projects list page has custom refresh functions: refreshCategories(), refreshSectors(), refreshProjects()
  const customRefreshRegex = /(\s+)refresh(?:Categories|Sectors|Projects|Clients)\(\);/g;
  if (customRefreshRegex.test(content) && !content.includes('clearNuxtData();\n')) {
    content = content.replace(customRefreshRegex, '$1clearNuxtData();$0');
    changed = true;
  }

  if (changed) {
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
    } else if (fullPath.endsWith('.vue')) {
      processFile(fullPath);
    }
  }
}

walkDir(pagesDir);
console.log('Done injecting clearNuxtData');
