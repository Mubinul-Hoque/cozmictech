const fs = require('fs');
const path = require('path');

const resources = [
  'users',
  'testimonials',
  'team',
  'projects',
  'messages',
  'career',
  'blog'
];

resources.forEach(res => {
  const indexPath = path.join('app', 'pages', 'admin', res, 'index.vue');
  const idPath = path.join('app', 'pages', 'admin', res, '[id].vue');
  
  const key = `admin-${res}-list`;

  // Update index.vue
  if (fs.existsSync(indexPath)) {
    let content = fs.readFileSync(indexPath, 'utf8');
    const original = content;
    
    // Replace useFetch('/api/admin/R') with useFetch('/api/admin/R', { key: 'admin-R-list' })
    const regex1 = new RegExp(`useFetch\\(['\`]/api/admin/${res}['\`]\\)`, 'g');
    content = content.replace(regex1, `useFetch('/api/admin/${res}', { key: '${key}' })`);
    
    // Replace useFetch('/api/admin/R', { ... }) with { ..., key: 'admin-R-list' }
    const regex2 = new RegExp(`useFetch\\(['\`]/api/admin/${res}['\`]\\s*,\\s*\\{(.*?)\\}`, 'g');
    content = content.replace(regex2, (match, p1) => {
      if (p1.includes('key:')) return match; // already has key
      return `useFetch('/api/admin/${res}', { ${p1.trim() ? p1 + ', ' : ''}key: '${key}' }`;
    });
    
    if (content !== original) {
      fs.writeFileSync(indexPath, content, 'utf8');
      console.log(`Updated ${indexPath}`);
    }
  }

  // Update [id].vue
  if (fs.existsSync(idPath)) {
    let content = fs.readFileSync(idPath, 'utf8');
    const original = content;
    
    // If it has clearNuxtData(), replace it
    content = content.replace(/clearNuxtData\(\)[;]?/g, `await refreshNuxtData('${key}');`);
    
    // If it DOES NOT have refreshNuxtData, but has router.push, insert it before router.push in handleSave
    // Note: this regex targets router.push(...) that occurs right after a success toast or similar inside handleSave.
    if (!content.includes('refreshNuxtData')) {
      content = content.replace(/(useToast\(\)\.success\(.*?\);?\s*)(router\.push\((['`])\/admin\/.*?['`]\);?)/g, `$1await refreshNuxtData('${key}');\n    $2`);
    }
    
    if (content !== original) {
      fs.writeFileSync(idPath, content, 'utf8');
      console.log(`Updated ${idPath}`);
    }
  }
});
