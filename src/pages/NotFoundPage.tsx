// src/pages/NotFoundPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="py-24 text-center max-w-md mx-auto space-y-6">
      <div className="text-6xl font-extrabold text-[#7C3AED]">404</div>
      <div className="space-y-2">
        <h1 className="text-2xl font-extrabold text-[#0F0F14]">Page Not Found</h1>
        <p className="text-sm text-[#52525B] leading-relaxed">
          The page you are looking for might have been moved or doesn’t exist.
        </p>
      </div>
      <div className="flex items-center justify-center gap-3">
        <Link
          to="/"
          className="h-12 px-6 rounded-full bg-[#0F0F14] text-white text-sm font-semibold inline-flex items-center gap-2 hover:bg-[#27272A] transition-colors shadow-sm"
        >
          <Home size={16} /> Go Home
        </Link>
        <Link
          to="/shop"
          className="h-12 px-6 rounded-full bg-white text-[#0F0F14] text-sm font-semibold border border-[#E4E4E7] inline-flex items-center gap-2 hover:border-[#0F0F14] transition-colors"
        >
          Browse Shop <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};
