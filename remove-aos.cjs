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
  
  // Remove AOS delays
  content = content.replace(/\s*data-aos-delay=["'][0-9]+["']/g, '');
  
  if (original !== content) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated AOS delay in', file);
  }
});
