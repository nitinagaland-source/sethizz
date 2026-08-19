// src/admin/pages/CategoriesPage.tsx
import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Save, X, ArrowUp, ArrowDown, Tags } from 'lucide-react';
import toast from 'react-hot-toast';
import { doc, setDoc, deleteDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useCategories } from '../../hooks/useCategories';
import { ImageUploader } from '../components/ImageUploader';
import { ConfirmDialog } from '../components/ConfirmDialog';
import type { Category } from '../../types';

const slugify = (s: string) => s.toLowerCase().trim()
  .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 40);

const EMPTY: Omit<Category, 'createdAt' | 'updatedAt'> = {
  id: '', name: '', description: '', image: '', order: 0, isActive: true, itemCount: 0,
};

export const CategoriesPage: React.FC = () => {
  const { categories, loading } = useCategories({ includeInactive: true });
  const [editing, setEditing] = useState<Category | null>(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<Omit<Category, 'createdAt' | 'updatedAt'>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

  function startCreate() {
    setDraft({ ...EMPTY, order: (categories[categories.length - 1]?.order ?? 0) + 1 });
    setEditing(null);
    setCreating(true);
  }
  function startEdit(cat: Category) {
    setDraft({ ...EMPTY, ...cat });
    setEditing(cat);
    setCreating(false);
  }
  function cancel() { setCreating(false); setEditing(null); setDraft(EMPTY); }

  async function handleSave() {
    if (!draft.name.trim()) { toast.error('Name required'); return; }
    if (!draft.id.trim()) { toast.error('ID (slug) required'); return; }
    if (!draft.image) { toast.error('Upload a category image'); return; }

    setSaving(true);
    try {
      await setDoc(doc(db, 'categories', draft.id), {
        ...draft,
        updatedAt: serverTimestamp(),
        ...(creating ? { createdAt: serverTimestamp() } : {}),
      }, { merge: true });
      toast.success(creating ? 'Category created' : 'Category saved');
      cancel();
    } catch (err) {
      console.error(err);
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteDoc(doc(db, 'categories', toDelete.id));
      toast.success('Category deleted');
      setToDelete(null);
    } catch { toast.error('Delete failed'); }
    finally { setDeleting(false); }
  }

  async function reorder(cat: Category, dir: -1 | 1) {
    const list = [...categories].sort((a, b) => a.order - b.order);
    const idx = list.findIndex((c) => c.id === cat.id);
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= list.length) return;
    const batch = writeBatch(db);
    batch.update(doc(db, 'categories', list[idx].id), { order: list[swapIdx].order });
    batch.update(doc(db, 'categories', list[swapIdx].id), { order: list[idx].order });
    await batch.commit();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#6B6B76]">Categories power the shop navigation, filters, and homepage grid.</p>
        <button
          onClick={startCreate}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#F97316] text-white font-semibold text-sm hover:opacity-95"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {/* Editor panel */}
      {(creating || editing) && (
        <div className="bg-white border-2 border-[#7C3AED]/30 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-[#0F0F14]">
              {creating ? 'New Category' : `Editing "${editing?.name}"`}
            </h3>
            <button onClick={cancel} className="w-9 h-9 rounded-lg hover:bg-[#F7F7F9] flex items-center justify-center text-[#6B6B76]">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#0F0F14] uppercase tracking-wider mb-1.5">Name</label>
              <input
                value={draft.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setDraft((d) => ({ ...d, name, id: creating && !d.id.trim() ? slugify(name) : d.id }));
                }}
                placeholder="Heavyweight Tees"
                className="w-full h-11 px-3 bg-[#F7F7F9] rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#7C3AED]/20"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0F0F14] uppercase tracking-wider mb-1.5">
                ID (URL slug) {!creating && <span className="text-[#9A9AA5] normal-case font-normal">— cannot change after creation</span>}
              </label>
              <input
                value={draft.id}
                onChange={(e) => setDraft((d) => ({ ...d, id: slugify(e.target.value) }))}
                disabled={!creating}
                placeholder="tees"
                className="w-full h-11 px-3 bg-[#F7F7F9] rounded-xl text-sm font-mono focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#7C3AED]/20 disabled:opacity-60"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0F0F14] uppercase tracking-wider mb-1.5">Description (optional)</label>
            <textarea
              value={draft.description || ''}
              onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
              rows={2}
              className="w-full px-3 py-2.5 bg-[#F7F7F9] rounded-xl text-sm resize-none focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#7C3AED]/20"
            />
          </div>

          <ImageUploader
            value={draft.image ? [draft.image] : []}
            onChange={(urls) => setDraft((d) => ({ ...d, image: urls[0] || '' }))}
            folder={`categories/${draft.id || 'new'}`}
            max={1}
            label="Category image"
            helper="Shown on homepage grid and shop nav."
          />

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={draft.isActive} onChange={(e) => setDraft((d) => ({ ...d, isActive: e.target.checked }))} className="w-4 h-4 rounded accent-[#7C3AED]" />
              <span className="text-sm font-medium text-[#0F0F14]">Active</span>
            </label>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-[#0F0F14]">Sort order:</label>
              <input type="number" value={draft.order} onChange={(e) => setDraft((d) => ({ ...d, order: Number(e.target.value) || 0 }))} className="w-20 h-9 px-2 bg-[#F7F7F9] rounded-lg text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#7C3AED]/20" />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button onClick={cancel} className="h-10 px-4 rounded-xl text-sm font-semibold text-[#4A4A55] hover:bg-[#F7F7F9]">Cancel</button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="h-10 px-5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#F97316] text-white font-semibold text-sm flex items-center gap-2 disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white border border-[#EEEEF0] rounded-2xl h-56 animate-pulse" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white border border-[#EEEEF0] rounded-2xl p-12 text-center">
          <Tags className="w-10 h-10 text-[#9A9AA5] mx-auto mb-3" />
          <p className="text-sm text-[#6B6B76]">No categories yet. Click "Add Category" to create the first one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...categories].sort((a, b) => a.order - b.order).map((c, i, arr) => (
            <div key={c.id} className="bg-white border border-[#EEEEF0] rounded-2xl overflow-hidden group">
              <div className="aspect-[16/10] bg-[#F7F7F9] overflow-hidden">
                {c.image
                  ? <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-[#9A9AA5]"><Tags className="w-8 h-8" /></div>}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-bold text-[#0F0F14] truncate">{c.name}</div>
                    <div className="text-xs text-[#6B6B76] font-mono">/{c.id} · {c.itemCount || 0} items</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    c.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-[#F0F0F2] text-[#6B6B76]'
                  }`}>{c.isActive ? 'Live' : 'Hidden'}</span>
                </div>
                <div className="mt-3 flex items-center gap-1">
                  <button onClick={() => reorder(c, -1)} disabled={i === 0} className="w-8 h-8 rounded-lg hover:bg-[#F7F7F9] text-[#6B6B76] flex items-center justify-center disabled:opacity-30"><ArrowUp className="w-3.5 h-3.5" /></button>
                  <button onClick={() => reorder(c, 1)} disabled={i === arr.length - 1} className="w-8 h-8 rounded-lg hover:bg-[#F7F7F9] text-[#6B6B76] flex items-center justify-center disabled:opacity-30"><ArrowDown className="w-3.5 h-3.5" /></button>
                  <div className="flex-1" />
                  <button onClick={() => startEdit(c)} className="w-8 h-8 rounded-lg hover:bg-[#F7F7F9] text-[#6B6B76] hover:text-[#7C3AED] flex items-center justify-center"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => setToDelete(c)} className="w-8 h-8 rounded-lg hover:bg-red-50 text-[#6B6B76] hover:text-red-600 flex items-center justify-center"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!toDelete}
        title={`Delete "${toDelete?.name}"?`}
        message={`Products in this category won't be deleted, but they'll show an empty category label until you reassign them. ${(toDelete?.itemCount || 0) > 0 ? `⚠️ ${toDelete?.itemCount} products currently in this category.` : ''}`}
        confirmLabel="Delete category"
        destructive
        onCancel={() => setToDelete(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
};
