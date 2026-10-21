import React, { useState, useEffect } from 'react';
import { Book, Testimonial, FAQItem, SiteSettings } from '../types';
import { BookCover3D } from '../components/BookCover3D';
import { trackEvent } from '../services/storage';
import {
  Star,
  Check,
  ChevronDown,
  ShieldCheck,
  Zap,
  ArrowRight,
  BookOpen,
  Mail,
  ExternalLink,
  Lock,
} from 'lucide-react';

interface BookLandingPageProps {
  book: Book;
  testimonials: Testimonial[];
  faqs: FAQItem[];
  settings: SiteSettings;
  onOpenLeadModal: () => void;
  onOpenLegal: (type: 'privacy' | 'terms' | 'refunds') => void;
}

export const BookLandingPage: React.FC<BookLandingPageProps> = ({
  book,
  testimonials,
  faqs,
  settings,
  onOpenLeadModal,
  onOpenLegal,
}) => {
  const [openPartIndex, setOpenPartIndex] = useState<number | null>(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Track page view and scroll tracking
  useEffect(() => {
    trackEvent(book.id, 'page_view');

    let tracked50 = false;
    let tracked90 = false;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollPosition / docHeight) * 100 : 0;

      // Show mobile sticky bar after scrolling past 400px
      setShowStickyBar(scrollPosition > 450);

      if (scrollPercent >= 50 && !tracked50) {
        tracked50 = true;
        trackEvent(book.id, 'scroll_50');
      }
      if (scrollPercent >= 90 && !tracked90) {
        tracked90 = true;
        trackEvent(book.id, 'scroll_90');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [book.id]);

  // Gumroad checkout handler with UTM forwarding
  const handleGumroadCheckout = (location: string) => {
    trackEvent(book.id, 'cta_click', location);

    let checkoutUrl = book.gumroad_url;
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source');
    const utmMedium = urlParams.get('utm_medium');
    const utmCampaign = urlParams.get('utm_campaign');

    const queryParts: string[] = [];
    if (utmSource) queryParts.push(`utm_source=${encodeURIComponent(utmSource)}`);
    if (utmMedium) queryParts.push(`utm_medium=${encodeURIComponent(utmMedium)}`);
    if (utmCampaign) queryParts.push(`utm_campaign=${encodeURIComponent(utmCampaign)}`);
    if (book.discount_code) queryParts.push(`discount_code=${encodeURIComponent(book.discount_code)}`);

    if (queryParts.length > 0) {
      checkoutUrl += (checkoutUrl.includes('?') ? '&' : '?') + queryParts.join('&');
    }

    // If Gumroad overlay script is loaded, trigger its custom overlay event or anchor
    if ((window as unknown as { GumroadOverlay?: { open: (url: string) => void } }).GumroadOverlay) {
      try {
        (window as unknown as { GumroadOverlay: { open: (url: string) => void } }).GumroadOverlay.open(checkoutUrl);
        return;
      } catch (err) {
        console.warn('Gumroad overlay fallback', err);
      }
    }

    // Direct fallback redirect
    window.open(checkoutUrl, '_blank', 'noopener,noreferrer');
  };

  // Section visibility helper
  const isSectionEnabled = (key: string) => {
    if (!book.sections_config) return true;
    const s = book.sections_config.find((item) => item.key === key);
    return s ? s.enabled : true;
  };

  const approvedTestimonials = testimonials.filter((t) => t.approved);
  const activeFaqs = faqs.filter((f) => f.enabled);

  return (
    <div id="top" className="relative min-h-screen bg-[#0A0F1C] text-[#F2F5FA] overflow-x-hidden">
      {/* 1. HERO SECTION (Above the fold) */}
      {isSectionEnabled('hero') && (
        <section className="relative pt-8 pb-16 sm:pt-14 sm:pb-24 border-b border-[#1E2A44] overflow-hidden">
          {/* Subtle Ambient Background Gradients */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[550px] bg-gradient-to-b from-[#2FD6A0]/8 via-transparent to-transparent blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Left Column: Core Value Proposition & Pricing */}
              <div className="lg:col-span-7 text-left space-y-6">
                {/* Series Line & Category */}
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#2FD6A0]">
                  <span>{book.hero_kicker || book.series_line || 'Jade Capital Field Guide'}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400">By {book.author_name}</span>
                </div>

                {/* Primary Benefit Headline */}
                <h1 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-white leading-[1.15] tracking-tight text-balance">
                  {book.hero_headline}
                </h1>

                {/* Subheadline */}
                <p className="text-base sm:text-lg text-[#9AA7BF] leading-relaxed max-w-2xl font-light">
                  {book.hero_subheadline}
                </p>

                {/* PRICING & PRICE OFF BADGE (Direct User Requirement) */}
                <div className="p-4 rounded-xl bg-[#111A2E] border border-[#1E2A44] inline-flex flex-col sm:flex-row sm:items-center gap-4 max-w-xl">
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#E3B94A] font-mono">
                      {book.sale_price}
                    </span>
                    <span className="text-base sm:text-lg text-slate-500 line-through font-mono">
                      {book.original_price}
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-[#2FD6A0]/15 text-[#2FD6A0] text-xs font-bold font-mono tracking-wide">
                      {book.discount_badge}
                    </span>
                  </div>

                  <div className="hidden sm:block w-[1px] h-8 bg-[#1E2A44]" />

                  <div className="text-xs text-slate-300 font-medium">
                    <span>Instant PDF & EPUB</span>
                    <span className="text-slate-500 block text-[11px]">30-Day Guarantee</span>
                  </div>
                </div>

                {/* PRIMARY CTA & ACTION STRIP */}
                <div className="space-y-3 pt-2">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <button
                      onClick={() => handleGumroadCheckout('hero')}
                      className="gumroad-button flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#E3B94A] hover:bg-[#CF9F30] text-slate-950 font-bold text-base sm:text-lg transition-all shadow-xl hover:shadow-[#E3B94A]/25 cursor-pointer"
                    >
                      <span>{book.cta_label}</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>

                    <button
                      onClick={onOpenLeadModal}
                      className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#111A2E] hover:bg-[#15233e] border border-[#1E2A44] hover:border-[#2FD6A0]/40 text-slate-200 text-sm font-medium transition-colors cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4 text-[#2FD6A0]" />
                      <span>{book.lead_magnet_cta || 'Read Chapter 1 Free'}</span>
                    </button>
                  </div>

                  {/* Micro-Copy */}
                  <p className="text-xs text-slate-400 flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-[#2FD6A0]" />
                    <span>{book.price_note}</span>
                  </p>
                </div>

                {/* Proof Strip */}
                <div className="pt-4 border-t border-[#1E2A44]/80 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-400">
                  <div className="flex items-center gap-1 text-[#E3B94A]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                    <span className="font-bold text-slate-200 ml-1">
                      {book.proof_rating_text || '4.9 / 5'}
                    </span>
                  </div>
                  <span>·</span>
                  <span>{book.proof_readers_count || '1,400+ Active Readers'}</span>
                  <span>·</span>
                  <span className="text-[#2FD6A0]">{book.proof_support_text || 'Direct Author Support'}</span>
                </div>
              </div>

              {/* Right Column: 3D Book Mockup */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <div className="relative">
                  <BookCover3D book={book} size="large" />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. "DOES THIS SOUND LIKE YOU?" (PAIN POINTS) */}
      {isSectionEnabled('pain_points') && book.pain_points?.length > 0 && (
        <section className="py-16 sm:py-24 border-b border-[#1E2A44] bg-[#0E1526]/50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-xs font-mono uppercase tracking-widest text-[#2FD6A0] font-semibold">
              {book.pain_points_kicker || 'The Reality Check'}
            </span>
            <h2 className="font-serif-heading text-3xl sm:text-4xl font-bold text-white mt-2 mb-4">
              {book.pain_points_title || 'Does This Sound Like You?'}
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base mb-12">
              {book.pain_points_subtitle ||
                'If you have ever found yourself staring at an ambiguous message and losing your frame, you are not alone.'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              {book.pain_points.map((point, idx) => (
                <div
                  key={idx}
                  className="p-5 sm:p-6 rounded-xl bg-[#111A2E] border border-[#1E2A44] hover:border-[#2FD6A0]/30 transition-all flex items-start gap-4"
                >
                  <span className="font-serif-heading text-2xl text-[#E3B94A] font-bold leading-none select-none">
                    “
                  </span>
                  <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-light">
                    {point}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <button
                onClick={() => handleGumroadCheckout('pain_points')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#E3B94A] hover:bg-[#CF9F30] text-slate-950 font-bold text-sm transition-all shadow-md cursor-pointer"
              >
                <span>{book.pain_points_cta || `End the overthinking loop — ${book.sale_price}`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 3. THE PROBLEM & PROMISE */}
      {isSectionEnabled('problem_promise') && (
        <section className="py-16 sm:py-24 border-b border-[#1E2A44] relative">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
            <div className="p-8 sm:p-12 rounded-2xl bg-gradient-to-br from-[#111A2E] to-[#0D1527] border border-[#1E2A44] relative overflow-hidden">
              <div className="w-12 h-1 bg-[#2FD6A0] mb-6 rounded-full" />

              <span className="text-[11px] font-mono uppercase tracking-widest text-[#2FD6A0] font-semibold block mb-2">
                {book.problem_promise_kicker || 'The Mental Shift'}
              </span>

              <h2 className="font-serif-heading text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight mb-6">
                {book.problem_promise_title}
              </h2>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-light mb-8">
                {book.problem_promise_text}
              </p>

              {/* Highlight Quote Block */}
              {book.problem_promise_quote && (
                <div className="p-6 rounded-xl bg-[#0A0F1C] border border-[#2FD6A0]/30 text-center sm:text-left">
                  <p className="font-serif-heading text-lg sm:text-xl font-bold text-[#E3B94A] italic">
                    “{book.problem_promise_quote}”
                  </p>
                </div>
              )}

              {/* Transformation Comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-8 border-t border-[#1E2A44]">
                <div className="p-4 rounded-lg bg-black/30 border border-[#1E2A44]">
                  <span className="text-xs font-mono uppercase text-[#F26D6D] font-bold block mb-1">
                    {book.problem_promise_from_title || 'From Anxiety:'}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-300">
                    {book.problem_promise_from_text ||
                      '"What did her text mean? Why is she taking 4 hours? What did I say wrong?"'}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-black/30 border border-[#2FD6A0]/40">
                  <span className="text-xs font-mono uppercase text-[#2FD6A0] font-bold block mb-1">
                    {book.problem_promise_to_title || 'To Quiet Frame:'}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-300">
                    {book.problem_promise_to_text ||
                      '"I know what I want. I observe behavioral patterns clearly. I know my next step."'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. WHAT'S INSIDE (CURRICULUM ACCORDION) */}
      {isSectionEnabled('whats_inside') && book.whats_inside?.length > 0 && (
        <section className="py-16 sm:py-24 border-b border-[#1E2A44] bg-[#0E1526]/40">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs font-mono uppercase tracking-widest text-[#2FD6A0] font-semibold">
                {book.whats_inside_kicker || 'Curriculum & Architecture'}
              </span>
              <h2 className="font-serif-heading text-3xl sm:text-4xl font-bold text-white mt-2 mb-3">
                {book.whats_inside_title || "What's Inside The Book"}
              </h2>
              <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
                {book.whats_inside_subtitle ||
                  `${book.whats_inside.length} structured Parts covering every stage from the initial message to holding your frame long term.`}
              </p>
            </div>

            <div className="space-y-3">
              {book.whats_inside.map((item, index) => {
                const isOpen = openPartIndex === index;
                return (
                  <div
                    key={index}
                    className="rounded-xl bg-[#111A2E] border border-[#1E2A44] overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setOpenPartIndex(isOpen ? null : index)}
                      className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-[#15233e] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xs font-mono font-bold text-[#E3B94A] px-2 py-0.5 rounded bg-[#E3B94A]/10 border border-[#E3B94A]/20 shrink-0">
                          {item.part}
                        </span>
                        <h3 className="font-serif-heading text-base sm:text-lg font-bold text-white truncate">
                          {item.title}
                        </h3>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-[#2FD6A0]' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-6 sm:px-6 sm:pb-6 pt-2 border-t border-[#1E2A44]/60 space-y-4">
                        {item.pull_quote && (
                          <p className="text-xs sm:text-sm text-[#2FD6A0] font-mono italic bg-[#0A0F1C] p-3 rounded-lg border border-[#2FD6A0]/20">
                            Core Rule: “{item.pull_quote}”
                          </p>
                        )}

                        <ul className="space-y-2">
                          {item.chapters.map((ch, chIdx) => (
                            <li
                              key={chIdx}
                              className="text-xs sm:text-sm text-slate-300 flex items-start gap-2.5"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-[#E3B94A] mt-1.5 shrink-0" />
                              <span>{ch}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={() => handleGumroadCheckout('whats_inside')}
                className="px-6 py-3 rounded-xl bg-[#E3B94A] hover:bg-[#CF9F30] text-slate-950 font-bold text-sm transition-all shadow-md cursor-pointer"
              >
                <span>{book.whats_inside_cta || `Unlock all ${book.whats_inside.length} Parts — ${book.sale_price}`}</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 5. KEY TAKEAWAYS */}
      {isSectionEnabled('takeaways') && book.takeaways?.length > 0 && (
        <section className="py-16 sm:py-24 border-b border-[#1E2A44]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs font-mono uppercase tracking-widest text-[#2FD6A0] font-semibold">
                {book.takeaways_kicker || 'Tangible Outcomes'}
              </span>
              <h2 className="font-serif-heading text-3xl sm:text-4xl font-bold text-white mt-2 mb-3">
                {book.takeaways_title || 'After Reading, You Will…'}
              </h2>
              <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
                {book.takeaways_subtitle ||
                  'No theory without application. Here is what shifts in your actual day-to-day dating behavior:'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {book.takeaways.map((takeaway, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-[#111A2E] border border-[#1E2A44] flex items-start gap-3.5 hover:border-[#2FD6A0]/40 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-[#2FD6A0]/15 flex items-center justify-center text-[#2FD6A0] shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-light">
                    {takeaway}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. FREE CHAPTER LEAD MAGNET CARD */}
      {isSectionEnabled('lead_magnet') && (
        <section className="py-16 sm:py-20 border-b border-[#1E2A44] bg-[#0C1424]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-[#111A2E] via-[#14233C] to-[#111A2E] border border-[#2FD6A0]/30 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 text-left">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#2FD6A0] font-bold">
                  {book.lead_magnet_kicker || 'Test-Drive Before You Buy'}
                </span>
                <h3 className="font-serif-heading text-2xl sm:text-3xl font-bold text-white">
                  {book.lead_magnet_title || 'Read Chapter 1 For Free'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed">
                  {book.lead_magnet_subtitle ||
                    'Download the sample chapter to experience the exact tone, psychological models, and field frameworks right now.'}
                </p>
              </div>

              <div className="shrink-0">
                <button
                  onClick={onOpenLeadModal}
                  className="w-full md:w-auto px-6 py-3.5 rounded-xl bg-[#2FD6A0] hover:bg-[#25B586] text-slate-950 font-bold text-sm transition-all shadow-lg hover:shadow-[#2FD6A0]/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span>{book.lead_magnet_cta || 'Send Me Chapter 1'}</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 7. TESTIMONIALS */}
      {isSectionEnabled('testimonials') && approvedTestimonials.length > 0 && (
        <section className="py-16 sm:py-24 border-b border-[#1E2A44] bg-[#0A0F1C]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs font-mono uppercase tracking-widest text-[#2FD6A0] font-semibold">
                {book.testimonials_kicker || 'Reader Feedback'}
              </span>
              <h2 className="font-serif-heading text-3xl sm:text-4xl font-bold text-white mt-2 mb-3">
                {book.testimonials_title || 'What Real Readers Are Saying'}
              </h2>
              <p className="text-xs text-slate-400">
                {book.testimonials_subtitle || 'Honest feedback from verified readers. No invented reviews.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {approvedTestimonials.map((t) => (
                <div
                  key={t.id}
                  className="p-6 rounded-xl bg-[#111A2E] border border-[#1E2A44] flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-1 text-[#E3B94A]">
                      {[...Array(t.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic font-light">
                      “{t.quote}”
                    </p>
                  </div>

                  <div className="pt-4 mt-6 border-t border-[#1E2A44]">
                    <p className="text-xs font-bold text-white">{t.name}</p>
                    <p className="text-[11px] text-slate-400">{t.descriptor}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. AUTHOR SECTION */}
      {isSectionEnabled('author') && (
        <section className="py-16 sm:py-24 border-b border-[#1E2A44] bg-[#0E1526]/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-8 sm:p-10 rounded-2xl bg-[#111A2E] border border-[#1E2A44] flex flex-col md:flex-row items-center gap-8 text-left">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden shrink-0 bg-gradient-to-br from-[#1E2A44] to-[#0A0F1C] border border-[#2FD6A0]/30 flex items-center justify-center relative shadow-xl">
                {book.author_photo_url || settings.author_photo_url ? (
                  <img
                    src={book.author_photo_url || settings.author_photo_url}
                    alt={book.author_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-4">
                    <span className="font-serif-heading text-3xl font-bold text-[#E3B94A]">
                      EKJ
                    </span>
                    <span className="block text-[9px] font-mono uppercase text-[#2FD6A0] mt-1">
                      Author
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-4 flex-1">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#2FD6A0] font-semibold">
                    {book.author_kicker || 'The Mind Behind The Framework'}
                  </span>
                  <h3 className="font-serif-heading text-2xl sm:text-3xl font-bold text-white mt-1">
                    {book.author_name}
                  </h3>
                  <p className="text-xs text-[#E3B94A] font-mono mt-0.5">
                    {book.author_brand_tag || `Brand: ${settings.brand_name} · @${settings.socials.instagram || 'the.jadecapital'}`}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                  {book.author_bio || settings.author_bio}
                </p>

                <div className="flex items-center gap-4 pt-2 text-xs text-slate-400">
                  <a
                    href={`https://instagram.com/${settings.socials.instagram}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#2FD6A0] transition-colors flex items-center gap-1"
                  >
                    <span>Instagram</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <span>·</span>
                  <a
                    href={`https://tiktok.com/@${settings.socials.tiktok}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#2FD6A0] transition-colors flex items-center gap-1"
                  >
                    <span>TikTok</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <span>·</span>
                  <a
                    href={`https://x.com/${settings.socials.x}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#2FD6A0] transition-colors flex items-center gap-1"
                  >
                    <span>X</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 9. OFFER & PRICING BLOCK */}
      {isSectionEnabled('offer') && (
        <section className="py-16 sm:py-24 border-b border-[#1E2A44] relative">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-xs font-mono uppercase tracking-widest text-[#2FD6A0] font-semibold">
              {book.offer_kicker || 'Instant Digital Package'}
            </span>
            <h2 className="font-serif-heading text-3xl sm:text-4xl font-bold text-white mt-2 mb-4">
              {book.offer_title || 'Everything You Get Today'}
            </h2>

            {/* Offer Box */}
            <div className="mt-8 p-8 sm:p-10 rounded-2xl bg-[#111A2E] border-2 border-[#E3B94A]/40 shadow-2xl text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#E3B94A] text-slate-950 text-[10px] font-mono font-bold uppercase tracking-wider py-1 px-4 rounded-bl-lg">
                Save {book.discount_badge}
              </div>

              <h3 className="font-serif-heading text-2xl font-bold text-white mb-2">
                {book.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mb-6 font-light">
                {book.subtitle}
              </p>

              {/* Includes List */}
              <div className="space-y-3 mb-8">
                {book.offer_includes?.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#2FD6A0]/15 flex items-center justify-center text-[#2FD6A0] shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="text-xs sm:text-sm text-slate-200">{item}</span>
                  </div>
                ))}
              </div>

              {/* Price Callout */}
              <div className="p-4 rounded-xl bg-[#0A0F1C] border border-[#1E2A44] flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <span className="text-xs text-slate-400 font-mono block">One-time payment:</span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl sm:text-4xl font-extrabold text-[#E3B94A] font-mono">
                      {book.sale_price}
                    </span>
                    <span className="text-base text-slate-500 line-through font-mono">
                      {book.original_price}
                    </span>
                    <span className="text-xs font-bold font-mono text-[#2FD6A0]">
                      {book.discount_badge}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-400 text-left sm:text-right">
                  <span className="block text-slate-300 font-medium">Digital Download</span>
                  <span>Instant Delivery via Gumroad</span>
                </div>
              </div>

              {/* Big Gold CTA */}
              <button
                onClick={() => handleGumroadCheckout('offer')}
                className="gumroad-button w-full py-4 px-8 rounded-xl bg-[#E3B94A] hover:bg-[#CF9F30] text-slate-950 font-bold text-base sm:text-lg transition-all shadow-xl hover:shadow-[#E3B94A]/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{book.cta_label}</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              {/* Guarantee Note */}
              {book.guarantee_text && (
                <div className="mt-6 pt-6 border-t border-[#1E2A44] flex items-start gap-3 text-xs text-slate-400">
                  <ShieldCheck className="w-5 h-5 text-[#2FD6A0] shrink-0" />
                  <p className="leading-relaxed">{book.guarantee_text}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 10. FAQ ACCORDION */}
      {isSectionEnabled('faqs') && activeFaqs.length > 0 && (
        <section className="py-16 sm:py-24 border-b border-[#1E2A44] bg-[#0E1526]/50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs font-mono uppercase tracking-widest text-[#2FD6A0] font-semibold">
                {book.faqs_kicker || 'Clear Answers'}
              </span>
              <h2 className="font-serif-heading text-3xl sm:text-4xl font-bold text-white mt-2 mb-3">
                {book.faqs_title || 'Frequently Asked Questions'}
              </h2>
            </div>

            <div className="space-y-3">
              {activeFaqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={faq.id}
                    className="rounded-xl bg-[#111A2E] border border-[#1E2A44] overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-[#15233e] transition-colors cursor-pointer"
                    >
                      <span className="text-sm sm:text-base font-semibold text-white">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-[#2FD6A0]' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 border-t border-[#1E2A44]/60">
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 11. FINAL CTA BAND */}
      {isSectionEnabled('final_cta') && (
        <section className="py-16 sm:py-24 bg-gradient-to-b from-[#0A0F1C] to-[#060912] border-b border-[#1E2A44] text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <h2 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
              {book.final_cta_title || 'Stop Decoding Her Texts. Start Knowing What To Do Next.'}
            </h2>
            <p className="text-base text-slate-400 max-w-xl mx-auto font-light">
              {book.final_cta_subtitle || `Get instant digital access to the full book, worksheets, and scorecards right now for only ${book.sale_price}.`}
            </p>

            <div className="pt-2">
              <button
                onClick={() => handleGumroadCheckout('final')}
                className="gumroad-button inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#E3B94A] hover:bg-[#CF9F30] text-slate-950 font-bold text-base sm:text-lg transition-all shadow-xl hover:shadow-[#E3B94A]/25 cursor-pointer"
              >
                <span>{book.final_cta_button || book.cta_label}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 12. FOOTER */}
      <footer className="py-12 bg-[#060A14] text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {settings.logo_url ? (
                <img src={settings.logo_url} alt={settings.brand_name} className="h-6 max-w-[100px] object-contain rounded" />
              ) : (
                <div className="w-6 h-6 rounded bg-[#111A2E] border border-[#1E2A44] flex items-center justify-center text-[#2FD6A0] font-bold text-xs">
                  JC
                </div>
              )}
              <span className="font-serif-heading text-white font-bold text-sm tracking-tight">
                {settings.brand_name}
              </span>
              <span className="text-slate-600">·</span>
              <span>By {book.author_name || settings.author_name}</span>
            </div>

            {/* Legal Links */}
            <div className="flex items-center gap-4 text-slate-400">
              <button
                onClick={() => onOpenLegal('privacy')}
                className="hover:text-slate-200 transition-colors cursor-pointer"
              >
                Privacy
              </button>
              <span>·</span>
              <button
                onClick={() => onOpenLegal('terms')}
                className="hover:text-slate-200 transition-colors cursor-pointer"
              >
                Terms
              </button>
              <span>·</span>
              <button
                onClick={() => onOpenLegal('refunds')}
                className="hover:text-slate-200 transition-colors cursor-pointer"
              >
                Refund Policy
              </button>
              <span>·</span>
              <a
                href={`mailto:${settings.contact_email}`}
                className="hover:text-slate-200 transition-colors"
              >
                Contact
              </a>
            </div>
          </div>

          <div className="pt-4 border-t border-[#1E2A44]/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
            <p>{settings.footer_copyright || `© ${new Date().getFullYear()} ${settings.brand_name}. All rights reserved.`}</p>
            <p>{settings.footer_security_note || 'Payments securely powered by Gumroad. 100% encrypted checkout.'}</p>
          </div>
        </div>
      </footer>

      {/* 13. STICKY MOBILE CTA BAR (appears on mobile after scroll) */}
      {showStickyBar && (
        <div className="fixed bottom-0 left-0 right-0 z-40 p-3 bg-[#0A0F1C]/95 backdrop-blur-md border-t border-[#1E2A44] lg:hidden animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{book.title}</p>
              <div className="flex items-baseline gap-1.5 font-mono text-[11px]">
                <span className="text-[#E3B94A] font-bold">{book.sale_price}</span>
                <span className="text-slate-500 line-through">{book.original_price}</span>
              </div>
            </div>

            <button
              onClick={() => handleGumroadCheckout('sticky')}
              className="gumroad-button px-5 py-2.5 rounded-lg bg-[#E3B94A] hover:bg-[#CF9F30] text-slate-950 font-bold text-xs shrink-0 cursor-pointer shadow-md"
            >
              Get Book
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
