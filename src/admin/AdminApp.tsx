// src/admin/AdminApp.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AdminGuard } from './AdminGuard';
import { AdminLayout } from './AdminLayout';
import { DashboardPage } from './pages/DashboardPage';
import { ProductsListPage } from './pages/ProductsListPage';
import { ProductEditPage } from './pages/ProductEditPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { OrdersListPage } from './pages/OrdersListPage';
import { CustomersPage } from './pages/CustomersPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { CouponsPage } from './pages/CouponsPage';
import { InventoryPage } from './pages/InventoryPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { SiteContentPage } from './pages/SiteContentPage';

export const AdminApp: React.FC = () => {
  return (
    <AdminGuard>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<ProductsListPage />} />
          <Route path="products/new" element={<ProductEditPage />} />
          <Route path="products/:id" element={<ProductEditPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="orders" element={<OrdersListPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="reviews" element={<ReviewsPage />} />
          <Route path="coupons" element={<CouponsPage />} />
          <Route path="inventory" element={<InventoryPage />} />

          {/* Admin-only routes (staff blocked with lockout screen) */}
          <Route path="analytics" element={<AdminGuard requireFullAdmin><AnalyticsPage /></AdminGuard>} />
          <Route path="content" element={<AdminGuard requireFullAdmin><SiteContentPage /></AdminGuard>} />
          <Route path="settings" element={<AdminGuard requireFullAdmin><SettingsPage /></AdminGuard>} />
        </Route>
      </Routes>
    </AdminGuard>
  );
};
