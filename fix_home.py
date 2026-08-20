content = open('src/pages/HomePage.tsx', encoding='utf-8').read()

content = content.replace(
    "import { products, categories, homeTestimonials } from '../data/mockData';",
    "import { useStorefrontData } from '../hooks/useStorefrontData';"
)

content = content.replace(
    "const navigate = useNavigate();",
    "const navigate = useNavigate();\n  const { products, categories, homeTestimonials } = useStorefrontData();"
)

open('src/pages/HomePage.tsx', 'w', encoding='utf-8').write(content)
print('Done - HomePage wired to Firestore')
