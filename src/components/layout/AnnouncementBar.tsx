// src/components/layout/AnnouncementBar.tsx
import React from 'react';
import { Sparkles } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="bg-[#0F0F14] text-white text-[11px] font-semibold py-2 px-4 tracking-wider text-center flex items-center justify-center gap-2 select-none">
      <Sparkles size={12} className="text-[#A78BFA] animate-pulse" />
      <span>FREE SHIPPING ON ₹1,499+ · COD AVAILABLE · UPI ACCEPTED · MADE IN INDIA</span>
      <Sparkles size={12} className="text-[#A78BFA] animate-pulse" />
    </div>
  );
};
