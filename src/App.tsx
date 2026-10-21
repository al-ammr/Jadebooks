import React, { useState, useEffect } from 'react';
import {
  getBooks,
  getBookBySlug,
  getFeaturedBook,
  getTestimonials,
  getFAQs,
  getLeads,
  getAnalyticsEvents,
  getSiteSettings,
} from './services/storage';
import { Book, Testimonial, FAQItem, Lead, AnalyticsEvent, SiteSettings } from './types';
import { TopNav } from './components/TopNav';
import { BookLandingPage } from './views/BookLandingPage';
import { AdminDashboard } from './views/AdminDashboard';
import { LeadCaptureModal } from './components/LeadCaptureModal';
import { LegalModal } from './components/LegalModal';

export default function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [currentSlug, setCurrentSlug] = useState<string>('stop-overthinking-her');
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [analyticsEvents, setAnalyticsEvents] = useState<AnalyticsEvent[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(getSiteSettings());
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | 'refunds' | null>(null);

  // Load data
  const refreshData = () => {
    const loadedBooks = getBooks();
    setBooks(loadedBooks);
    setTestimonials(getTestimonials());
    setFaqs(getFAQs());
    setLeads(getLeads());
    setAnalyticsEvents(getAnalyticsEvents());
    setSettings(getSiteSettings());
  };

  useEffect(() => {
    refreshData();

    // Check URL query parameter or hash for initial book slug
    const urlParams = new URLSearchParams(window.location.search);
    const bookParam = urlParams.get('book');
    const path = window.location.pathname;

    if (bookParam) {
      setCurrentSlug(bookParam);
    } else if (path.startsWith('/books/')) {
      const slugFromPath = path.replace('/books/', '').replace(/\/$/, '');
      if (slugFromPath) setCurrentSlug(slugFromPath);
    } else if (window.location.hash.startsWith('#/admin')) {
      setIsAdminOpen(true);
    }
  }, []);

  // Update browser URL query without reload
  const handleSelectBook = (slug: string) => {
    setCurrentSlug(slug);
    const url = new URL(window.location.href);
    url.searchParams.set('book', slug);
    window.history.pushState({}, '', url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentBook =
    getBookBySlug(currentSlug) ||
    books.find((b) => b.slug === currentSlug) ||
    getFeaturedBook() ||
    books[0];

  if (!currentBook) {
    return (
      <div className="min-h-screen bg-[#0A0F1C] text-white flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h2 className="font-serif-heading text-2xl font-bold">Loading Jade Capital...</h2>
          <p className="text-sm text-slate-400">Initializing book publishing system.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-[#F2F5FA]">
      {isAdminOpen ? (
        <AdminDashboard
          books={books}
          testimonials={testimonials}
          faqs={faqs}
          leads={leads}
          analyticsEvents={analyticsEvents}
          settings={settings}
          onRefreshData={refreshData}
          onViewBook={(slug) => {
            handleSelectBook(slug);
            setIsAdminOpen(false);
          }}
          onCloseAdmin={() => setIsAdminOpen(false)}
        />
      ) : (
        <>
          {/* Subtle Top Bar & Book Switcher Navigation */}
          <TopNav
            currentBook={currentBook}
            allBooks={books}
            settings={settings}
            onSelectBook={handleSelectBook}
            onOpenAdmin={() => setIsAdminOpen(true)}
            onCtaClick={() => {
              // Direct anchor to offer block or trigger Gumroad
              const offerEl = document.getElementById('top');
              if (offerEl) {
                // Trigger Gumroad checkout through landing page method
                window.open(currentBook.gumroad_url, '_blank', 'noopener,noreferrer');
              }
            }}
          />

          {/* Book Landing Page Template */}
          <BookLandingPage
            book={currentBook}
            testimonials={testimonials.filter(
              (t) => t.book_id === currentBook.id || t.book_id === null
            )}
            faqs={faqs.filter((f) => f.book_id === currentBook.id || f.book_id === null)}
            settings={settings}
            onOpenLeadModal={() => setIsLeadModalOpen(true)}
            onOpenLegal={(type) => setLegalModalType(type)}
          />

          {/* Lead Magnet Free Chapter Modal */}
          <LeadCaptureModal
            book={currentBook}
            isOpen={isLeadModalOpen}
            onClose={() => setIsLeadModalOpen(false)}
            onGumroadCheckout={() => {
              window.open(currentBook.gumroad_url, '_blank', 'noopener,noreferrer');
            }}
          />

          {/* Legal Dialog Modal */}
          <LegalModal
            type={legalModalType}
            onClose={() => setLegalModalType(null)}
            settings={settings}
          />
        </>
      )}
    </div>
  );
}
