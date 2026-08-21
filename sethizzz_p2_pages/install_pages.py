import shutil, os

pages_dir = 'src/admin/pages'
files = [
    'CouponsPage.tsx',
    'OrdersListPage.tsx',
    'InventoryPage.tsx',
    'ReviewsPage.tsx',
    'CustomersPage.tsx',
    'AnalyticsPage.tsx',
    'SettingsPage.tsx',
]

script_dir = os.path.dirname(os.path.abspath(__file__))

for f in files:
    src = os.path.join(script_dir, f)
    dst = os.path.join(pages_dir, f)
    if os.path.exists(src):
        shutil.copy2(src, dst)
        print(f'Installed: {f}')
    else:
        print(f'MISSING: {f} - not found in {script_dir}')

# Now update AdminApp.tsx to import from real files instead of StubPages
adminapp = open('src/admin/AdminApp.tsx', encoding='utf-8').read()

# Replace the StubPages import block with real imports
old_import = '''import {
  OrdersListPage, CustomersPage, ReviewsPage, CouponsPage,
  InventoryPage, AnalyticsPage, SettingsPage,
} from './pages/StubPages';'''

new_import = '''import { OrdersListPage } from './pages/OrdersListPage';
import { CustomersPage } from './pages/CustomersPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { CouponsPage } from './pages/CouponsPage';
import { InventoryPage } from './pages/InventoryPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';'''

if old_import in adminapp:
    adminapp = adminapp.replace(old_import, new_import)
    open('src/admin/AdminApp.tsx', 'w', encoding='utf-8').write(adminapp)
    print('AdminApp.tsx updated - all pages imported from real files')
else:
    print('WARNING: Could not find StubPages import block in AdminApp.tsx')
    print('Current imports may already be updated, or check AdminApp.tsx manually')

print('\nDone! Run: git add . && git commit -m "feat: build all P2 admin pages" && git push')
