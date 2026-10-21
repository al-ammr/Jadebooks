import { Book, Testimonial, FAQItem, Lead, AnalyticsEvent, SiteSettings } from '../types';
import { initialBooks, initialTestimonials, initialFAQs, initialSiteSettings } from '../data/seedData';

const KEYS = {
  BOOKS: 'jade_books',
  TESTIMONIALS: 'jade_testimonials',
  FAQS: 'jade_faqs',
  LEADS: 'jade_leads',
  ANALYTICS: 'jade_analytics',
  SETTINGS: 'jade_settings',
};

// Safe JSON parser
function safeGet<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.error(`Error loading key ${key}:`, err);
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving key ${key}:`, err);
  }
}

// ---------------- BOOK REPOSITORY ----------------
export function getBooks(): Book[] {
  const books = safeGet<Book[]>(KEYS.BOOKS, []);
  if (!books || books.length === 0) {
    safeSet(KEYS.BOOKS, initialBooks);
    return initialBooks;
  }
  return books;
}

export function getBookBySlug(slug: string): Book | undefined {
  const books = getBooks();
  return books.find((b) => b.slug.toLowerCase() === slug.toLowerCase());
}

export function getFeaturedBook(): Book {
  const books = getBooks();
  return books.find((b) => b.is_featured && b.status === 'published') || books[0];
}

export function saveBook(updatedBook: Book): void {
  const books = getBooks();
  const index = books.findIndex((b) => b.id === updatedBook.id);
  const updated = { ...updatedBook, updated_at: new Date().toISOString() };
  if (index >= 0) {
    books[index] = updated;
  } else {
    books.push(updated);
  }
  safeSet(KEYS.BOOKS, books);
}

export function duplicateBook(sourceBookId: string): Book {
  const books = getBooks();
  const source = books.find((b) => b.id === sourceBookId);
  if (!source) throw new Error('Source book not found');

  const randomSuffix = Math.floor(100 + Math.random() * 900);
  const newSlug = `${source.slug}-copy-${randomSuffix}`;
  const duplicated: Book = {
    ...JSON.parse(JSON.stringify(source)),
    id: `book-${Date.now()}`,
    slug: newSlug,
    title: `${source.title} (Copy)`,
    status: 'draft',
    is_featured: false,
    published_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  books.push(duplicated);
  safeSet(KEYS.BOOKS, books);
  return duplicated;
}

export function deleteBook(id: string): void {
  const books = getBooks().filter((b) => b.id !== id);
  safeSet(KEYS.BOOKS, books);
}

// ---------------- TESTIMONIALS ----------------
export function getTestimonials(bookId?: string): Testimonial[] {
  const all = safeGet<Testimonial[]>(KEYS.TESTIMONIALS, []);
  if (!all || all.length === 0) {
    safeSet(KEYS.TESTIMONIALS, initialTestimonials);
    return initialTestimonials;
  }
  if (!bookId) return all;
  return all.filter((t) => t.book_id === bookId || t.book_id === null);
}

export function saveTestimonial(testimonial: Testimonial): void {
  const all = getTestimonials();
  const idx = all.findIndex((t) => t.id === testimonial.id);
  if (idx >= 0) {
    all[idx] = testimonial;
  } else {
    all.push(testimonial);
  }
  safeSet(KEYS.TESTIMONIALS, all);
}

export function deleteTestimonial(id: string): void {
  const all = getTestimonials().filter((t) => t.id !== id);
  safeSet(KEYS.TESTIMONIALS, all);
}

// ---------------- FAQS ----------------
export function getFAQs(bookId?: string): FAQItem[] {
  const all = safeGet<FAQItem[]>(KEYS.FAQS, []);
  if (!all || all.length === 0) {
    safeSet(KEYS.FAQS, initialFAQs);
    return initialFAQs;
  }
  if (!bookId) return all;
  return all.filter((f) => f.book_id === bookId || f.book_id === null);
}

export function saveFAQ(faq: FAQItem): void {
  const all = getFAQs();
  const idx = all.findIndex((f) => f.id === faq.id);
  if (idx >= 0) {
    all[idx] = faq;
  } else {
    all.push(faq);
  }
  safeSet(KEYS.FAQS, all);
}

export function deleteFAQ(id: string): void {
  const all = getFAQs().filter((f) => f.id !== id);
  safeSet(KEYS.FAQS, all);
}

// ---------------- LEADS ----------------
export function getLeads(): Lead[] {
  return safeGet<Lead[]>(KEYS.LEADS, [
    {
      id: 'lead-demo-1',
      book_id: 'book-1',
      book_title: 'Stop Overthinking Her',
      email: 'alex.reader@example.com',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      source: 'Free Chapter Hero',
    },
    {
      id: 'lead-demo-2',
      book_id: 'book-1',
      book_title: 'Stop Overthinking Her',
      email: 'jordan.c@example.com',
      created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
      source: 'Lead Magnet Section',
    },
  ]);
}

export function addLead(leadData: Omit<Lead, 'id' | 'created_at'>): Lead {
  const leads = getLeads();
  // check if already exists
  const existing = leads.find((l) => l.email.toLowerCase() === leadData.email.toLowerCase() && l.book_id === leadData.book_id);
  if (existing) return existing;

  const newLead: Lead = {
    ...leadData,
    id: `lead-${Date.now()}`,
    created_at: new Date().toISOString(),
  };
  leads.unshift(newLead);
  safeSet(KEYS.LEADS, leads);
  return newLead;
}

export function deleteLead(id: string): void {
  const leads = getLeads().filter((l) => l.id !== id);
  safeSet(KEYS.LEADS, leads);
}

export function exportLeadsToCSV(): void {
  const leads = getLeads();
  if (leads.length === 0) return;

  const headers = ['ID', 'Email', 'Book Title', 'Captured At', 'Source'];
  const rows = leads.map((l) => [
    l.id,
    `"${l.email}"`,
    `"${l.book_title}"`,
    `"${new Date(l.created_at).toLocaleString()}"`,
    `"${l.source}"`,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `jade-capital-leads-${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ---------------- ANALYTICS & EVENT TRACKING ----------------
export function getAnalyticsEvents(): AnalyticsEvent[] {
  return safeGet<AnalyticsEvent[]>(KEYS.ANALYTICS, []);
}

export function trackEvent(
  bookId: string,
  type: AnalyticsEvent['type'],
  ctaLocation?: string
): void {
  const events = getAnalyticsEvents();
  let sessionId = sessionStorage.getItem('jade_session_id');
  if (!sessionId) {
    sessionId = `sess-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    sessionStorage.setItem('jade_session_id', sessionId);
  }

  const newEvent: AnalyticsEvent = {
    id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    book_id: bookId,
    type,
    cta_location: ctaLocation,
    session_id: sessionId,
    created_at: new Date().toISOString(),
  };

  events.push(newEvent);
  // Keep last 1000 events to prevent localstorage bloat
  const trimmed = events.slice(-1000);
  safeSet(KEYS.ANALYTICS, trimmed);
}

// ---------------- SITE SETTINGS ----------------
export function getSiteSettings(): SiteSettings {
  const settings = safeGet<SiteSettings | null>(KEYS.SETTINGS, null);
  if (!settings) {
    safeSet(KEYS.SETTINGS, initialSiteSettings);
    return initialSiteSettings;
  }
  return settings;
}

export function saveSiteSettings(updated: SiteSettings): void {
  safeSet(KEYS.SETTINGS, updated);
}

// Reset data helper
export function resetToSeedData(): void {
  safeSet(KEYS.BOOKS, initialBooks);
  safeSet(KEYS.TESTIMONIALS, initialTestimonials);
  safeSet(KEYS.FAQS, initialFAQs);
  safeSet(KEYS.SETTINGS, initialSiteSettings);
}
