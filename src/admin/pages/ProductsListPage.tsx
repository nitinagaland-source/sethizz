// src/admin/pages/ProductsListPage.tsx
import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Eye, EyeOff, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { DataTable, type Column } from '../components/DataTable';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useProducts } from '../../hooks/useProducts';
import { deleteFolder } from '../../lib/storage';
import type { Product } from '../../types';

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

export const ProductsListPage: React.FC = () => {
  const { products, loading } = useProducts({ includeInactive: true });
  const [search, setSearch] = useState('');
  const [toDelete, setToDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.categoryLabel.toLowerCase().includes(q)
    );
  }, [products, search]);

  async function handleToggleActive(p: Product) {
    await updateDoc(doc(db, 'products', p.id), { 'flags.isActive': !p.flags.isActive });
    toast.success(p.flags.isActive ? 'Product hidden from storefront' : 'Product published');
  }

  async function handleDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteDoc(doc(db, 'products', toDelete.id));
      // fire-and-forget delete of images folder
      deleteFolder(`products/${toDelete.id}`).catch(() => {});
      toast.success('Product deleted');
      setToDelete(null);
    } catch (err) {
      toast.error('Delete failed');
    } finally {
      setDeleting(false);
    }
  }

  const columns: Column<Product>[] = [
    {
      key: 'product', header: 'Product',
      render: (p) => {
        const img = p.variants[0]?.images[0];
        return (
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-[#F7F7F9] overflow-hidden shrink-0 flex items-center justify-center">
              {img ? <img src={img} alt="" className="w-full h-full object-cover" />
                   : <Package className="w-4 h-4 text-[#9A9AA5]" />}
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-[#0F0F14] truncate">{p.name}</div>
              <div className="text-xs text-[#6B6B76] font-mono">{p.sku}</div>
            </div>
          </div>
        );
      },
    },
    { key: 'category', header: 'Category', render: (p) => <span className="text-[#4A4A55]">{p.categoryLabel}</span> },
    {
      key: 'price', header: 'Price',
      render: (p) => (
        <div>
          {p.salePrice ? (
            <>
              <span className="font-bold text-[#0F0F14]">{inr(p.salePrice)}</span>
              <span className="ml-1.5 text-xs text-[#9A9AA5] line-through">{inr(p.price)}</span>
            </>
          ) : (
            <span className="font-bold text-[#0F0F14]">{inr(p.price)}</span>
          )}
        </div>
      ),
    },
    {
      key: 'stock', header: 'Stock',
      render: (p) => {
        const total = p.variants.reduce((s, v) => s + v.sizes.reduce((s2, sz) => s2 + sz.stock, 0), 0);
        return (
          <span className={`text-sm font-semibold ${total === 0 ? 'text-red-600' : total < 20 ? 'text-orange-600' : 'text-[#0F0F14]'}`}>
            {total}
          </span>
        );
      },
    },
    {
      key: 'status', header: 'Status',
      render: (p) => (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
          p.flags.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-[#F0F0F2] text-[#6B6B76]'
        }`}>
          {p.flags.isActive ? 'Live' : 'Hidden'}
        </span>
      ),
    },
    {
      key: 'actions', header: '',
      className: 'text-right',
      render: (p) => (
        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => handleToggleActive(p)}
            title={p.flags.isActive ? 'Hide' : 'Publish'}
            className="w-8 h-8 rounded-lg hover:bg-[#F7F7F9] flex items-center justify-center text-[#6B6B76]"
          >
            {p.flags.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
          <Link
            to={`/admin/products/${p.id}`}
            className="w-8 h-8 rounded-lg hover:bg-[#F7F7F9] flex items-center justify-center text-[#6B6B76] hover:text-[#7C3AED]"
            title="Edit"
          >
            <Pencil className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setToDelete(p)}
            title="Delete"
            className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-[#6B6B76] hover:text-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <DataTable<Product>
        columns={columns}
        rows={filtered}
        loading={loading}
        searchable
        searchPlaceholder="Search by name, SKU, or category…"
        onSearch={setSearch}
        onRowClick={(p) => navigate(`/admin/products/${p.id}`)}
        actions={
          <Link
            to="/admin/products/new"
            className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#F97316] text-white font-semibold text-sm hover:opacity-95"
          >
            <Plus className="w-4 h-4" /> Add Product
          </Link>
        }
      />

      <ConfirmDialog
        open={!!toDelete}
        title={`Delete "${toDelete?.name}"?`}
        message="This permanently removes the product and all its images. This cannot be undone."
        confirmLabel="Delete product"
        destructive
        onCancel={() => setToDelete(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
};
