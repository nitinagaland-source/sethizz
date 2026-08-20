content = open('src/pages/ShopPage.tsx', encoding='utf-8').read()

# Replace mockData import - keep Product type, add hook import
content = content.replace(
    "import { products, categories, Product } from '../data/mockData';",
    "import type { Product } from '../data/mockData';\nimport { useStorefrontData } from '../hooks/useStorefrontData';"
)

# Find the component function opening and add the hook call after the first useState or const inside it
# We'll insert after the first line of the component body
# ShopPage likely starts with: export const ShopPage
# We'll add the hook call after the opening brace of the component

import re

# Add hook call at the start of the component body (after the first { of the component)
content = re.sub(
    r'(export (?:const|function) ShopPage[^{]*\{)',
    r'\1\n  const { products, categories } = useStorefrontData();',
    content
)

open('src/pages/ShopPage.tsx', 'w', encoding='utf-8').write(content)
print('Done - ShopPage wired to Firestore')
