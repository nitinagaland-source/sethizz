// src/admin/components/StatCard.tsx
import React from 'react';
import { TrendingUp, TrendingDown, type LucideIcon } from 'lucide-react';

interface Props {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: number; label?: string };
  accent?: 'purple' | 'orange' | 'green' | 'blue';
}

const ACCENTS = {
  purple: 'from-[#7C3AED]/10 to-[#7C3AED]/5 text-[#7C3AED]',
  orange: 'from-[#F97316]/10 to-[#F97316]/5 text-[#F97316]',
  green: 'from-emerald-500/10 to-emerald-500/5 text-emerald-600',
  blue: 'from-blue-500/10 to-blue-500/5 text-blue-600',
};

export const StatCard: React.FC<Props> = ({ label, value, icon: Icon, trend, accent = 'purple' }) => {
  return (
    <div className="bg-white border border-[#EEEEF0] rounded-2xl p-5">
      <div className="flex items-start justify-between">
        <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${ACCENTS[accent]} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <div className={`text-xs font-bold flex items-center gap-0.5 ${
            trend.value >= 0 ? 'text-emerald-600' : 'text-red-600'
          }`}>
            {trend.value >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(trend.value)}%
          </div>
        )}
      </div>
      <div className="mt-4">
        <div className="text-2xl font-black text-[#0F0F14] tracking-tight">{value}</div>
        <div className="text-xs font-medium text-[#6B6B76] mt-0.5">{label}</div>
        {trend?.label && <div className="text-[10px] text-[#9A9AA5] mt-0.5">{trend.label}</div>}
      </div>
    </div>
  );
};
