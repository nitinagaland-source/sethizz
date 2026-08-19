// src/admin/pages/ProductEditPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, Palette, Loader2, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { ImageUploader } from '../components/ImageUploader';
import { useCategories } from '../../hooks/useCategories';
import type { Product, ProductVariant, ProductSize } from '../../types';

const EMPTY_PRODUCT = (): Omit<Product, 'id' | 'createdAt' | 'updatedAt'> => ({
  slug: '', sku: '', name: '', category: '', categoryLabel: '',
  price: 0, salePrice: undefined,
  shortDescription: '', description: '',
  variants: [],
  details: { fabric: '', weight: '', fit: '', modelWears: '' },
  rating: 0, reviewCount: 0,
  flags: { isNew: false, isBestseller: false, isDeal: false, isActive: true },
  order: 0,
});

const emptyVariant = (): ProductVariant => ({
  colorId: '', colorName: '', colorHex: '#000000', images: [],
  sizes: [{ name: 'M', stock: 0 }],
});

const slugify = (s: string) => s.toLowerCase().trim()
  .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 80);

export const ProductEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'new';
  const navigate = useNavigate();
  const { categories } = useCategories({ includeInactive: true });

  const [productId, setProductId] = useState<string>(isNew ? crypto.randomUUID() : id!);
  const [product, setProduct] = useState<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>(EMPTY_PRODUCT());
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew) return;
    (async () => {
      const snap = await getDoc(doc(db, 'products', id!));
      if (!snap.exists()) { toast.error('Product not found'); navigate('/admin/products'); return; }
      const data = snap.data() as any;
      setProduct({ ...EMPTY_PRODUCT(), ...data });
      setLoading(false);
    })();
  }, [id, isNew, navigate]);

  const update = (patch: Partial<typeof product>) => setProduct((p) => ({ ...p, ...patch }));

  function updateVariant(i: number, patch: Partial<ProductVariant>) {
    setProduct((p) => ({ ...p, variants: p.variants.map((v, idx) => idx === i ? { ...v, ...patch } : v) }));
  }
  function addVariant() { setProduct((p) => ({ ...p, variants: [...p.variants, emptyVariant()] })); }
  function removeVariant(i: number) {
    if (!confirm('Remove this color variant and its images?')) return;
    setProduct((p) => ({ ...p, variants: p.variants.filter((_, idx) => idx !== i) }));
  }
  function updateSize(vi: number, si: number, patch: Partial<ProductSize>) {
    updateVariant(vi, {
      sizes: product.variants[vi].sizes.map((s, idx) => idx === si ? { ...s, ...patch } : s),
    });
  }
  function addSize(vi: number) {
    updateVariant(vi, { sizes: [...product.variants[vi].sizes, { name: '', stock: 0 }] });
  }
  function removeSize(vi: number, si: number) {
    updateVariant(vi, { sizes: product.variants[vi].sizes.filter((_, idx) => idx !== si) });
  }

  async function handleSave() {
    // basic validation
    if (!product.name.trim()) { toast.error('Name is required'); return; }
    if (!product.category) { toast.error('Category is required'); return; }
    if (!product.slug.trim()) { toast.error('Slug is required'); return; }
    if (product.price <= 0) { toast.error('Price must be > 0'); return; }
    if (product.variants.length === 0) { toast.error('Add at least one color variant'); return; }
    for (const v of product.variants) {
      if (!v.colorName.trim()) { toast.error('Color name required for all variants'); return; }
      if (v.images.length === 0) { toast.error(`Add at least one image for ${v.colorName || 'variant'}`); return; }
    }

    // ensure categoryLabel is snapshotted
    const cat = categories.find((c) => c.id === product.category);
    const categoryLabel = cat?.name || product.categoryLabel || product.category;

    setSaving(true);
    try {
      await setDoc(doc(db, 'products', productId), {
        ...product,
        categoryLabel,
        updatedAt: serverTimestamp(),
        ...(isNew ? { createdAt: serverTimestamp() } : {}),
      }, { merge: true });
      toast.success(isNew ? 'Product created' : 'Product saved');
      if (isNew) navigate(`/admin/products/${productId}`, { replace: true });
    } catch (err) {
      console.error(err);
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-[#7C3AED] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-32">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/admin/products" className="w-9 h-9 rounded-xl bg-white border border-[#EEEEF0] flex items-center justify-center hover:border-[#7C3AED] hover:text-[#7C3AED]">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-[#0F0F14] truncate">
            {isNew ? 'Add Product' : product.name || 'Untitled'}
          </h2>
          <p className="text-xs text-[#6B6B76] font-mono">/product/{product.slug || 'auto-generated'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* MAIN COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basics */}
          <Section title="Basics">
            <Field label="Name">
              <Input value={product.name} onChange={(v) => {
                update({ name: v });
                if (isNew && !product.slug) update({ slug: slugify(v) });
              }} placeholder="Oversized Heavyweight Tee" />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Slug (URL)">
                <Input value={product.slug} onChange={(v) => update({ slug: slugify(v) })} placeholder="oversized-heavyweight-tee" />
              </Field>
              <Field label="SKU">
                <Input value={product.sku} onChange={(v) => update({ sku: v })} placeholder="STZ-TEE-001" />
              </Field>
            </div>
            <Field label="Category">
              <select
                value={product.category}
                onChange={(e) => update({ category: e.target.value })}
                className="w-full h-11 px-3 bg-[#F7F7F9] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#7C3AED] focus:bg-white"
              >
                <option value="">— Select category —</option>
                {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
              </select>
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Price (₹)">
                <Input type="number" value={String(product.price || '')} onChange={(v) => update({ price: Number(v) || 0 })} />
              </Field>
              <Field label="Sale Price (₹, optional)" helper="Leave blank if not on sale">
                <Input type="number" value={String(product.salePrice || '')} onChange={(v) => update({ salePrice: v ? Number(v) : undefined })} />
              </Field>
            </div>
            <Field label="Short Description" helper="Shown in product cards (max ~120 chars)">
              <textarea
                value={product.shortDescription}
                onChange={(e) => update({ shortDescription: e.target.value })}
                rows={2}
                className="w-full px-3 py-2.5 bg-[#F7F7F9] border border-transparent rounded-xl text-sm resize-none focus:outline-none focus:border-[#7C3AED] focus:bg-white"
              />
            </Field>
            <Field label="Full Description">
              <textarea
                value={product.description}
                onChange={(e) => update({ description: e.target.value })}
                rows={5}
                className="w-full px-3 py-2.5 bg-[#F7F7F9] border border-transparent rounded-xl text-sm resize-none focus:outline-none focus:border-[#7C3AED] focus:bg-white"
              />
            </Field>
          </Section>

          {/* Details */}
          <Section title="Product Details" helper="Shown on the product detail page.">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Fabric"><Input value={product.details.fabric} onChange={(v) => update({ details: { ...product.details, fabric: v } })} placeholder="100% Combed Cotton" /></Field>
              <Field label="Weight"><Input value={product.details.weight} onChange={(v) => update({ details: { ...product.details, weight: v } })} placeholder="260 GSM" /></Field>
              <Field label="Fit"><Input value={product.details.fit} onChange={(v) => update({ details: { ...product.details, fit: v } })} placeholder="Boxy Oversized" /></Field>
              <Field label="Model Wears"><Input value={product.details.modelWears} onChange={(v) => update({ details: { ...product.details, modelWears: v } })} placeholder="6ft model wears M" /></Field>
            </div>
          </Section>

          {/* Variants */}
          <Section
            title="Color Variants"
            helper="Each color has its own images and stock per size. Upload images from your computer."
            actions={
              <button
                onClick={addVariant}
                className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-[#7C3AED] text-white text-xs font-semibold hover:bg-[#6D28D9]"
              >
                <Plus className="w-3.5 h-3.5" /> Add color
              </button>
            }
          >
            {product.variants.length === 0 ? (
              <div className="p-8 bg-[#FAFAFB] rounded-xl text-center">
                <Palette className="w-8 h-8 text-[#9A9AA5] mx-auto mb-2" />
                <p className="text-sm text-[#6B6B76]">No colors yet. Click "Add color" to start.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {product.variants.map((v, i) => (
                  <div key={i} className="border border-[#EEEEF0] rounded-2xl p-5 space-y-4">
                    {/* Color row */}
                    <div className="flex items-end gap-3">
                      <Field label="Color name" className="flex-1">
                        <Input value={v.colorName} onChange={(val) => updateVariant(i, {
                          colorName: val,
                          colorId: v.colorId || slugify(val),
                        })} placeholder="Black" />
                      </Field>
                      <Field label="Color ID" className="w-32">
                        <Input value={v.colorId} onChange={(val) => updateVariant(i, { colorId: slugify(val) })} placeholder="black" />
                      </Field>
                      <Field label="Hex" className="w-28">
                        <div className="flex items-center gap-2 h-11 pl-1 pr-2 bg-[#F7F7F9] rounded-xl">
                          <input type="color" value={v.colorHex} onChange={(e) => updateVariant(i, { colorHex: e.target.value })} className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer" />
                          <input value={v.colorHex} onChange={(e) => updateVariant(i, { colorHex: e.target.value })} className="w-full text-xs font-mono bg-transparent focus:outline-none" />
                        </div>
                      </Field>
                      <button onClick={() => removeVariant(i)} className="h-11 w-11 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Images */}
                    <ImageUploader
                      value={v.images}
                      onChange={(urls) => updateVariant(i, { images: urls })}
                      folder={`products/${productId}/${v.colorId || `variant-${i}`}`}
                      label={`Images — ${v.colorName || 'this color'}`}
                    />

                    {/* Sizes */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-semibold text-[#0F0F14]">Sizes & Stock</label>
                        <button onClick={() => addSize(i)} className="text-xs font-semibold text-[#7C3AED] hover:underline">+ Add size</button>
                      </div>
                      <div className="space-y-2">
                        {v.sizes.map((s, si) => (
                          <div key={si} className="grid grid-cols-12 gap-2 items-center">
                            <input value={s.name} onChange={(e) => updateSize(i, si, { name: e.target.value })} placeholder="Size (S, M, L)" className="col-span-4 h-10 px-3 bg-[#F7F7F9] rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#7C3AED]/20" />
                            <input type="number" value={s.stock} onChange={(e) => updateSize(i, si, { stock: Number(e.target.value) || 0 })} placeholder="Stock" className="col-span-3 h-10 px-3 bg-[#F7F7F9] rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#7C3AED]/20" />
                            <input value={s.sku || ''} onChange={(e) => updateSize(i, si, { sku: e.target.value })} placeholder="SKU (optional)" className="col-span-4 h-10 px-3 bg-[#F7F7F9] rounded-xl text-sm font-mono focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#7C3AED]/20" />
                            <button onClick={() => removeSize(i, si)} className="col-span-1 h-10 rounded-xl text-[#6B6B76] hover:bg-red-50 hover:text-red-600 flex items-center justify-center">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Section>
        </div>

        {/* SIDE COLUMN */}
        <div className="space-y-6">
          <Section title="Visibility">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={product.flags.isActive} onChange={(e) => update({ flags: { ...product.flags, isActive: e.target.checked } })} className="w-4 h-4 rounded accent-[#7C3AED]" />
              <div>
                <div className="text-sm font-semibold text-[#0F0F14]">Published</div>
                <div className="text-xs text-[#6B6B76]">If off, product is hidden from storefront.</div>
              </div>
            </label>
          </Section>

          <Section title="Product Flags" helper="Powers 'New' / 'Bestseller' / 'Deal' badges on storefront.">
            {[
              { key: 'isNew', label: 'New Arrival' },
              { key: 'isBestseller', label: 'Bestseller' },
              { key: 'isDeal', label: 'Featured Deal' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-3 py-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(product.flags as any)[key]}
                  onChange={(e) => update({ flags: { ...product.flags, [key]: e.target.checked } })}
                  className="w-4 h-4 rounded accent-[#7C3AED]"
                />
                <span className="text-sm font-medium text-[#0F0F14]">{label}</span>
              </label>
            ))}
          </Section>

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs text-blue-900">
              <strong>Tip:</strong> Set stock to 0 to mark a size as sold out — it'll still show but with a disabled state.
            </div>
          </div>
        </div>
      </div>

      {/* Sticky save bar */}
      <div className="fixed bottom-0 left-0 right-0 lg:pl-[248px] bg-white/95 backdrop-blur-md border-t border-[#EEEEF0] p-4 z-20">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-3">
          <div className="text-xs text-[#6B6B76]">
            {isNew ? 'This product will be saved as a new record.' : `Editing product ID: ${productId}`}
          </div>
          <div className="flex gap-2">
            <Link to="/admin/products" className="h-10 px-4 rounded-xl text-sm font-semibold text-[#4A4A55] hover:bg-[#F7F7F9] flex items-center">
              Cancel
            </Link>
            <button
              onClick={handleSave}
              disabled={saving}
              className="h-10 px-6 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#F97316] text-white font-semibold text-sm flex items-center gap-2 disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving…' : isNew ? 'Create product' : 'Save changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------- Small helper components ---------- */

const Section: React.FC<{ title: string; helper?: string; actions?: React.ReactNode; children: React.ReactNode }> = ({
  title, helper, actions, children,
}) => (
  <div className="bg-white border border-[#EEEEF0] rounded-2xl p-5 space-y-4">
    <div className="flex items-start justify-between gap-3">
      <div>
        <h3 className="font-bold text-[#0F0F14]">{title}</h3>
        {helper && <p className="text-xs text-[#6B6B76] mt-0.5">{helper}</p>}
      </div>
      {actions}
    </div>
    {children}
  </div>
);

const Field: React.FC<{ label: string; helper?: string; className?: string; children: React.ReactNode }> = ({
  label, helper, className = '', children,
}) => (
  <div className={className}>
    <label className="block text-xs font-bold text-[#0F0F14] uppercase tracking-wider mb-1.5">{label}</label>
    {children}
    {helper && <p className="text-[11px] text-[#6B6B76] mt-1">{helper}</p>}
  </div>
);

const Input: React.FC<{ value: string; onChange: (v: string) => void; type?: string; placeholder?: string }> = ({
  value, onChange, type = 'text', placeholder,
}) => (
  <input
    type={type}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="w-full h-11 px-3 bg-[#F7F7F9] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#7C3AED] focus:bg-white transition"
  />
);
