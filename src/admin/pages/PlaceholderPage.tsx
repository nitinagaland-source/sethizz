// src/admin/pages/PlaceholderPage.tsx
// Renders a "Coming in Phase 2" scaffold for admin pages not yet built.
import React from 'react';
import { Construction } from 'lucide-react';

interface Props {
  title: string;
  description: string;
  plannedFeatures: string[];
}

export const PlaceholderPage: React.FC<Props> = ({ title, description, plannedFeatures }) => {
  return (
    <div className="bg-white border border-[#EEEEF0] rounded-2xl p-8 text-center max-w-2xl mx-auto">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-[#7C3AED]/10 to-[#F97316]/10 flex items-center justify-center mb-4">
        <Construction className="w-6 h-6 text-[#7C3AED]" />
      </div>
      <h2 className="text-xl font-bold text-[#0F0F14]">{title}</h2>
      <p className="text-sm text-[#6B6B76] mt-2 max-w-md mx-auto">{description}</p>
      <div className="mt-6 bg-[#FAFAFB] rounded-xl p-4 text-left max-w-md mx-auto">
        <div className="text-xs font-bold uppercase tracking-wider text-[#7C3AED] mb-2">Planned for this section</div>
        <ul className="space-y-1.5 text-sm text-[#4A4A55]">
          {plannedFeatures.map((f, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-[#7C3AED] font-bold">·</span> {f}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6 inline-block px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-bold uppercase tracking-wider">
        Phase 2 · Building next
      </div>
    </div>
  );
};
