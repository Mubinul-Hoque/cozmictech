import { join } from 'path';
import { randomUUID } from 'crypto';
import sharp from 'sharp';

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event);
  if (!formData || formData.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No file uploaded' });
  }

  const file = formData.find(f => f.name === 'file');
  if (!file) {
    throw createError({ statusCode: 400, statusMessage: 'File field missing' });
  }

  // Limit file size to 5MB to prevent Disk Exhaustion DoS
  if (file.data.length > 5 * 1024 * 1024) {
    throw createError({ statusCode: 400, statusMessage: 'File size exceeds the 5MB limit' });
  }

  // Ensure MIME type is an image
  if (!file.type || !file.type.startsWith('image/')) {
    throw createError({ statusCode: 400, statusMessage: 'Only images are allowed' });
  }

  const folderData = formData.find(f => f.name === 'folder');
  let folder = folderData ? folderData.data.toString() : '';
  const safeFolder = folder.replace(/[^a-zA-Z0-9_-]/g, '');

  let maxSize = 5 * 1024 * 1024; // Default 5MB
  let maxSizeKb = 5120;

  if (safeFolder === 'projects' || safeFolder === 'page_sections' || safeFolder === 'page_section') {
    maxSize = 500 * 1024;
    maxSizeKb = 500;
  } else if (safeFolder === 'team') {
    maxSize = 200 * 1024;
    maxSizeKb = 200;
  }

  if (file.data.length > maxSize) {
    throw createError({ statusCode: 400, statusMessage: `File size exceeds the ${maxSizeKb}KB limit for this category` });
  }


  const newName = `${randomUUID()}.webp`;

  // Save to public/assets/img/{folder}
  const uploadPath = join(process.cwd(), 'public', 'assets', 'img', safeFolder, newName);

  try {
    // Process image with sharp: resize (max 1920x1080), compress, and convert to WebP
    await sharp(file.data)
      .resize({ width: 1920, height: 1080, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80, effort: 6 })
      .toFile(uploadPath);

    await clearPublicCache();
    return { success: true, filename: newName, url: `/assets/img/${safeFolder ? safeFolder + '/' : ''}${newName}` };
  } catch (error: any) {
    // If filesystem is read-only (such as Vercel serverless environment), fall back to base64 Data URL
    if (error.code === 'EROFS' || error.code === 'ENOENT' || error.message?.includes('read-only') || error.message?.includes('permission denied')) {
      try {
        const buffer = await sharp(file.data)
          .resize({ width: 1920, height: 1080, fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 80, effort: 6 })
          .toBuffer();
        const base64 = buffer.toString('base64');
        const dataUrl = `data:image/webp;base64,${base64}`;
        await clearPublicCache();
        return { success: true, filename: newName, url: dataUrl };
      } catch (fallbackError) {
        console.error('Image processing fallback failed:', fallbackError);
      }
    }
    console.error('Image processing failed:', error);
    throw createError({ statusCode: 500, statusMessage: 'Failed to process and save image' });
  }
});
