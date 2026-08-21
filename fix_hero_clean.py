import re

# ── FIX 1: HomePage.tsx ──────────────────────────────────────────────
hp = open('src/pages/HomePage.tsx', encoding='utf-8').read()

# Add heroTertiaryCTALabel variable (after heroSecondaryCTALabel line)
hp = hp.replace(
    "  const heroSecondaryCTALabel = homeData?.hero?.secondaryCta?.label || 'New Arrivals';",
    "  const heroSecondaryCTALabel = homeData?.hero?.secondaryCta?.label || 'New Arrivals';\n  const heroTertiaryCTALabel  = homeData?.hero?.tertiaryCta?.label  || 'Watch Story';"
)

# Wire Watch Story button label
hp = hp.replace(
    "              <span>Watch Story</span>",
    "              <span>{heroTertiaryCTALabel}</span>"
)

# Remove gradient scrim divs and text overlay block (the whole block we added)
# Find and remove the section between the mobile image closing tag and Action Buttons comment
old_overlay = '''
        {/* Always-on gradient scrim for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />

        {/* Hero text \u2014 always from Firestore with fallbacks. Change via admin > Site Content > Hero Banner */}
        <div className="absolute left-4 sm:left-8 md:left-14 top-1/2 -translate-y-[55%] z-10 max-w-[240px] sm:max-w-sm md:max-w-md">
          {(homeData?.hero?.eyebrow) && (
            <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-white/70 block mb-1.5 sm:mb-2">
              {homeData.hero.eyebrow}
            </span>
          )}
          <h1 className="text-[1.75rem] sm:text-4xl md:text-[3.25rem] font-black tracking-tight text-white leading-[1.05] mb-2 sm:mb-3">
            {homeData?.hero?.title || 'Redefine Everyday.'}
          </h1>
          <p className="text-[10px] sm:text-[13px] text-white/75 leading-relaxed max-w-[200px] sm:max-w-xs">
            {homeData?.hero?.subtitle || 'Timeless pieces. Modern edge.\\nBuilt for the way you move.'}
          </p>
        </div>

        {/* Action Buttons placed lower down, centered in a clean single row */}'''

new_no_overlay = '''
        {/* Action Buttons placed lower down, centered in a clean single row */}'''

if old_overlay in hp:
    hp = hp.replace(old_overlay, new_no_overlay)
    print('Overlay removed from HomePage.tsx')
else:
    print('WARNING: Overlay block not found - may need manual check')

open('src/pages/HomePage.tsx', 'w', encoding='utf-8').write(hp)
print('HomePage.tsx done')

# ── FIX 2: SiteContentPage.tsx ───────────────────────────────────────
sc = open('src/admin/pages/SiteContentPage.tsx', encoding='utf-8').read()

# Update hero state - remove eyebrow/title/subtitle, add tertiaryCtaLabel/Href
sc = sc.replace(
    "const [hero, setHero] = useState({ title: '', subtitle: '', eyebrow: '', image: '', primaryCtaLabel: '', primaryCtaHref: '', secondaryCtaLabel: '', secondaryCtaHref: '' });",
    "const [hero, setHero] = useState({ image: '', primaryCtaLabel: '', primaryCtaHref: '', secondaryCtaLabel: '', secondaryCtaHref: '', tertiaryCtaLabel: '' });"
)

# Update seed from Firestore - remove eyebrow/title/subtitle, add tertiary
sc = sc.replace(
    """    const h = homeContent.hero || {};
    setHero({
      title: h.title || '',
      subtitle: h.subtitle || '',
      eyebrow: h.eyebrow || '',
      image: h.image || '',
      primaryCtaLabel: h.primaryCta?.label || '',
      primaryCtaHref: h.primaryCta?.href || '',
      secondaryCtaLabel: h.secondaryCta?.label || '',
      secondaryCtaHref: h.secondaryCta?.href || '',
    });""",
    """    const h = homeContent.hero || {};
    setHero({
      image: h.image || '',
      primaryCtaLabel: h.primaryCta?.label || '',
      primaryCtaHref: h.primaryCta?.href || '',
      secondaryCtaLabel: h.secondaryCta?.label || '',
      secondaryCtaHref: h.secondaryCta?.href || '',
      tertiaryCtaLabel: h.tertiaryCta?.label || '',
    });"""
)

