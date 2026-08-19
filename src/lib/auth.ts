// src/lib/auth.ts
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as fbSignOut,
  updateProfile,
  sendPasswordResetEmail,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type User,
  type ConfirmationResult,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';
import type { Admin, Customer } from '../types';

/* ---------- Customer auth ---------- */

export async function signInCustomer(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  await touchCustomerLogin(cred.user);
  return cred.user;
}

export async function signUpCustomer(email: string, password: string, name: string) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  if (name) await updateProfile(cred.user, { displayName: name });

  const customerDoc: Omit<Customer, 'id'> = {
    name: name || cred.user.displayName || '',
    email: cred.user.email || email,
    phone: cred.user.phoneNumber || '',
    addresses: [],
    wishlist: [],
    verifiedMember: false,
    createdAt: serverTimestamp() as unknown as Date,
    lastLogin: serverTimestamp() as unknown as Date,
  };
  await setDoc(doc(db, 'customers', cred.user.uid), customerDoc);
  return cred.user;
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  const cred = await signInWithPopup(auth, provider);
  await ensureCustomerDoc(cred.user);
  return cred.user;
}

export async function resetPassword(email: string) {
  return sendPasswordResetEmail(auth, email);
}

export function signOut() {
  return fbSignOut(auth);
}

async function ensureCustomerDoc(user: User) {
  const ref = doc(db, 'customers', user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      name: user.displayName || '',
      email: user.email || '',
      phone: user.phoneNumber || '',
      avatar: user.photoURL || '',
      addresses: [],
      wishlist: [],
      verifiedMember: false,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
    });
  } else {
    await setDoc(ref, { lastLogin: serverTimestamp() }, { merge: true });
  }
}

async function touchCustomerLogin(user: User) {
  await setDoc(doc(db, 'customers', user.uid), { lastLogin: serverTimestamp() }, { merge: true });
}

/* ---------- Phone (OTP) auth ---------- */

export function setupRecaptcha(containerId: string) {
  return new RecaptchaVerifier(auth, containerId, { size: 'invisible' });
}

export async function sendOtp(phoneE164: string, verifier: RecaptchaVerifier): Promise<ConfirmationResult> {
  return signInWithPhoneNumber(auth, phoneE164, verifier);
}

/* ---------- Admin auth ---------- */

export async function signInAdmin(email: string, password: string): Promise<Admin> {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const adminSnap = await getDoc(doc(db, 'admins', cred.user.uid));
  if (!adminSnap.exists()) {
    await fbSignOut(auth);
    throw new Error('Your account is not authorized to access the admin panel.');
  }
  const data = adminSnap.data() as Omit<Admin, 'id'>;
  // Update lastLogin
  await setDoc(doc(db, 'admins', cred.user.uid), { lastLogin: serverTimestamp() }, { merge: true });
  return { id: cred.user.uid, ...data };
}

export async function fetchAdminDoc(uid: string): Promise<Admin | null> {
  const snap = await getDoc(doc(db, 'admins', uid));
  if (!snap.exists()) return null;
  return { id: uid, ...(snap.data() as Omit<Admin, 'id'>) };
}
