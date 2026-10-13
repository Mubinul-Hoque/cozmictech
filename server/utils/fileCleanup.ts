import { join } from 'path'
import { unlink } from 'fs/promises'

/**
 * Deletes a single uploaded file from public/assets/img/*.
 * Silently ignores external URLs, data URIs, and already-missing files
 * (the upload endpoint falls back to base64 data URLs on read-only filesystems,
 * so not every stored "image" has a corresponding file on disk).
 */
export async function deleteUploadedImage(imagePath: string | null | undefined): Promise<void> {
  if (!imagePath || !imagePath.startsWith('/assets/img/')) return
  try {
    const fullPath = join(process.cwd(), 'public', imagePath)
    await unlink(fullPath)
  } catch (err: any) {
    if (err.code !== 'ENOENT') {
      console.error('Failed to delete uploaded file:', imagePath, err)
    }
  }
}

/**
 * Deletes multiple uploaded images, e.g. a project's images_json array.
 */
export async function deleteUploadedImages(imagePaths: Array<string | null | undefined>): Promise<void> {
  await Promise.all(imagePaths.map(deleteUploadedImage))
}
