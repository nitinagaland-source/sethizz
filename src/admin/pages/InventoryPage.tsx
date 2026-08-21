// src/admin/pages/InventoryPage.tsx
import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { Product } from '../../types';
import { AlertTriangle, Download, Loader2, Search, Check, X } from 'lucide-react';

type StockRow = {
  productId: string; productName: string; slug: string;
  colorId: string; colorName: string; colorHex: string;
  size: string; stock: number;
  variantIdx: number; sizeIdx: number;
};

type Filter = 'all' | 'low' | 'out';

export const InventoryPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [editing, setEditing] = useState<string | null>(null); // key: productId-colorId-size
  const [editVal, setEditVal] = useState<number>(0);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'products'), snap => {
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
      setLoading(false);
    });
    return unsub;
  }, []);

  const rows: StockRow[] = [];
  products.forEach(p => {
    (p.variants || []).forEach((v, vi) => {
      (v.sizes || []).forEach((s, si) => {
        rows.push({
          productId: p.id, productName: p.name, slug: p.slug,
          colorId: v.colorId, colorName: v.colorName, colorHex: v.colorHex,
          size: s.name, stock: s.stock,
          variantIdx: vi, sizeIdx: si,
        });
      });
    });
  });

  const filtered = rows.filter(r => {
    const matchSearch = !search || r.productName.toLowerCase().includes(search.toLowerCase()) || r.colorName.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || (filter === 'low' && r.stock > 0 && r.stock <= 5) || (filter === 'out' && r.stock === 0);
    return matchSearch && matchFilter;
  });

  const key = (r: StockRow) => `${r.productId}-${r.colorId}-${r.size}`;

  const startEdit = (r: StockRow) => { setEditing(key(r)); setEditVal(r.stock); };
  const cancelEdit = () => { setEditing(null); };

  const saveStock = async (r: StockRow) => {
    setSaving(key(r));
    const product = products.find(p => p.id === r.productId);
    if (!product) { setSaving(null); return; }
    const variants = product.variants.map((v, vi) => {
      if (vi !== r.variantIdx) return v;
      return {
        ...v,
        sizes: v.sizes.map((s, si) => si === r.sizeIdx ? { ...s, stock: editVal } : s),
      };
    });
    await updateDoc(doc(db, 'products', r.productId), { variants });
    setSaving(null); setEditing(null);
  };

  const exportCSV = () => {
    const csvRows = [['Product', 'Color', 'Size', 'Stock', 'Status']];
    filtered.forEach(r => csvRows.push([r.productName, r.colorName, r.size, String(r.stock), r.stock === 0 ? 'Out' : r.stock <= 5 ? 'Low' : 'OK']));
    const csv = csvRows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'inventory.csv'; a.click();
  };

  const outCount = rows.filter(r => r.stock === 0).length;
  const lowCount = rows.filter(r => r.stock > 0 && r.stock <= 5).length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Inventory</h1>
          <p className="text-sm text-zinc-500 mt-0.5">{rows.length} variants · <span className="text-red-600 font-medium">{outCount} sold out</span> · <span className="text-amber-600 font-medium">{lowCount} low stock</span></p>
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 h-9 px-4 rounded-lg border border-zinc-200 text-sm font-semibold text-zinc-700 hover:bg-zinc-50">
          <Download size={15} /> Export CSV
        </button>
      </div>

      {(outCount > 0 || lowCount > 0) && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
          <AlertTriangle size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-amber-800">{outCount} variants sold out, {lowCount} variants with 5 or fewer units remaining.</p>
        </div>
      )}

      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-1">
          {(['all', 'low', 'out'] as Filter[]).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${filter === f ? 'bg-[#7C3AED] text-white' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}>
              {f === 'low' ? 'Low Stock' : f === 'out' ? 'Sold Out' : 'All'}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input className="w-full h-9 pl-8 pr-3 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30" placeholder="Search product or color..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40"><Loader2 className="animate-spin text-[#7C3AED]" size={24} /></div>
      ) : (
        <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 border-b border-zinc-200">
              <tr>
                {['Product', 'Color', 'Size', 'Stock', 'Status', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filtered.map(r => {
                const k = key(r);
                const isEditing = editing === k;
                const isSaving = saving === k;
                return (
                  <tr key={k} className={`transition-colors ${r.stock === 0 ? 'bg-red-50/50' : r.stock <= 5 ? 'bg-amber-50/50' : 'hover:bg-zinc-50'}`}>
                    <td className="px-4 py-3 font-medium text-zinc-800">{r.productName}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border border-zinc-200 flex-shrink-0" style={{ backgroundColor: r.colorHex }} />
                        <span className="text-zinc-600">{r.colorName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs font-bold text-zinc-700 bg-zinc-100/50">{r.size}</td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input type="number" min={0} value={editVal} onChange={e => setEditVal(Number(e.target.value))}
                          className="w-20 h-8 px-2 rounded-lg border border-[#7C3AED] text-sm text-center font-bold focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30"
                          autoFocus onKeyDown={e => e.key === 'Enter' && saveStock(r)} />
                      ) : (
                        <span className={`font-bold text-base ${r.stock === 0 ? 'text-red-600' : r.stock <= 5 ? 'text-amber-600' : 'text-zinc-800'}`}>{r.stock}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {r.stock === 0 ? <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-semibold">Sold Out</span>
                        : r.stock <= 5 ? <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">Low</span>
                        : <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">OK</span>}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => saveStock(r)} disabled={isSaving} className="flex items-center gap-1 h-7 px-2.5 rounded-lg bg-[#7C3AED] text-white text-xs font-semibold disabled:opacity-60">
                            {isSaving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />} Save
                          </button>
                          <button onClick={cancelEdit} className="h-7 px-2 rounded-lg border border-zinc-200 text-xs text-zinc-600 hover:bg-zinc-50"><X size={12} /></button>
                        </div>
                      ) : (
                        <button onClick={() => startEdit(r)} className="h-7 px-2.5 rounded-lg border border-zinc-200 text-xs font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900">Edit</button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-zinc-400">No inventory rows found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
