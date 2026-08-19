# SETHIZZZ Backend + Admin — Setup Guide

Windows / PowerShell / VS Code / Claude Code friendly. Follow in order. **~15 minutes end to end.**

---

## PART 1 — Extract into your project

Extract the zip and copy every file/folder to the root of your `sethizzz` project, **merging with existing folders** (overwrites `package.json` and `src/App.tsx` intentionally; adds `src/admin/`, `src/lib/`, `src/hooks/`, `src/types/`, `src/context/AuthContext.tsx`, plus Firebase config files).

Nothing in `src/pages/`, `src/components/`, `src/data/mockData.ts`, `src/utils/` is touched — those stay as-is.

---

## PART 2 — Install dependencies

```powershell
cd C:\Users\PC\OneDrive\Desktop\sethizzz    # or wherever your project lives
npm install
```

New deps installed: `firebase`, `react-hot-toast`, `browser-image-compression`, `firebase-tools` (dev), `tsx` (dev, if not already there).

---

## PART 3 — Create the Firebase project

1. Go to <https://console.firebase.google.com>
2. **Add project** → name it `sethizzz` → disable Google Analytics if you want (you can always enable later) → Create.
3. Inside the project → left sidebar → **Build** → enable these:
   - **Authentication** → Get started → **Sign-in method** → enable **Email/Password**, **Google**, and **Phone**
   - **Firestore Database** → Create database → **Production mode** → pick region **`asia-south1` (Mumbai)** → Enable
   - **Storage** → Get started → **Production mode** → Same region → Done

4. Sidebar → **Project settings** (gear icon) → scroll down → **Your apps** → click the **Web** `</>` icon → register app name `sethizzz-web` → Register → copy the config values shown.

---

## PART 4 — Fill in `.env.local`

In your project root:

```powershell
copy .env.example .env.local
notepad .env.local
```

Paste in your Firebase config values. Also set `VITE_BOOTSTRAP_ADMIN_EMAIL` to your admin email (e.g. `prakash@sethizzz.com`). Save.

For Razorpay: leave `VITE_RAZORPAY_KEY_ID` as the test placeholder for now — real orders + payments come in Phase 2.

---

## PART 5 — Create your admin user in Firebase Auth

**IMPORTANT: Do this BEFORE seeding, or the seeder will fail.**