# Update saveHero to include tertiary CTA and remove eyebrow/title/subtitle
sc = sc.replace(
    """    await mergeHome({
      hero: {
        eyebrow: hero.eyebrow,
        title: hero.title,
        subtitle: hero.subtitle,
        image: hero.image,
        primaryCta: { label: hero.primaryCtaLabel, href: hero.primaryCtaHref },
        secondaryCta: { label: hero.secondaryCtaLabel, href: hero.secondaryCtaHref },
      },
    });""",
    """    await mergeHome({
      hero: {
        image: hero.image,
        primaryCta: { label: hero.primaryCtaLabel, href: hero.primaryCtaHref },
        secondaryCta: { label: hero.secondaryCtaLabel, href: hero.secondaryCtaHref },
        tertiaryCta: { label: hero.tertiaryCtaLabel, href: '' },
      },
    });"""
)

# Replace hero tab fields grid - remove eyebrow/title/subtitle, add tertiary CTA
old_hero_grid = '''          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Eyebrow text">
              <input className={inputCls} value={hero.eyebrow} onChange={e => setHero(p => ({ ...p, eyebrow: e.target.value }))} placeholder="e.g. NEW COLLECTION" />
            </Field>
            <Field label="Image URL">
              <input className={inputCls} value={hero.image} onChange={e => setHero(p => ({ ...p, image: e.target.value }))} placeholder="https://..." />
            </Field>
            <Field label="Title">
              <input className={inputCls} value={hero.title} onChange={e => setHero(p => ({ ...p, title: e.target.value }))} placeholder="Redefine Everyday" />
            </Field>
            <Field label="Subtitle">
              <input className={inputCls} value={hero.subtitle} onChange={e => setHero(p => ({ ...p, subtitle: e.target.value }))} placeholder="Premium quality..." />
            </Field>
            <Field label="Primary CTA label">
              <input className={inputCls} value={hero.primaryCtaLabel} onChange={e => setHero(p => ({ ...p, primaryCtaLabel: e.target.value }))} placeholder="Shop Collection" />
            </Field>
            <Field label="Primary CTA link">
              <input className={inputCls} value={hero.primaryCtaHref} onChange={e => setHero(p => ({ ...p, primaryCtaHref: e.target.value }))} placeholder="/shop" />
            </Field>
            <Field label="Secondary CTA label">
              <input className={inputCls} value={hero.secondaryCtaLabel} onChange={e => setHero(p => ({ ...p, secondaryCtaLabel: e.target.value }))} placeholder="New Arrivals" />
            </Field>
            <Field label="Secondary CTA link">
              <input className={inputCls} value={hero.secondaryCtaHref} onChange={e => setHero(p => ({ ...p, secondaryCtaHref: e.target.value }))} placeholder="/shop?sort=newest" />
            </Field>
          </div>'''

new_hero_grid = '''          <p className="text-xs text-zinc-500">The banner image has the headline text built in. Use these fields to control the image and the 3 buttons below it.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Banner image URL">
              <input className={inputCls} value={hero.image} onChange={e => setHero(p => ({ ...p, image: e.target.value }))} placeholder="https://i.ibb.co/..." />
            </Field>
            <div className="hidden sm:block" />
            <Field label="Button 1 label (Shop Collection)">
              <input className={inputCls} value={hero.primaryCtaLabel} onChange={e => setHero(p => ({ ...p, primaryCtaLabel: e.target.value }))} placeholder="Shop Collection" />
            </Field>
            <Field label="Button 1 link">
              <input className={inputCls} value={hero.primaryCtaHref} onChange={e => setHero(p => ({ ...p, primaryCtaHref: e.target.value }))} placeholder="/shop" />
            </Field>
            <Field label="Button 2 label (New Arrivals)">
              <input className={inputCls} value={hero.secondaryCtaLabel} onChange={e => setHero(p => ({ ...p, secondaryCtaLabel: e.target.value }))} placeholder="New Arrivals" />
            </Field>
            <Field label="Button 2 link">
              <input className={inputCls} value={hero.secondaryCtaHref} onChange={e => setHero(p => ({ ...p, secondaryCtaHref: e.target.value }))} placeholder="/shop?sort=newest" />
            </Field>
            <Field label="Button 3 label (Watch Story)">
              <input className={inputCls} value={hero.tertiaryCtaLabel} onChange={e => setHero(p => ({ ...p, tertiaryCtaLabel: e.target.value }))} placeholder="Watch Story" />
            </Field>
          </div>'''

if old_hero_grid in sc:
    sc = sc.replace(old_hero_grid, new_hero_grid)
    print('SiteContentPage hero tab updated')
else:
    print('WARNING: Hero grid not found exactly - check SiteContentPage.tsx manually')

open('src/admin/pages/SiteContentPage.tsx', 'w', encoding='utf-8').write(sc)
print('SiteContentPage.tsx done')
print('\nAll done. Run: git add . && git commit -m "fix: clean hero overlay, wire 3 buttons, simplify admin hero tab" && git push')
