import re

content = open('src/pages/ProductDetailPage.tsx', encoding='utf-8').read()

# Replace mockData import with hook import
content = content.replace(
    "import { products } from '../data/mockData';",
    "import { useStorefrontData } from '../hooks/useStorefrontData';"
)

# Add hook call at start of component body
content = re.sub(
    r'(export (?:const|function) ProductDetailPage[^{]*\{)',
    r'\1\n  const { products } = useStorefrontData();',
    content
)

open('src/pages/ProductDetailPage.tsx', 'w', encoding='utf-8').write(content)
print('Done - ProductDetailPage wired to Firestore')