Firebase Console → **Authentication** → **Users** tab → **Add user** →
- Email: (same as `VITE_BOOTSTRAP_ADMIN_EMAIL` you set above)
- Password: (pick a strong one — you'll use this to sign in to `/admin/login`)
- Add user.

---

## PART 6 — Deploy security rules

```powershell
npx firebase login
npx firebase use --add
# Select your sethizzz project when prompted; alias it "default"

npm run firebase:deploy:rules
npm run firebase:deploy:indexes
```

You should see "Deploy complete!" for both. If indexes take a while — that's normal, they build in the background.

---

## PART 7 — Seed the database

```powershell
npm run seed
```

The seeder will:
1. Ask for your admin password (from Part 5)
2. Sign in as your bootstrap admin
3. Create the `admins/{yourUid}` doc with role `admin`
4. Import all products from `mockData.ts` → Firestore
5. Import categories, testimonials, coupons, site content, settings

You should see `🎉 All done.` at the end.

**Note on images:** the seeder imports products with their original Unsplash URLs (from mockData). That's fine for now — as you edit products in admin, upload real photos and those Unsplash URLs get replaced.

---

## PART 8 — Run it

```powershell
npm run dev
```

Open <http://localhost:3000/admin/login>, sign in with your admin email + password. You should land on the Dashboard.

Try:
- **Products** → click any product → change price → Save → refresh storefront → change reflected
- **Products → Add Product** → fill fields → upload images from your PC → save
- **Categories → Add Category** → upload an image → save → shows up in shop navigation

---

## PART 9 — Wire the frontend to Firestore (2-line diff × 3 files)

Right now the storefront still reads from `mockData.ts`. To make it read from Firestore (so admin edits show up on the live site), make this exact change in **each of these 3 files**:

### `src/pages/HomePage.tsx`

**Line ~19**, replace:
```tsx
import { products, categories, homeTestimonials } from '../data/mockData';
```
with:
```tsx
import { useStorefrontData } from '../hooks/useStorefrontData';
```

Then **inside the `HomePage` component**, near the top of the function body (before any usage of `products` or `categories`), add:
```tsx
const { products, categories, homeTestimonials } = useStorefrontData();
```

### `src/pages/ShopPage.tsx`

Line ~5, replace:
```tsx
import { products, categories, Product } from '../data/mockData';
```
with:
```tsx
import { Product } from '../data/mockData';
import { useStorefrontData } from '../hooks/useStorefrontData';
```

Inside the `ShopPage` component (top of function body), add:
```tsx
const { products, categories } = useStorefrontData();
```

### `src/pages/ProductDetailPage.tsx`

Same pattern — replace the top-level `import { products } from '../data/mockData'` with the hook, and add `const { products } = useStorefrontData();` at the top of the component.

The `useStorefrontData` hook falls back to `mockData` automatically if Firestore is empty, so nothing breaks during migration.

---

## PART 10 — Deploy to Vercel

Your Vercel project is already set up. Just push to GitHub:

```powershell
git add .
git commit -m "feat: backend + admin panel v1"
git push
```

Vercel will auto-deploy. Then add your `VITE_FIREBASE_*` env vars in **Vercel → Project → Settings → Environment Variables** (same values as `.env.local`). Redeploy once.

---

## What's in this package

**Working now (Phase 1):**
- ✅ Firebase project setup + security rules + indexes
- ✅ Auth: email/password admin sign-in (Google + phone ready for customers in phase 2)
- ✅ Admin panel at `/admin/*` with sidebar, topbar, mobile-responsive
- ✅ **Dashboard** — live stat cards (revenue, orders, products, categories), recent orders, low-stock alerts, quick actions
- ✅ **Products** — full CRUD, list with search, edit page with color variants + per-variant image upload + per-size stock management, publish/unpublish, delete
- ✅ **Categories** — full CRUD, image upload, reorder, activate/deactivate
- ✅ Seeder script (`npm run seed`)
- ✅ Frontend data compat hook (`useStorefrontData`) — 2-line frontend integration

**Scaffolded (Phase 2 build — placeholders exist so nav works):**
- 🚧 Orders (list, detail, status updates, tracking, invoice)
- 🚧 Customers (list, detail, order history)
- 🚧 Reviews (moderation)
- 🚧 Coupons (full editor — SAVE10, WELCOME15, SETHI20, FIRSTDROP already seeded and active)
- 🚧 Inventory (central variant stock table)
- 🚧 Analytics (revenue/orders/funnel charts)
- 🚧 Site Content (hero, deal banner, carousels, testimonials, footer, FAQ editors)
- 🚧 Settings (shipping, tax, contact, notifications, admin user management)

**Also for Phase 2:**
- 🚧 Frontend Checkout wired to real orders (Razorpay + COD)
- 🚧 Frontend `/login` `/signup` pages (customer auth)
- 🚧 Frontend Account page showing real order history
- 🚧 Pincode auto-fill via India Post
- 🚧 Order confirmation emails + WhatsApp

---

## Troubleshooting

**"Missing or insufficient permissions"** in browser console → your rules haven't deployed yet, or you're not signed in as an admin. Re-run `npm run firebase:deploy:rules` and re-check the `admins/{yourUid}` doc exists in Firestore.

**Seeder fails with `auth/invalid-credential`** → password mismatch. Reset the user's password in Firebase Console → Authentication.

**Images upload but show broken** → check Storage rules deployed, and check the file in Firebase Console → Storage.

**`npm run seed` says "VITE_FIREBASE_API_KEY missing"** → `.env.local` not in project root, or `dotenv` didn't load. Confirm with `type .env.local` (PowerShell) that the file is there.

**Admin sidebar navigation looks broken on mobile** → hard-refresh, mobile menu button (☰) is at the top-left.

---

## Adding another admin later

Firebase Console → Authentication → Add user (their email + password) → then in Firestore Console → `admins` collection → Add document with ID = their auth UID and fields `{ email, name, role: 'admin' }` or `role: 'staff'`. The Settings page (Phase 2) will make this a click.

---

Any issues, holler.
