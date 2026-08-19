// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import type { Admin, Customer } from '../types';

interface AuthContextValue {
  user: User | null;
  customer: Customer | null;
  admin: Admin | null;
  loading: boolean;
  isAdmin: boolean;
  isStaff: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null, customer: null, admin: null, loading: true, isAdmin: false, isStaff: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (!u) {
        setCustomer(null);
        setAdmin(null);
        setLoading(false);
        return;
      }
      // Fetch admin doc in parallel with customer doc
      const [adminSnap, customerSnap] = await Promise.all([
        getDoc(doc(db, 'admins', u.uid)),
        getDoc(doc(db, 'customers', u.uid)),
      ]);
      setAdmin(adminSnap.exists() ? ({ id: u.uid, ...(adminSnap.data() as Omit<Admin, 'id'>) }) : null);
      setCustomer(customerSnap.exists() ? ({ id: u.uid, ...(customerSnap.data() as Omit<Customer, 'id'>) }) : null);
      setLoading(false);
    });
    return unsub;
  }, []);

  return (
    <AuthContext.Provider value={{
      user, customer, admin, loading,
      isAdmin: admin?.role === 'admin',
      isStaff: admin?.role === 'staff' || admin?.role === 'admin',
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
