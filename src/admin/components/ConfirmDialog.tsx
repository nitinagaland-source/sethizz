// src/admin/components/ConfirmDialog.tsx
import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface Props {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const ConfirmDialog: React.FC<Props> = ({
  open, title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel',
  destructive, onConfirm, onCancel, loading,
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
              destructive ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
            }`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-[#0F0F14] text-lg leading-tight">{title}</h3>
              <p className="mt-1.5 text-sm text-[#6B6B76] leading-relaxed">{message}</p>
            </div>
            <button onClick={onCancel} className="text-[#6B6B76] hover:text-[#0F0F14]">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="border-t border-[#EEEEF0] bg-[#FAFAFB] p-4 flex justify-end gap-2">
          <button
            onClick={onCancel}
            disabled={loading}
            className="h-10 px-4 rounded-xl text-sm font-semibold text-[#4A4A55] hover:bg-white transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`h-10 px-5 rounded-xl text-sm font-semibold text-white transition-colors disabled:opacity-70 ${
              destructive ? 'bg-red-600 hover:bg-red-700' : 'bg-[#7C3AED] hover:bg-[#6D28D9]'
            }`}
          >
            {loading ? 'Working…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
