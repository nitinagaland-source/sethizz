// src/admin/components/DataTable.tsx
import React from 'react';
import { Search, Inbox } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  className?: string;
  width?: string;
}

interface Props<T> {
  columns: Column<T>[];
  rows: T[];
  loading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (q: string) => void;
  emptyState?: React.ReactNode;
  actions?: React.ReactNode;
  onRowClick?: (row: T) => void;
}

export function DataTable<T>({
  columns, rows, loading, searchable, searchPlaceholder = 'Search…', onSearch,
  emptyState, actions, onRowClick,
}: Props<T>) {
  return (
    <div className="bg-white rounded-2xl border border-[#EEEEF0] overflow-hidden">
      {(searchable || actions) && (
        <div className="p-4 border-b border-[#EEEEF0] flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          {searchable && (
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B76]" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                onChange={(e) => onSearch?.(e.target.value)}
                className="w-full h-10 pl-10 pr-3 bg-[#F7F7F9] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#7C3AED] focus:bg-white"
              />
            </div>
          )}
          {actions}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#EEEEF0] bg-[#FAFAFB]">
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={`text-left font-semibold text-[10px] uppercase tracking-wider text-[#6B6B76] py-3 px-4 ${c.className || ''}`}
                  style={c.width ? { width: c.width } : undefined}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="border-b border-[#EEEEF0] last:border-b-0">
                  {columns.map((c) => (
                    <td key={c.key} className="py-4 px-4">
                      <div className="h-4 w-24 bg-[#F0F0F2] rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-16 text-center">
                  {emptyState || (
                    <div className="flex flex-col items-center gap-2 text-[#6B6B76]">
                      <Inbox className="w-8 h-8" />
                      <p className="text-sm">No records found</p>
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <tr
                  key={i}
                  onClick={() => onRowClick?.(row)}
                  className={`border-b border-[#EEEEF0] last:border-b-0 hover:bg-[#FAFAFB] transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                >
                  {columns.map((c) => (
                    <td key={c.key} className={`py-3 px-4 align-middle ${c.className || ''}`}>
                      {c.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
