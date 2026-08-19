// src/admin/AdminGuard.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AdminGuard: React.FC<{ children: React.ReactNode; requireFullAdmin?: boolean }> = ({
  children, requireFullAdmin,
}) => {
  const { user, admin, loading, isStaff, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F7F9]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[#6B6B76]">Verifying access…</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/admin/login" state={{ from: location }} replace />;
  if (!admin) return <Navigate to="/admin/login" state={{ error: 'not_authorized' }} replace />;
  if (!isStaff) return <Navigate to="/admin/login" state={{ error: 'not_authorized' }} replace />;
  if (requireFullAdmin && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F7F9] p-6">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-[#EEEEF0] text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-orange-50 flex items-center justify-center mb-4">
            <span className="text-2xl">🔒</span>
          </div>
          <h2 className="text-xl font-bold text-[#0F0F14] mb-2">Admin access required</h2>
          <p className="text-sm text-[#6B6B76]">
            This page is restricted. Your account has <strong>staff</strong> access — contact a full admin to unlock.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
