content = open('src/pages/HomePage.tsx', encoding='utf-8').read()

# 1. Wire desktop hero image to Firestore
content = content.replace(
    'src="https://i.ibb.co/MDpsJXM0/aef7a6d5-ebf0-48fd-ac1c-b613a5eb061b.webp"',
    'src={homeData?.hero?.image || "https://i.ibb.co/MDpsJXM0/aef7a6d5-ebf0-48fd-ac1c-b613a5eb061b.webp"}'
)

# 2. Fix newsletter title - still hardcoded in JSX
content = content.replace(
    'Join the <span className="text-[#FB923C]">SETHIZZZ Club</span>',
    '{nlTitle}'
)

# 3. Add hero gradient scrim + text overlay AFTER the mobile image closing tag
#    (inserted before the buttons section)
hero_overlay = '''
        {/* Gradient scrim — only shown when Firestore hero content is set */}
        {(homeData?.hero?.title || homeData?.hero?.eyebrow) && (
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent pointer-events-none" />
        )}

        {/* Hero Text Overlay — fully controlled from admin Site Content */}
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

'''

content = content.replace(
    '          className="block sm:hidden absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none"\n        />\n\n        {/* Action Buttons',
    '          className="block sm:hidden absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none"\n        />\n' + hero_overlay + '        {/* Action Buttons'
)

open('src/pages/HomePage.tsx', 'w', encoding='utf-8').write(content)
print('Done - Hero wired + text overlay added + newsletter title fixed')
