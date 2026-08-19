// src/admin/components/ImageUploader.tsx
// File-explorer image upload with drag/drop, live preview, delete, reorder.
// Compresses to WebP client-side before uploading to Firebase Storage.

import React, { useRef, useState } from 'react';
import { Upload, X, GripVertical, ImageIcon, Loader2 } from 'lucide-react';
import { uploadImage, deleteImageByUrl } from '../../lib/storage';
import toast from 'react-hot-toast';

interface Props {
  value: string[];                 // current image URLs
  onChange: (urls: string[]) => void;
  folder: string;                  // e.g. `products/${productId}` or `categories`
  max?: number;                    // default 8
  label?: string;
  helper?: string;
}

export const ImageUploader: React.FC<Props> = ({
  value, onChange, folder, max = 8, label = 'Images', helper,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  async function handleFiles(files: FileList | File[]) {
    const arr = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (!arr.length) return;
    const remaining = max - value.length;
    if (remaining <= 0) { toast.error(`Max ${max} images`); return; }
    const toUpload = arr.slice(0, remaining);
    if (arr.length > remaining) toast(`Only uploading ${remaining} — max ${max} reached`);

    setUploading(true);
    const uploaded: string[] = [];
    try {
      for (const file of toUpload) {
        const id = crypto.randomUUID();
        const url = await uploadImage(file, `${folder}/${id}.webp`);
        uploaded.push(url);
      }
      onChange([...value, ...uploaded]);
      toast.success(`Uploaded ${uploaded.length} image${uploaded.length > 1 ? 's' : ''}`);
    } catch (err) {
      console.error(err);
      toast.error('Upload failed. Check console.');
    } finally {
      setUploading(false);
    }
  }

  async function handleRemove(index: number) {
    const url = value[index];
    onChange(value.filter((_, i) => i !== index));
    // fire-and-forget deletion from Storage
    deleteImageByUrl(url).catch(() => {});
  }

  function handleDragStart(i: number) { setDragIndex(i); }
  function handleDragOver(e: React.DragEvent, i: number) {
    e.preventDefault();
    if (dragIndex === null || dragIndex === i) return;
    const next = [...value];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(i, 0, moved);
    setDragIndex(i);
    onChange(next);
  }
  function handleDragEnd() { setDragIndex(null); }

  return (
    <div className="space-y-3">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-[#0F0F14]">
            {label} <span className="text-[#6B6B76] font-normal">({value.length}/{max})</span>
          </label>
          {helper && <span className="text-xs text-[#6B6B76]">{helper}</span>}
        </div>
      )}

      {/* Grid of existing images */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {value.map((url, i) => (
            <div
              key={url}
              draggable
              onDragStart={() => handleDragStart(i)}
              onDragOver={(e) => handleDragOver(e, i)}
              onDragEnd={handleDragEnd}
              className="relative group aspect-square rounded-xl overflow-hidden bg-[#F7F7F9] border border-[#EEEEF0] cursor-move"
            >
              <img src={url} alt="" className="w-full h-full object-cover" />
              {i === 0 && (
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#7C3AED] text-white text-[10px] font-bold uppercase tracking-wider">
                  Primary
                </span>
              )}
              <button
                type="button"
                onClick={() => handleRemove(i)}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-2 left-2 w-6 h-6 rounded-md bg-black/50 text-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload area */}
      {value.length < max && (
        <label
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFiles(e.dataTransfer.files);
          }}
          className={[
            'block cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all',
            dragOver ? 'border-[#7C3AED] bg-[#7C3AED]/5' : 'border-[#DDD] bg-[#FAFAFB] hover:border-[#7C3AED] hover:bg-[#7C3AED]/5',
          ].join(' ')}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            disabled={uploading}
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
          <div className="flex flex-col items-center gap-2">
            {uploading ? (
              <>
                <Loader2 className="w-8 h-8 text-[#7C3AED] animate-spin" />
                <div className="text-sm font-semibold text-[#0F0F14]">Uploading…</div>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-2xl bg-white border border-[#EEEEF0] flex items-center justify-center">
                  <Upload className="w-5 h-5 text-[#7C3AED]" />
                </div>
                <div className="text-sm font-semibold text-[#0F0F14]">
                  Click to browse or drag & drop
                </div>
                <div className="text-xs text-[#6B6B76]">
                  JPG, PNG, WebP · max 5MB each · auto-compressed to WebP · first image = primary
                </div>
              </>
            )}
          </div>
        </label>
      )}

      {value.length === 0 && !uploading && (
        <div className="flex items-center gap-2 text-xs text-[#6B6B76]">
          <ImageIcon className="w-4 h-4" /> No images yet — drag reorders after upload.
        </div>
      )}
    </div>
  );
};
