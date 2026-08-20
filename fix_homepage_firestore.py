content = open('src/pages/HomePage.tsx', encoding='utf-8').read()

# 1. Add useHomeContent import (only if not already there)
if "useHomeContent" not in content:
    content = content.replace(
        "import { useStorefrontData } from '../hooks/useStorefrontData';",
        "import { useStorefrontData } from '../hooks/useStorefrontData';\nimport { useHomeContent } from '../hooks/useSiteContent';"
    )

# 2. Add hook + all derived vars (only if not already there)
if "homeData" not in content:
    content = content.replace(
        "const { products, categories, homeTestimonials } = useStorefrontData();",
        """const { products, categories, homeTestimonials } = useStorefrontData();
  const { content: homeData } = useHomeContent();
  const heroPrimaryCTALabel   = homeData?.hero?.primaryCta?.label   || 'Shop Collection';
  const heroSecondaryCTALabel = homeData?.hero?.secondaryCta?.label || 'New Arrivals';
  const dealTitle    = homeData?.dealBanner?.title       || 'Deals of the Day';
  const dealViewAll  = homeData?.dealBanner?.viewAllLink || '/shop?filter=deals';
  const offerEyebrow = homeData?.specialOffer?.eyebrow   || 'Special Offer';
  const offerTitle   = homeData?.specialOffer?.title     || 'Up to 50% Off';
  const offerSubtitle= homeData?.specialOffer?.subtitle  || 'On select heavyweight tees, French terry hoodies, and jackets. Limited quantities only!';
  const offerCTA     = homeData?.specialOffer?.ctaText   || 'Shop the Sale';
  const offerCTALink = homeData?.specialOffer?.ctaLink   || '/shop?filter=deals';
  const offerBg      = homeData?.specialOffer?.image     || 'https://i.ibb.co/VWbngKy2/e9c9bbb3-9f38-433f-83c0-baa3400205e6.png';
  const nlTitle  = homeData?.newsletter?.title      || 'Join the SETHIZZZ Club';
  const nlBody   = homeData?.newsletter?.body       || 'Get 10% off your first order, plus early access to limited edition seasonal drops.';
  const nlCoupon = homeData?.newsletter?.couponCode || 'SAVE10';"""
    )

# 3. Hero primary CTA label
content = content.replace("<span>Shop Collection</span>", "<span>{heroPrimaryCTALabel}</span>")

# 4. Hero secondary CTA label
content = content.replace(
    "<span>New Arrivals</span>\n            </Link>",
    "<span>{heroSecondaryCTALabel}</span>\n            </Link>"
)

# 5. Deal banner title
content = content.replace("Deals of the Day\n            </h2>", "{dealTitle}\n            </h2>")

# 6. Deal banner View All link
content = content.replace(
    'to="/shop?filter=deals"\n            className="text-[11.5px] sm:text-xs font-bold text-zinc-600',
    'to={dealViewAll}\n            className="text-[11.5px] sm:text-xs font-bold text-zinc-600'
)

# 7. Special offer eyebrow
content = content.replace("\n            Special Offer\n          </span>", "\n            {offerEyebrow}\n          </span>")

# 8. Special offer background image
content = content.replace(
    'src="https://i.ibb.co/VWbngKy2/e9c9bbb3-9f38-433f-83c0-baa3400205e6.png"',
    'src={offerBg}'
)

# 9. Special offer title
content = content.replace('Up to <span className="text-[#FB923C]">50% Off</span>', '{offerTitle}')

# 10. Special offer subtitle
content = content.replace(
    "On select heavyweight tees,<br />\n            French terry hoodies, and jackets.<br />\n            Limited quantities only!",
    "{offerSubtitle}"
)

# 11. Special offer CTA text
content = content.replace("<span>Shop the Sale</span>", "<span>{offerCTA}</span>")

# 12. Special offer CTA link
content = content.replace(
    'to="/shop?filter=deals"\n            className="mt-5 sm:mt-6 inline-flex',
    'to={offerCTALink}\n            className="mt-5 sm:mt-6 inline-flex'
)

# 13. Newsletter title
content = content.replace(
    '>Join the <span className="text-[#FB923C]">SETHIZZZ Club</span></h2>',
    '>{nlTitle}</h2>'
)

# 14. Newsletter body
content = content.replace(
    'Get 10% off your first order with code <strong className="text-white">SAVE10</strong>, plus early access to limited edition seasonal drops.',
    '{nlBody} Use code <strong className="text-white">{nlCoupon}</strong>.'
)

# 15. Newsletter subscribed confirmation
content = content.replace(
    'You\'re in! Use coupon <strong className="text-white">SAVE10</strong> at checkout.',
    'You\'re in! Use coupon <strong className="text-white">{nlCoupon}</strong> at checkout.'
)

open('src/pages/HomePage.tsx', 'w', encoding='utf-8').write(content)
print('Done - HomePage fully wired to Firestore content')
