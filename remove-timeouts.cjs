const fs = require('fs');
const path = require('path');
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      results.push(file);
    }
  });
  return results;
}

const vueFiles = walk('app').filter(f => f.endsWith('.vue'));

vueFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  // Replace: setTimeout(() => { router.push(...); }, 1000);
  // With: router.push(...);
  content = content.replace(/setTimeout\(\s*\(\)\s*=>\s*\{\s*router\.push\((['`].+?['`])\);?\s*\},?\s*\d+\s*\);?/g, "router.push($1);");
  
  // Also some might not have brackets: setTimeout(() => router.push(...), 1000)
  content = content.replace(/setTimeout\(\s*\(\)\s*=>\s*router\.push\((['`].+?['`])\),?\s*\d+\s*\);?/g, "router.push($1);");

  // Some empty setTimeouts without router push just for delaying next actions:
  // e.g. setTimeout(() => { ... }) where it wraps some arbitrary logic that could be instant
  
  if (original !== content) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated', file);
  }
});
