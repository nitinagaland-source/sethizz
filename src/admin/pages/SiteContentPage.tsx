// src/admin/pages/SiteContentPage.tsx
import React, { useEffect, useState } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useHomeContent, useFooterContent } from '../../hooks/useSiteContent';
import type { HomeContent, FooterContent, Testimonial, FooterLink } from '../../types';
import {
  Image, FileText, Gift, Star, Mail, Link as LinkIcon,
  Save, Plus, Trash2, ChevronDown, ChevronUp, Loader2, CheckCircle2,
} from 'lucide-react';

type Tab = 'hero' | 'deal' | 'offer' | 'testimonials' | 'newsletter' | 'footer';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'hero', label: 'Hero Banner', icon: <Image size={15} /> },
  { id: 'deal', label: 'Deal Banner', icon: <Gift size={15} /> },
  { id: 'offer', label: 'Special Offer', icon: <Gift size={15} /> },
  { id: 'testimonials', label: 'Testimonials', icon: <Star size={15} /> },
  { id: 'newsletter', label: 'Newsletter', icon: <Mail size={15} /> },
  { id: 'footer', label: 'Footer', icon: <LinkIcon size={15} /> },
];

function SaveButton({ saving, saved, onClick }: { saving: boolean; saved: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={saving}
      className="flex items-center gap-2 h-9 px-5 rounded-lg bg-[#7C3AED] text-white text-sm font-semibold hover:bg-[#6D28D9] disabled:opacity-60 transition-all"
    >
      {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <CheckCircle2 size={14} /> : <Save size={14} />}
      {saving ? 'Saving...' : saved ? 'Saved!' : 'Save'}
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-zinc-600 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full h-9 px-3 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED]";
const textareaCls = "w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] resize-none";

export const SiteContentPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('hero');
  const { content: homeContent, loading } = useHomeContent();
  const footerContent = useFooterContent();

  // ── Hero state ──
  const [hero, setHero] = useState({ title: '', subtitle: '', eyebrow: '', image: '', primaryCtaLabel: '', primaryCtaHref: '', secondaryCtaLabel: '', secondaryCtaHref: '' });
  const [heroSaving, setHeroSaving] = useState(false);
  const [heroSaved, setHeroSaved] = useState(false);

  // ── Deal Banner state ──
  const [deal, setDeal] = useState({ title: '', endsAt: '', viewAllLink: '' });
  const [dealSaving, setDealSaving] = useState(false);
  const [dealSaved, setDealSaved] = useState(false);

  // ── Special Offer state ──
  const [offer, setOffer] = useState({ eyebrow: '', title: '', subtitle: '', ctaText: '', ctaLink: '', image: '' });
  const [offerSaving, setOfferSaving] = useState(false);
  const [offerSaved, setOfferSaved] = useState(false);

  // ── Testimonials state ──
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [testimonialsExpanded, setTestimonialsExpanded] = useState<string | null>(null);
  const [testimonialsSaving, setTestimonialsSaving] = useState(false);
  const [testimonialsSaved, setTestimonialsSaved] = useState(false);

  // ── Newsletter state ──
  const [newsletter, setNewsletter] = useState({ title: '', body: '', couponCode: '', footerTitle: '', footerBody: '' });
  const [newsletterSaving, setNewsletterSaving] = useState(false);
  const [newsletterSaved, setNewsletterSaved] = useState(false);

  // ── Footer state ──
  const [footer, setFooter] = useState<FooterContent>({ about: '', hqLocation: '', shopLinks: [], helpLinks: [], socialLinks: [], contactEmail: '', copyright: '' });
  const [footerSaving, setFooterSaving] = useState(false);
  const [footerSaved, setFooterSaved] = useState(false);

  // Seed state from Firestore
  useEffect(() => {
    if (!homeContent) return;
    const h = homeContent.hero || {};
    setHero({
      title: h.title || '',
      subtitle: h.subtitle || '',
      eyebrow: h.eyebrow || '',
      image: h.image || '',
      primaryCtaLabel: h.primaryCta?.label || '',
      primaryCtaHref: h.primaryCta?.href || '',
      secondaryCtaLabel: h.secondaryCta?.label || '',
      secondaryCtaHref: h.secondaryCta?.href || '',
    });
    const d = homeContent.dealBanner || {};
    let endsAtStr = '';
    if (d.endsAt) {
      const dt = typeof d.endsAt === 'string' ? new Date(d.endsAt) : (d.endsAt as any).toDate ? (d.endsAt as any).toDate() : new Date(d.endsAt as any);
      endsAtStr = dt.toISOString().slice(0, 16);
    }
    setDeal({ title: d.title || '', endsAt: endsAtStr, viewAllLink: d.viewAllLink || '' });
    const o = homeContent.specialOffer || {};
    setOffer({ eyebrow: o.eyebrow || '', title: o.title || '', subtitle: o.subtitle || '', ctaText: o.ctaText || '', ctaLink: o.ctaLink || '', image: o.image || '' });
    setTestimonials(homeContent.testimonials || []);
    const n = homeContent.newsletter || {};
    setNewsletter({ title: n.title || '', body: n.body || '', couponCode: n.couponCode || '', footerTitle: n.footerTitle || '', footerBody: n.footerBody || '' });
  }, [homeContent]);

  useEffect(() => {
    if (!footerContent) return;
    setFooter({
      about: footerContent.about || '',
      hqLocation: footerContent.hqLocation || '',
      shopLinks: footerContent.shopLinks || [],
      helpLinks: footerContent.helpLinks || [],
      socialLinks: footerContent.socialLinks || [],
      contactEmail: footerContent.contactEmail || '',
      copyright: footerContent.copyright || '',
    });
  }, [footerContent]);

  // ── Save helpers ──
  async function mergeHome(patch: Partial<HomeContent>) {
    const snap = await getDoc(doc(db, 'site_content', 'home'));
    const existing = snap.exists() ? snap.data() : {};
    await setDoc(doc(db, 'site_content', 'home'), { ...existing, ...patch }, { merge: true });
  }

  async function saveHero() {
    setHeroSaving(true);
    await mergeHome({
      hero: {
        eyebrow: hero.eyebrow,
        title: hero.title,
        subtitle: hero.subtitle,
        image: hero.image,
        primaryCta: { label: hero.primaryCtaLabel, href: hero.primaryCtaHref },
        secondaryCta: { label: hero.secondaryCtaLabel, href: hero.secondaryCtaHref },
      },
    });
    setHeroSaving(false); setHeroSaved(true); setTimeout(() => setHeroSaved(false), 2500);
  }

  async function saveDeal() {
    setDealSaving(true);
    await mergeHome({ dealBanner: { title: deal.title, endsAt: deal.endsAt, viewAllLink: deal.viewAllLink, featuredProductIds: homeContent?.dealBanner?.featuredProductIds || [] } });
    setDealSaving(false); setDealSaved(true); setTimeout(() => setDealSaved(false), 2500);
  }

  async function saveOffer() {
    setOfferSaving(true);
    await mergeHome({ specialOffer: { ...offer } });
    setOfferSaving(false); setOfferSaved(true); setTimeout(() => setOfferSaved(false), 2500);
  }

  async function saveTestimonials() {
    setTestimonialsSaving(true);
    await mergeHome({ testimonials });
    setTestimonialsSaving(false); setTestimonialsSaved(true); setTimeout(() => setTestimonialsSaved(false), 2500);
  }

  async function saveNewsletter() {
    setNewsletterSaving(true);
    await mergeHome({ newsletter: { ...newsletter } });
    setNewsletterSaving(false); setNewsletterSaved(true); setTimeout(() => setNewsletterSaved(false), 2500);
  }

  async function saveFooter() {
    setFooterSaving(true);
    await setDoc(doc(db, 'site_content', 'footer'), { ...footer }, { merge: true });
    setFooterSaving(false); setFooterSaved(true); setTimeout(() => setFooterSaved(false), 2500);
  }

  // ── Testimonial helpers ──
  function addTestimonial() {
    const newT: Testimonial = { id: Date.now().toString(), name: '', city: '', rating: 5, title: '', body: '', avatar: '' };
    setTestimonials(prev => [newT, ...prev]);
    setTestimonialsExpanded(newT.id);
  }

  function updateTestimonial(id: string, field: keyof Testimonial, value: any) {
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
  }

  function deleteTestimonial(id: string) {
    setTestimonials(prev => prev.filter(t => t.id !== id));
  }

  // ── Footer link helpers ──
  function addFooterLink(type: 'shopLinks' | 'helpLinks' | 'socialLinks') {
    setFooter(prev => ({ ...prev, [type]: [...prev[type], { label: '', href: '' }] }));
  }

  function updateFooterLink(type: 'shopLinks' | 'helpLinks' | 'socialLinks', idx: number, field: 'label' | 'href', value: string) {
    setFooter(prev => {
      const links = [...prev[type]];
      links[idx] = { ...links[idx], [field]: value };
      return { ...prev, [type]: links };
    });
  }

  function removeFooterLink(type: 'shopLinks' | 'helpLinks' | 'socialLinks', idx: number) {
    setFooter(prev => ({ ...prev, [type]: prev[type].filter((_, i) => i !== idx) }));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={24} className="animate-spin text-[#7C3AED]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Site Content</h1>
        <p className="text-sm text-zinc-500 mt-0.5">Edit everything on the storefront — changes go live instantly.</p>
      </div>

      {/* Tab bar */}
      <div className="flex flex-wrap gap-1.5 border-b border-zinc-200 pb-0">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-t-lg border-b-2 transition-all ${
              activeTab === tab.id
                ? 'border-[#7C3AED] text-[#7C3AED] bg-purple-50'
                : 'border-transparent text-zinc-500 hover:text-zinc-700'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── HERO ── */}
      {activeTab === 'hero' && (
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-zinc-800">Hero Banner</h2>
            <SaveButton saving={heroSaving} saved={heroSaved} onClick={saveHero} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          </div>
          {hero.image && (
            <div>
              <p className="text-xs text-zinc-400 mb-1.5">Preview</p>
              <img src={hero.image} alt="hero preview" className="w-full max-h-48 object-cover rounded-xl border border-zinc-200" />
            </div>
          )}
        </div>
      )}

      {/* ── DEAL BANNER ── */}
      {activeTab === 'deal' && (
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-zinc-800">Deal Banner</h2>
            <SaveButton saving={dealSaving} saved={dealSaved} onClick={saveDeal} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Section title">
              <input className={inputCls} value={deal.title} onChange={e => setDeal(p => ({ ...p, title: e.target.value }))} placeholder="Deals of the Day" />
            </Field>
            <Field label="Countdown ends at">
              <input className={inputCls} type="datetime-local" value={deal.endsAt} onChange={e => setDeal(p => ({ ...p, endsAt: e.target.value }))} />
            </Field>
            <Field label="View all link">
              <input className={inputCls} value={deal.viewAllLink} onChange={e => setDeal(p => ({ ...p, viewAllLink: e.target.value }))} placeholder="/shop?filter=deals" />
            </Field>
          </div>
          <p className="text-xs text-zinc-400">Featured deal products come from the products with "isDeal" flag — set that per-product in Products admin.</p>
        </div>
      )}

      {/* ── SPECIAL OFFER ── */}
      {activeTab === 'offer' && (
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-zinc-800">Special Offer Card</h2>
            <SaveButton saving={offerSaving} saved={offerSaved} onClick={saveOffer} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Eyebrow">
              <input className={inputCls} value={offer.eyebrow} onChange={e => setOffer(p => ({ ...p, eyebrow: e.target.value }))} placeholder="Special Offer" />
            </Field>
            <Field label="Title">
              <input className={inputCls} value={offer.title} onChange={e => setOffer(p => ({ ...p, title: e.target.value }))} placeholder="Up to 50% Off" />
            </Field>
            <Field label="CTA button text">
              <input className={inputCls} value={offer.ctaText} onChange={e => setOffer(p => ({ ...p, ctaText: e.target.value }))} placeholder="Shop the Sale" />
            </Field>
            <Field label="CTA link">
              <input className={inputCls} value={offer.ctaLink} onChange={e => setOffer(p => ({ ...p, ctaLink: e.target.value }))} placeholder="/shop?filter=deals" />
            </Field>
            <Field label="Background image URL">
              <input className={inputCls} value={offer.image} onChange={e => setOffer(p => ({ ...p, image: e.target.value }))} placeholder="https://..." />
            </Field>
          </div>
          <Field label="Subtitle">
            <textarea className={textareaCls} rows={3} value={offer.subtitle} onChange={e => setOffer(p => ({ ...p, subtitle: e.target.value }))} placeholder="On select heavyweight tees..." />
          </Field>
          {offer.image && (
            <div>
              <p className="text-xs text-zinc-400 mb-1.5">Preview</p>
              <img src={offer.image} alt="offer preview" className="w-full max-h-40 object-cover rounded-xl border border-zinc-200" />
            </div>
          )}
        </div>
      )}

      {/* ── TESTIMONIALS ── */}
      {activeTab === 'testimonials' && (
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-zinc-800">Testimonials ({testimonials.length})</h2>
            <div className="flex gap-2">
              <button onClick={addTestimonial} className="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-zinc-200 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition-all">
                <Plus size={14} /> Add
              </button>
              <SaveButton saving={testimonialsSaving} saved={testimonialsSaved} onClick={saveTestimonials} />
            </div>
          </div>

          <div className="space-y-3">
            {testimonials.map((t, idx) => (
              <div key={t.id} className="border border-zinc-200 rounded-xl overflow-hidden">
                <button
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-zinc-50 transition-all text-left"
                  onClick={() => setTestimonialsExpanded(prev => prev === t.id ? null : t.id)}
                >
                  <span className="text-sm font-semibold text-zinc-700">{t.name || `Testimonial ${idx + 1}`}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={e => { e.stopPropagation(); deleteTestimonial(t.id); }} className="text-red-400 hover:text-red-600 p-1">
                      <Trash2 size={13} />
                    </button>
                    {testimonialsExpanded === t.id ? <ChevronUp size={14} className="text-zinc-400" /> : <ChevronDown size={14} className="text-zinc-400" />}
                  </div>
                </button>
                {testimonialsExpanded === t.id && (
                  <div className="border-t border-zinc-100 p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Name">
                      <input className={inputCls} value={t.name} onChange={e => updateTestimonial(t.id, 'name', e.target.value)} placeholder="Rahul Sharma" />
                    </Field>
                    <Field label="City">
                      <input className={inputCls} value={t.city} onChange={e => updateTestimonial(t.id, 'city', e.target.value)} placeholder="Mumbai" />
                    </Field>
                    <Field label="Rating (1-5)">
                      <input className={inputCls} type="number" min={1} max={5} value={t.rating} onChange={e => updateTestimonial(t.id, 'rating', Number(e.target.value))} />
                    </Field>
                    <Field label="Avatar URL">
                      <input className={inputCls} value={t.avatar || ''} onChange={e => updateTestimonial(t.id, 'avatar', e.target.value)} placeholder="https://..." />
                    </Field>
                    <Field label="Review title">
                      <input className={inputCls} value={t.title} onChange={e => updateTestimonial(t.id, 'title', e.target.value)} placeholder="Best quality tee I've owned" />
                    </Field>
                    <div className="sm:col-span-2">
                      <Field label="Review body">
                        <textarea className={textareaCls} rows={3} value={t.body} onChange={e => updateTestimonial(t.id, 'body', e.target.value)} placeholder="The fabric quality is incredible..." />
                      </Field>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {testimonials.length === 0 && (
              <p className="text-sm text-zinc-400 text-center py-6">No testimonials yet. Click Add to create one.</p>
            )}
          </div>
        </div>
      )}

      {/* ── NEWSLETTER ── */}
      {activeTab === 'newsletter' && (
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-zinc-800">Newsletter Section</h2>
            <SaveButton saving={newsletterSaving} saved={newsletterSaved} onClick={saveNewsletter} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Section title">
              <input className={inputCls} value={newsletter.title} onChange={e => setNewsletter(p => ({ ...p, title: e.target.value }))} placeholder="Join the SETHIZZZ Club" />
            </Field>
            <Field label="Coupon code">
              <input className={inputCls} value={newsletter.couponCode} onChange={e => setNewsletter(p => ({ ...p, couponCode: e.target.value }))} placeholder="SAVE10" />
            </Field>
          </div>
          <Field label="Body text">
            <textarea className={textareaCls} rows={3} value={newsletter.body} onChange={e => setNewsletter(p => ({ ...p, body: e.target.value }))} placeholder="Get 10% off your first order..." />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Footer note title">
              <input className={inputCls} value={newsletter.footerTitle} onChange={e => setNewsletter(p => ({ ...p, footerTitle: e.target.value }))} placeholder="No spam, ever." />
            </Field>
            <Field label="Footer note body">
              <input className={inputCls} value={newsletter.footerBody} onChange={e => setNewsletter(p => ({ ...p, footerBody: e.target.value }))} placeholder="Unsubscribe anytime." />
            </Field>
          </div>
        </div>
      )}

      {/* ── FOOTER ── */}
      {activeTab === 'footer' && (
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-zinc-800">Footer</h2>
            <SaveButton saving={footerSaving} saved={footerSaved} onClick={saveFooter} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Contact email">
              <input className={inputCls} value={footer.contactEmail} onChange={e => setFooter(p => ({ ...p, contactEmail: e.target.value }))} placeholder="hello@sethizzz.com" />
            </Field>
            <Field label="HQ location">
              <input className={inputCls} value={footer.hqLocation} onChange={e => setFooter(p => ({ ...p, hqLocation: e.target.value }))} placeholder="Dimapur, Nagaland" />
            </Field>
            <Field label="Copyright text">
              <input className={inputCls} value={footer.copyright} onChange={e => setFooter(p => ({ ...p, copyright: e.target.value }))} placeholder="2026 SETHIZZZ. All rights reserved." />
            </Field>
          </div>

          <Field label="About text">
            <textarea className={textareaCls} rows={3} value={footer.about} onChange={e => setFooter(p => ({ ...p, about: e.target.value }))} placeholder="Premium heavyweight streetwear..." />
          </Field>

          {(['shopLinks', 'helpLinks', 'socialLinks'] as const).map(type => (
            <div key={type}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-zinc-700 capitalize">{type.replace('Links', ' Links')}</h3>
                <button onClick={() => addFooterLink(type)} className="flex items-center gap-1 text-xs text-[#7C3AED] hover:underline font-semibold">
                  <Plus size={12} /> Add link
                </button>
              </div>
              <div className="space-y-2">
                {footer[type].map((link, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      className={inputCls}
                      placeholder="Label"
                      value={link.label}
                      onChange={e => updateFooterLink(type, idx, 'label', e.target.value)}
                    />
                    <input
                      className={inputCls}
                      placeholder="URL"
                      value={link.href}
                      onChange={e => updateFooterLink(type, idx, 'href', e.target.value)}
                    />
                    <button onClick={() => removeFooterLink(type, idx)} className="text-red-400 hover:text-red-600 flex-shrink-0">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                {footer[type].length === 0 && <p className="text-xs text-zinc-400">No links yet.</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
