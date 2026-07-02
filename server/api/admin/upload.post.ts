import { writeFile } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

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

  const originalName = file.filename || 'upload.jpg';
  const ext = originalName.split('.').pop()?.toLowerCase();
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];

  if (!ext || !allowedExtensions.includes(ext)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid file extension. Only jpg, jpeg, png, gif, webp, and svg are allowed.' });
  }

  const newName = `${randomUUID()}.${ext}`;

  // Save to public/assets/img/projects (or similar). The DB stores comma-separated names.
  const uploadPath = join(process.cwd(), 'public', 'assets', 'img', newName);

  await writeFile(uploadPath, file.data);

  return { success: true, filename: newName, url: `/assets/img/${newName}` };
});
