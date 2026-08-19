import imageCompression from 'browser-image-compression';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const DEFAULT_COMPRESSION = { maxSizeMB: 0.8, maxWidthOrHeight: 1600, useWebWorker: true };

export async function uploadImage(file: File, folder: string, compress = true): Promise<string> {
  let toUpload: File | Blob = file;
  if (compress && file.type.startsWith('image/')) {
    try { toUpload = await imageCompression(file, DEFAULT_COMPRESSION); } catch {}
  }
  const formData = new FormData();
  formData.append('file', toUpload);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', `sethizzz/${folder}`);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
  if (!res.ok) throw new Error(`Cloudinary upload failed: ${res.statusText}`);
  const data = await res.json();
  return data.secure_url as string;
}

export async function uploadImages(files: File[], folder: string): Promise<string[]> {
  const urls: string[] = [];
  for (const f of files) urls.push(await uploadImage(f, folder));
  return urls;
}

export async function deleteImageByUrl(url: string): Promise<void> {
  console.log('[storage] deleteImageByUrl:', url);
}

export async function deleteFolder(_folderPath: string): Promise<void> {
  console.log('[storage] deleteFolder skipped');
}