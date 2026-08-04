const fs = require('fs');
const path = require('path');

const adminPagesDir = path.join(__dirname, '../app/pages/admin');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

const successPatterns = [
  // when refreshing data: e.g. await refresh()
  // when pushing router: e.g. router.push
  // when toggling modal: e.g. showModal = false
];

walk(adminPagesDir, (filePath) => {
  if (!filePath.endsWith('.vue')) return;

  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // 1. Replace all alert() with useToast().error() for error messages
  content = content.replace(/alert\((.*?)\)/g, (match, p1) => {
    if (p1.toLowerCase().includes('failed') || p1.includes('error') || p1.includes('statusMessage')) {
      return `useToast().error(${p1})`;
    }
    // For non-error alerts, use success or info?
    if (p1.toLowerCase().includes('success')) {
      return `useToast().success(${p1})`;
    }
    return `useToast().info(${p1})`;
  });

  // 2. We need to inject useToast().success(...) on success.
  // Instead of a complex regex for AST, let's inject success messages where router.push occurs AFTER a successful save
  // Look for:
  // await useNuxtApp().$fetch(...);
  // router.push(...);
  // and inject:
  // useToast().success('Saved successfully');
  // OR look for:
  // await refresh(); 
  // showModal.value = false;
  // and inject useToast().success('Operation successful');

  content = content.replace(/(await useNuxtApp\(\)\.\$fetch\([^;]+;\s*)(router\.push\([^)]+\);)/g, `$1useToast().success('Saved successfully');\n    setTimeout(() => { $2 }, 1000);`);
  
  content = content.replace(/(await useNuxtApp\(\)\.\$fetch\([^;]+;\s*)(await refresh\(\);\s*showModal\.value = false;)/g, `$1useToast().success('Operation successful');\n      $2`);
  
  // Specific for delete operations
  content = content.replace(/(await useNuxtApp\(\)\.\$fetch\(`\/api\/admin\/[^`]+`, { method: 'DELETE' }\);\s*)(await refresh\(\);)/g, `$1useToast().success('Deleted successfully');\n      $2`);
  content = content.replace(/(await useNuxtApp\(\)\.\$fetch\(`\/api\/admin\/[^`]+`, { method: 'DELETE' }\);\s*)(data\.value\.splice)/g, `$1useToast().success('Deleted successfully');\n      $2`);

  // Settings page
  if (filePath.includes('settings.vue')) {
    content = content.replace(/(await useNuxtApp\(\)\.\$fetch\([^;]+;\s*)(saving\.value = false;)/g, `$1useToast().success('Settings saved successfully');\n    $2`);
  }

  // Remove the bespoke one in projects/[id].vue and use useToast
  if (filePath.includes('projects\\[id].vue') || filePath.includes('projects/[id].vue')) {
    content = content.replace(/const notification = ref\([^)]+\);/g, '');
    content = content.replace(/<!-- Notification -->[\s\S]*?<div v-if="notification\.show"[\s\S]*?<\/div>\s*<div class="bg-white/g, '<div class="bg-white');
    content = content.replace(/notification\.value = \{ show: true, message: ([^,]+), type: 'success' \};\s*setTimeout\(\(\) => \{\s*notification\.value\.show = false;\s*router\.push\('\/admin\/projects'\);\s*\}, 1500\);/g, `useToast().success($1);\n    setTimeout(() => {\n      router.push('/admin/projects');\n    }, 1500);`);
    content = content.replace(/notification\.value = \{ show: true, message: ([^,]+), type: 'error' \};\s*setTimeout\(\(\) => \{\s*notification\.value\.show = false;\s*\}, 3000\);/g, `useToast().error($1);`);
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${path.basename(filePath)}`);
  }
});
