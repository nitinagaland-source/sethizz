content = open('src/pages/HomePage.tsx', encoding='utf-8').read()

old_hero = '''      {/* 6.1 Hero Section (Full-Bleed Image Hero with Interactive Buttons) */}
      <section
        id="hero-banner-section"
        className="-mx-4 sm:mx-0 relative rounded-none sm:rounded-3xl overflow-hidden w-[calc(100%+2rem)] sm:w-full aspect-[4/5] sm:aspect-[2/1] md:aspect-[2.25/1] min-h-[400px] sm:min-h-[450px] md:min-h-[500px] lg:min-h-[540px] border-b sm:border border-black/10 shadow-2xl group"
      >
        {/* Desktop & Tablet Banner Image (hidden on mobile, visible from sm: 640px upwards) */}
        <img
          src={homeData?.hero?.image || "https://i.ibb.co/MDpsJXM0/aef7a6d5-ebf0-48fd-ac1c-b613a5eb061b.webp"}
          alt="SETHIZZZ - Redefine Everyday"
          referrerPolicy="no-referrer"
          className="hidden sm:block absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none"
        />

        {/* Mobile Banner Image (visible ONLY on mobile < 640px) */}
        <img
          src="https://i.ibb.co/jkNtKczx/d9113ca4-80e1-4b29-8076-92dba452b084.webp"
          alt="SETHIZZZ - Redefine Everyday Mobile"
          referrerPolicy="no-referrer"
          className="block sm:hidden absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none"
        />

        {/* Gradient scrim \u2014 only shown when Firestore hero content is set */}
        {(homeData?.hero?.title || homeData?.hero?.eyebrow) && (
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent pointer-events-none" />
        )}

        {/* Hero Text Overlay \u2014 fully controlled from admin Site Content */}
        {(homeData?.hero?.title || homeData?.hero?.eyebrow || homeData?.hero?.subtitle) && (
          <div className="absolute left-4 sm:left-8 md:left-14 top-1/2 -translate-y-[55%] z-10 max-w-[240px] sm:max-w-sm md:max-w-md">
            {homeData?.hero?.eyebrow && (
              <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-white/75 block mb-1.5 sm:mb-2">
                {homeData.hero.eyebrow}
              </span>
            )}
            {homeData?.hero?.title && (
              <h1 className="text-[1.6rem] sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-[1.05] mb-1.5 sm:mb-3">
                {homeData.hero.title}
              </h1>
            )}
            {homeData?.hero?.subtitle && (
              <p className="text-[10px] sm:text-sm text-white/80 leading-relaxed max-w-[200px] sm:max-w-xs">
                {homeData.hero.subtitle}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons placed lower down, centered in a clean single row */}'''

new_hero = '''      {/* 6.1 Hero Section \u2014 fully CMS-driven from admin Site Content */}
      <section
        id="hero-banner-section"
        className="-mx-4 sm:mx-0 relative rounded-none sm:rounded-3xl overflow-hidden w-[calc(100%+2rem)] sm:w-full aspect-[4/5] sm:aspect-[2/1] md:aspect-[2.25/1] min-h-[400px] sm:min-h-[450px] md:min-h-[500px] lg:min-h-[540px] border-b sm:border border-black/10 shadow-2xl group bg-zinc-950"
      >
        {/* Background image: Firestore-controlled. Defaults to ibb.co when no image is set in admin. */}
        {homeData?.hero?.image ? (
          <img
            src={homeData.hero.image}
            alt="SETHIZZZ Hero"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none"
          />
        ) : (
          <>
            <img
              src="https://i.ibb.co/MDpsJXM0/aef7a6d5-ebf0-48fd-ac1c-b613a5eb061b.webp"
              alt="SETHIZZZ - Redefine Everyday"
              referrerPolicy="no-referrer"
              className="hidden sm:block absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none"
            />
            <img
              src="https://i.ibb.co/jkNtKczx/d9113ca4-80e1-4b29-8076-92dba452b084.webp"
              alt="SETHIZZZ - Redefine Everyday Mobile"
              referrerPolicy="no-referrer"
              className="block sm:hidden absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none"
            />
          </>
        )}

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
            {homeData?.hero?.subtitle || 'Timeless pieces. Modern edge.\nBuilt for the way you move.'}
          </p>
        </div>

        {/* Action Buttons placed lower down, centered in a clean single row */}'''

if old_hero in content:
    content = content.replace(old_hero, new_hero)
    print('Hero section replaced successfully')
else:
    print('ERROR: Could not find exact hero section to replace')
    print('Attempting partial match...')
    # Try to find just the section tag
    if 'id="hero-banner-section"' in content:
        print('Found hero-banner-section id - manual edit needed')
    else:
        print('hero-banner-section not found at all')

open('src/pages/HomePage.tsx', 'w', encoding='utf-8').write(content)
