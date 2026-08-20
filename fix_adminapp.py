content = open('src/admin/AdminApp.tsx', encoding='utf-8').read()

# Remove SiteContentPage from StubPages import
content = content.replace(
    '  OrdersListPage, CustomersPage, ReviewsPage, CouponsPage,\n  InventoryPage, AnalyticsPage, SiteContentPage, SettingsPage,\n} from \'./pages/StubPages\';',
    '  OrdersListPage, CustomersPage, ReviewsPage, CouponsPage,\n  InventoryPage, AnalyticsPage, SettingsPage,\n} from \'./pages/StubPages\';\nimport { SiteContentPage } from \'./pages/SiteContentPage\';'
)

open('src/admin/AdminApp.tsx', 'w', encoding='utf-8').write(content)
print('Done - AdminApp now imports real SiteContentPage')
