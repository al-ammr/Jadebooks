import React, { useState } from 'react';
import { Book, Testimonial, FAQItem, Lead, AnalyticsEvent, SiteSettings } from '../types';
import {
  saveBook,
  duplicateBook,
  deleteBook,
  saveTestimonial,
  deleteTestimonial,
  saveFAQ,
  deleteFAQ,
  deleteLead,
  exportLeadsToCSV,
  saveSiteSettings,
  resetToSeedData,
} from '../services/storage';
import { BookCover3D } from '../components/BookCover3D';
import { ImageUploader } from '../components/ImageUploader';
import {
  BarChart3,
  BookOpen,
  Users,
  MessageSquare,
  HelpCircle,
  Settings,
  Plus,
  Copy,
  Trash2,
  ExternalLink,
  Download,
  Save,
  Check,
  ArrowLeft,
  Eye,
  Star,
  Search,
  Image as ImageIcon,
  Type,
  DollarSign,
  Palette,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';

interface AdminDashboardProps {
  books: Book[];
  testimonials: Testimonial[];
  faqs: FAQItem[];
  leads: Lead[];
  analyticsEvents: AnalyticsEvent[];
  settings: SiteSettings;
  onRefreshData: () => void;
  onViewBook: (slug: string) => void;
  onCloseAdmin: () => void;
}

type AdminTab = 'overview' | 'books' | 'testimonials' | 'faqs' | 'leads' | 'settings';
type BookEditorTab =
  | 'basics'
  | 'pricing'
  | 'cover'
  | 'hero'
  | 'pain'
  | 'story'
  | 'curriculum'
  | 'takeaways'
  | 'lead_magnet'
  | 'author'
  | 'offer'
  | 'final_cta'
  | 'sections';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  books,
  testimonials,
  faqs,
  leads,
  analyticsEvents,
  settings,
  onRefreshData,
  onViewBook,
  onCloseAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('books');
  const [editingBook, setEditingBook] = useState<Book | null>(books[0] || null);
  const [bookEditorTab, setBookEditorTab] = useState<BookEditorTab>('basics');
  const [leadSearch, setLeadSearch] = useState('');
  const [leadBookFilter, setLeadBookFilter] = useState('all');
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  // KPI Calculations
  const totalViews = analyticsEvents.filter((e) => e.type === 'page_view').length;
  const totalCtaClicks = analyticsEvents.filter((e) => e.type === 'cta_click').length;
  const ctr = totalViews > 0 ? ((totalCtaClicks / totalViews) * 100).toFixed(1) : '0.0';
  const totalLeads = leads.length;

  // Duplicate a book in 1-click
  const handleDuplicate = (bookId: string) => {
    try {
      const duplicated = duplicateBook(bookId);
      onRefreshData();
      showToast(`Duplicated as "${duplicated.title}" (Draft)`);
      setEditingBook(duplicated);
      setActiveTab('books');
    } catch {
      showToast('Failed to duplicate book');
    }
  };

  // Create a new blank book with complete customizable fields
  const handleCreateNewBook = () => {
    const newBook: Book = {
      id: `book-${Date.now()}`,
      slug: `new-book-${Math.floor(Math.random() * 1000)}`,
      status: 'draft',
      is_featured: false,
      title: 'New Book Title',
      subtitle: 'A practical modern guide on mindset and behavior',
      series_line: 'Jade Capital Publishing',
      author_name: settings.author_name || 'Eleine Kayrah Jaine',
      hero_kicker: 'Field Guide · Modern Dynamics',
      hero_headline: 'The Core Promise or Transformation of This Book',
      hero_subheadline: 'A clear, direct 2-line summary explaining why this book is essential.',
      cta_label: 'Get My Copy — $19.99',
      original_price: '$39.99',
      sale_price: '$19.99',
      discount_badge: '50% OFF · Save $20.00',
      price_note: 'Instant digital download (PDF + ePub) · Secure Gumroad checkout',
      proof_rating_text: '4.9 / 5',
      proof_readers_count: '1,200+ Readers',
      proof_support_text: 'Direct Author Support',
      gumroad_url: 'https://thejadecapital.gumroad.com/l/sample',
      checkout_mode: 'overlay',
      cover_theme: {
        primary_gradient: 'from-[#0C1527] to-[#060A14]',
        accent_color: '#2FD6A0',
        gold_foil: true,
        badge_label: 'NEW RELEASE',
      },
      formats: ['Instant PDF E-Book', 'EPUB for Kindle & Apple Books'],
      pain_points_kicker: 'The Reality Check',
      pain_points_title: 'Does This Sound Like You?',
      pain_points_subtitle: 'If you have ever found yourself second-guessing every choice, you are not alone.',
      pain_points_cta: 'End the cycle today — $19.99',
      pain_points: [
        'I feel uncertain about what step to take next.',
        'I waste mental energy overthinking simple situations.',
        'I want practical frameworks instead of vague motivational advice.',
      ],
      problem_promise_kicker: 'The Mental Shift',
      problem_promise_title: 'From Confusion to Clarity',
      problem_promise_quote: 'Not guessing. Knowing.',
      problem_promise_text: 'Describe the primary obstacle your readers face and how this book provides the exact roadmap.',
      problem_promise_from_title: 'From Overthinking:',
      problem_promise_from_text: 'Endless analysis without action or peace of mind.',
      problem_promise_to_title: 'To Grounded Action:',
      problem_promise_to_text: 'Clear principles and predictable execution.',
      whats_inside_kicker: 'Curriculum & Architecture',
      whats_inside_title: "What's Inside The Book",
      whats_inside_subtitle: 'Structured Parts covering foundational mindsets to advanced execution.',
      whats_inside_cta: 'Unlock the complete curriculum — $19.99',
      whats_inside: [
        {
          part: 'Part I',
          title: 'Foundational Principles',
          chapters: ['Chapter 1: The Core Problem', 'Chapter 2: Shifting Perspective'],
          pull_quote: 'Clarity begins with honest observation.',
        },
      ],
      takeaways_kicker: 'Tangible Outcomes',
      takeaways_title: 'After Reading, You Will…',
      takeaways_subtitle: 'No theory without application. Here is what shifts in your actual habits:',
      takeaways: [
        'Identify behavioral blindspots immediately.',
        'Take decisive action with calm self-respect.',
      ],
      lead_magnet_kicker: 'Free Preview',
      lead_magnet_title: 'Read Chapter 1 For Free',
      lead_magnet_subtitle: 'Download the sample chapter to experience the exact tone and framework right now.',
      lead_magnet_cta: 'Send Me Chapter 1',
      sample_chapter_title: 'Chapter 1: The First Step',
      sample_chapter_excerpt: 'Here is what changes when you stop reacting and start observing.',
      testimonials_kicker: 'Reader Feedback',
      testimonials_title: 'What Real Readers Are Saying',
      testimonials_subtitle: 'Honest feedback from verified readers.',
      author_kicker: 'The Author',
      author_brand_tag: `Brand: ${settings.brand_name} · @${settings.socials.instagram || 'the.jadecapital'}`,
      author_bio: settings.author_bio || `${settings.author_name} is an author and behavioral strategist.`,
      offer_kicker: 'Instant Package',
      offer_title: 'Everything You Get Today',
      offer_includes: [
        'Complete digital e-book (PDF + EPUB)',
        'Actionable exercises and worksheets',
        'Lifetime access & all future updates',
      ],
      guarantee_text: '30-Day Money-Back Guarantee. Read it risk-free.',
      faqs_kicker: 'Clear Answers',
      faqs_title: 'Frequently Asked Questions',
      final_cta_title: 'Take Control Of Your Trajectory Today.',
      final_cta_subtitle: 'Get instant digital access to the full book and worksheets right now for $19.99.',
      final_cta_button: 'Get My Copy — $19.99',
      sections_config: [
        { key: 'hero', title: 'Hero & Book Showcase', enabled: true, order: 1 },
        { key: 'pain_points', title: 'Pain Points', enabled: true, order: 2 },
        { key: 'problem_promise', title: 'Problem & Promise', enabled: true, order: 3 },
        { key: 'whats_inside', title: "What's Inside", enabled: true, order: 4 },
        { key: 'takeaways', title: 'Key Takeaways', enabled: true, order: 5 },
        { key: 'lead_magnet', title: 'Free Sample Chapter', enabled: true, order: 6 },
        { key: 'testimonials', title: 'Reader Reviews', enabled: true, order: 7 },
        { key: 'author', title: 'Author Spotlight', enabled: true, order: 8 },
        { key: 'offer', title: 'Pricing & Guarantee', enabled: true, order: 9 },
        { key: 'faqs', title: 'FAQs', enabled: true, order: 10 },
        { key: 'final_cta', title: 'Final CTA', enabled: true, order: 11 },
      ],
      seo_title: 'New Book Title | Jade Capital',
      seo_description: 'Discover practical frameworks and strategies.',
      published_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    saveBook(newBook);
    onRefreshData();
    setEditingBook(newBook);
    setActiveTab('books');
    showToast('New draft book created!');
  };

  const handleSaveBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBook) return;
    saveBook(editingBook);
    onRefreshData();
    showToast('Book and writeup customizations saved!');
  };

  const filteredLeads = leads.filter((l) => {
    const matchesSearch = l.email.toLowerCase().includes(leadSearch.toLowerCase());
    const matchesBook = leadBookFilter === 'all' || l.book_id === leadBookFilter;
    return matchesSearch && matchesBook;
  });

  return (
    <div className="min-h-screen bg-[#070B14] text-[#F2F5FA] flex flex-col">
      {/* Toast Notification */}
      {feedbackToast && (
        <div className="fixed top-5 right-5 z-50 px-4 py-2.5 rounded-lg bg-[#2FD6A0] text-slate-950 font-bold text-xs shadow-2xl flex items-center gap-2 animate-in fade-in duration-150">
          <Check className="w-4 h-4" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Admin Top Header */}
      <header className="h-16 border-b border-[#1E2A44] bg-[#0A0F1C] px-4 sm:px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#111A2E] border border-[#1E2A44] flex items-center justify-center text-[#2FD6A0] font-bold text-xs">
            JC
          </div>
          <div>
            <h1 className="font-serif-heading font-bold text-base text-white flex items-center gap-2">
              <span>{settings.brand_name} Customization Admin</span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#2FD6A0]/10 text-[#2FD6A0] border border-[#2FD6A0]/20">
                100% Configurable
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {editingBook && (
            <button
              onClick={() => onViewBook(editingBook.slug)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111A2E] hover:bg-[#15233e] border border-[#1E2A44] text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-[#2FD6A0]" />
              <span>Preview Live Page</span>
            </button>
          )}

          <button
            onClick={onCloseAdmin}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#2FD6A0] hover:bg-[#25B586] text-slate-950 text-xs font-bold transition-all cursor-pointer shadow-md"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Landing Page</span>
          </button>
        </div>
      </header>

      {/* Main Admin Layout */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[#1E2A44] bg-[#0A0F1C]/80 p-3 space-y-1 shrink-0">
          <button
            onClick={() => {
              setActiveTab('books');
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'books'
                ? 'bg-[#111A2E] text-[#2FD6A0] border border-[#2FD6A0]/30 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-[#111A2E]/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <BookOpen className="w-4 h-4 shrink-0" />
              <span>Books & Writeups</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1E2A44] text-slate-300">
              {books.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('overview');
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-[#111A2E] text-[#2FD6A0] border border-[#2FD6A0]/30 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-[#111A2E]/50'
            }`}
          >
            <BarChart3 className="w-4 h-4 shrink-0" />
            <span>Analytics & KPIs</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('testimonials');
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'testimonials'
                ? 'bg-[#111A2E] text-[#2FD6A0] border border-[#2FD6A0]/30 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-[#111A2E]/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <MessageSquare className="w-4 h-4 shrink-0" />
              <span>Testimonials</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1E2A44] text-slate-300">
              {testimonials.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('faqs');
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'faqs'
                ? 'bg-[#111A2E] text-[#2FD6A0] border border-[#2FD6A0]/30 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-[#111A2E]/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-4 h-4 shrink-0" />
              <span>FAQ Manager</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1E2A44] text-slate-300">
              {faqs.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('leads');
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'leads'
                ? 'bg-[#111A2E] text-[#2FD6A0] border border-[#2FD6A0]/30 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-[#111A2E]/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4 shrink-0" />
              <span>Captured Leads</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#2FD6A0]/20 text-[#2FD6A0] font-bold">
              {leads.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('settings');
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-[#111A2E] text-[#2FD6A0] border border-[#2FD6A0]/30 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-[#111A2E]/50'
            }`}
          >
            <Settings className="w-4 h-4 shrink-0" />
            <span>Site & Brand Settings</span>
          </button>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-6xl">
          {/* TAB: BOOKS & WRITEUPS */}
          {activeTab === 'books' && (
            <div className="space-y-6">
              {/* Header & Book Switcher within Admin */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2A44]">
                <div>
                  <h2 className="font-serif-heading text-2xl font-bold text-white flex items-center gap-2">
                    <span>Book Customization Studio</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Select a book below to customize its writeups, images, pricing, curriculum, and sections.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={editingBook?.id || ''}
                    onChange={(e) => {
                      const found = books.find((b) => b.id === e.target.value);
                      if (found) setEditingBook(found);
                    }}
                    className="px-3 py-2 rounded-xl bg-[#111A2E] border border-[#1E2A44] text-xs text-white font-semibold cursor-pointer max-w-[200px] truncate"
                  >
                    {books.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.title} ({b.status})
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => editingBook && handleDuplicate(editingBook.id)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#111A2E] hover:bg-[#15233e] border border-[#1E2A44] text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
                    title="Duplicate selected book in 1 click"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Duplicate</span>
                  </button>

                  <button
                    onClick={handleCreateNewBook}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2FD6A0] hover:bg-[#25B586] text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Book</span>
                  </button>
                </div>
              </div>

              {editingBook && (
                <form onSubmit={handleSaveBook} className="space-y-6">
                  {/* Book Editor Section Tabs */}
                  <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-[#1E2A44] text-xs">
                    {[
                      { key: 'basics', label: '1. Basics & Links', icon: BookOpen },
                      { key: 'pricing', label: '2. Price & Off', icon: DollarSign },
                      { key: 'cover', label: '3. Cover Image & 3D', icon: ImageIcon },
                      { key: 'hero', label: '4. Hero Writeup', icon: Type },
                      { key: 'pain', label: '5. Pain Points (6)', icon: Layers },
                      { key: 'story', label: '6. Problem & Promise', icon: Sparkles },
                      { key: 'curriculum', label: "7. What's Inside", icon: BookOpen },
                      { key: 'takeaways', label: '8. Takeaways', icon: Check },
                      { key: 'lead_magnet', label: '9. Free Chapter', icon: Download },
                      { key: 'author', label: '10. Author & Bio', icon: Users },
                      { key: 'offer', label: '11. Offer & Guarantee', icon: Shield },
                      { key: 'final_cta', label: '12. Final CTA', icon: Sparkles },
                      { key: 'sections', label: '13. Section Toggles', icon: Settings },
                    ].map((tab) => {
                      const Icon = tab.icon;
                      const isActive = bookEditorTab === tab.key;
                      return (
                        <button
                          key={tab.key}
                          type="button"
                          onClick={() => setBookEditorTab(tab.key as BookEditorTab)}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap font-medium transition-all cursor-pointer ${
                            isActive
                              ? 'bg-[#2FD6A0] text-slate-950 font-bold shadow-md'
                              : 'text-slate-400 hover:text-white hover:bg-[#111A2E]'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* 1. BASICS & LINKS */}
                  {bookEditorTab === 'basics' && (
                    <div className="p-6 rounded-2xl bg-[#111A2E] border border-[#1E2A44] space-y-4">
                      <h3 className="font-serif-heading text-lg font-bold text-white">
                        Book Identity & Gumroad Setup
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                            Book Title
                          </label>
                          <input
                            type="text"
                            value={editingBook.title}
                            onChange={(e) =>
                              setEditingBook({ ...editingBook, title: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-xl bg-[#0A0F1C] border border-[#1E2A44] text-xs text-white"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                            Slug (URL: /books/:slug)
                          </label>
                          <input
                            type="text"
                            value={editingBook.slug}
                            onChange={(e) =>
                              setEditingBook({
                                ...editingBook,
                                slug: e.target.value.toLowerCase().trim(),
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl bg-[#0A0F1C] border border-[#1E2A44] text-xs text-white font-mono"
                            required
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                            Subtitle / Tagline
                          </label>
                          <input
                            type="text"
                            value={editingBook.subtitle}
                            onChange={(e) =>
                              setEditingBook({ ...editingBook, subtitle: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-xl bg-[#0A0F1C] border border-[#1E2A44] text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                            Series Line / Category
                          </label>
                          <input
                            type="text"
                            value={editingBook.series_line}
                            onChange={(e) =>
                              setEditingBook({ ...editingBook, series_line: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-xl bg-[#0A0F1C] border border-[#1E2A44] text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                            Status
                          </label>
                          <select
                            value={editingBook.status}
                            onChange={(e) =>
                              setEditingBook({ ...editingBook, status: e.target.value as any })
                            }
                            className="w-full px-3 py-2 rounded-xl bg-[#0A0F1C] border border-[#1E2A44] text-xs text-white cursor-pointer"
                          >
                            <option value="published">Published (Publicly Viewable)</option>
                            <option value="draft">Draft (Admin Only)</option>
                            <option value="archived">Archived</option>
                          </select>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                            Gumroad Checkout URL
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="url"
                              value={editingBook.gumroad_url}
                              onChange={(e) =>
                                setEditingBook({ ...editingBook, gumroad_url: e.target.value })
                              }
                              className="flex-1 px-3 py-2 rounded-xl bg-[#0A0F1C] border border-[#1E2A44] text-xs text-white font-mono"
                              required
                            />
                            <a
                              href={editingBook.gumroad_url}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-2 rounded-xl bg-[#1E2A44] text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-1"
                            >
                              <span>Test Link</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 2. PRICING & PRICE OFF */}
                  {bookEditorTab === 'pricing' && (
                    <div className="p-6 rounded-2xl bg-[#111A2E] border border-[#1E2A44] space-y-4">
                      <h3 className="font-serif-heading text-lg font-bold text-white">
                        Pricing & Discount "Price Off" Configuration
                      </h3>
                      <p className="text-xs text-slate-400">
                        Customize the strikethrough price, sale price, and percentage/savings badge displayed across all landing page sections.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-[#0A0F1C] border border-[#E3B94A]/30">
                        <div>
                          <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                            Original Strikethrough Price
                          </label>
                          <input
                            type="text"
                            value={editingBook.original_price}
                            onChange={(e) =>
                              setEditingBook({ ...editingBook, original_price: e.target.value })
                            }
                            placeholder="$29.99"
                            className="w-full px-3 py-2 rounded-lg bg-[#111A2E] border border-[#1E2A44] text-xs text-white font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono uppercase text-[#E3B94A] font-bold mb-1">
                            Sale Price (Actual Price)
                          </label>
                          <input
                            type="text"
                            value={editingBook.sale_price}
                            onChange={(e) =>
                              setEditingBook({ ...editingBook, sale_price: e.target.value })
                            }
                            placeholder="$14.99"
                            className="w-full px-3 py-2 rounded-lg bg-[#111A2E] border border-[#E3B94A] text-xs text-white font-mono font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono uppercase text-[#2FD6A0] font-bold mb-1">
                            Discount Badge ("Price Off" Text)
                          </label>
                          <input
                            type="text"
                            value={editingBook.discount_badge}
                            onChange={(e) =>
                              setEditingBook({ ...editingBook, discount_badge: e.target.value })
                            }
                            placeholder="50% OFF · Save $15.00"
                            className="w-full px-3 py-2 rounded-lg bg-[#111A2E] border border-[#2FD6A0] text-xs text-white font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                          Price Note / Micro-Copy under Buttons
                        </label>
                        <input
                          type="text"
                          value={editingBook.price_note}
                          onChange={(e) =>
                            setEditingBook({ ...editingBook, price_note: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-[#0A0F1C] border border-[#1E2A44] text-xs text-white"
                        />
                      </div>
                    </div>
                  )}

                  {/* 3. COVER IMAGE & 3D MOCKUP */}
                  {bookEditorTab === 'cover' && (
                    <div className="p-6 rounded-2xl bg-[#111A2E] border border-[#1E2A44] space-y-6">
                      <div>
                        <h3 className="font-serif-heading text-lg font-bold text-white">
                          Cover Image & 3D Mockup Customization
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                          Upload a graphic cover image directly from your computer/device or customize the procedural 3D CSS book cover.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        <div className="lg:col-span-7 space-y-4">
                          <ImageUploader
                            label="Book Cover Artwork"
                            sublabel="Upload JPG, PNG, or WebP. If uploaded, the graphic wraps the 3D book cover."
                            value={editingBook.cover_image_url}
                            onChange={(newCover) =>
                              setEditingBook({ ...editingBook, cover_image_url: newCover })
                            }
                            aspectRatio="cover"
                          />

                          <div className="p-4 rounded-xl bg-[#0A0F1C] border border-[#1E2A44] space-y-3">
                            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
                              3D Cover Theme Settings
                            </h4>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[11px] text-slate-400 mb-1">
                                  Accent Highlight Color
                                </label>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="color"
                                    value={editingBook.cover_theme?.accent_color || '#2FD6A0'}
                                    onChange={(e) =>
                                      setEditingBook({
                                        ...editingBook,
                                        cover_theme: {
                                          ...editingBook.cover_theme,
                                          accent_color: e.target.value,
                                        },
                                      })
                                    }
                                    className="w-8 h-8 rounded border border-[#1E2A44] cursor-pointer bg-transparent"
                                  />
                                  <span className="text-xs font-mono text-slate-300">
                                    {editingBook.cover_theme?.accent_color || '#2FD6A0'}
                                  </span>
                                </div>
                              </div>

                              <div>
                                <label className="block text-[11px] text-slate-400 mb-1">
                                  Badge Label
                                </label>
                                <input
                                  type="text"
                                  value={editingBook.cover_theme?.badge_label || 'JADE CAPITAL'}
                                  onChange={(e) =>
                                    setEditingBook({
                                      ...editingBook,
                                      cover_theme: {
                                        ...editingBook.cover_theme,
                                        badge_label: e.target.value,
                                      },
                                    })
                                  }
                                  placeholder="BESTSELLER"
                                  className="w-full px-3 py-1.5 rounded-lg bg-[#111A2E] border border-[#1E2A44] text-xs text-white font-mono uppercase"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Live 3D Cover Preview */}
                        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-[#0A0F1C] border border-[#1E2A44]">
                          <span className="text-[10px] font-mono uppercase text-slate-400 mb-2">
                            Live 3D Cover Preview
                          </span>
                          <BookCover3D book={editingBook} size="normal" interactive={true} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 4. HERO WRITEUP */}
                  {bookEditorTab === 'hero' && (
                    <div className="p-6 rounded-2xl bg-[#111A2E] border border-[#1E2A44] space-y-4">
                      <h3 className="font-serif-heading text-lg font-bold text-white">
                        Hero Section Writeup & Copy
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                            Hero Kicker Tag
                          </label>
                          <input
                            type="text"
                            value={editingBook.hero_kicker || ''}
                            onChange={(e) =>
                              setEditingBook({ ...editingBook, hero_kicker: e.target.value })
                            }
                            placeholder="A Modern Man’s Guide to Texting, Attraction, and Frame"
                            className="w-full px-3 py-2 rounded-xl bg-[#0A0F1C] border border-[#1E2A44] text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                            Primary Benefit Headline
                          </label>
                          <textarea
                            rows={2}
                            value={editingBook.hero_headline}
                            onChange={(e) =>
                              setEditingBook({ ...editingBook, hero_headline: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-xl bg-[#0A0F1C] border border-[#1E2A44] text-xs text-white font-serif-heading text-base"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                            Hero Subheadline (2-3 lines)
                          </label>
                          <textarea
                            rows={3}
                            value={editingBook.hero_subheadline}
                            onChange={(e) =>
                              setEditingBook({ ...editingBook, hero_subheadline: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-xl bg-[#0A0F1C] border border-[#1E2A44] text-xs text-white leading-relaxed"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                              Primary CTA Button Text
                            </label>
                            <input
                              type="text"
                              value={editingBook.cta_label}
                              onChange={(e) =>
                                setEditingBook({ ...editingBook, cta_label: e.target.value })
                              }
                              className="w-full px-3 py-2 rounded-xl bg-[#0A0F1C] border border-[#1E2A44] text-xs text-white font-bold"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                              Free Sample CTA Button Text
                            </label>
                            <input
                              type="text"
                              value={editingBook.lead_magnet_cta || 'Read Chapter 1 Free'}
                              onChange={(e) =>
                                setEditingBook({ ...editingBook, lead_magnet_cta: e.target.value })
                              }
                              className="w-full px-3 py-2 rounded-xl bg-[#0A0F1C] border border-[#1E2A44] text-xs text-white"
                            />
                          </div>
                        </div>

                        {/* Proof Strip customization */}
                        <div className="p-4 rounded-xl bg-[#0A0F1C] border border-[#1E2A44] space-y-3">
                          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
                            Hero Proof Strip Text
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-[11px] text-slate-400 mb-1">Rating</label>
                              <input
                                type="text"
                                value={editingBook.proof_rating_text || '4.9 / 5'}
                                onChange={(e) =>
                                  setEditingBook({
                                    ...editingBook,
                                    proof_rating_text: e.target.value,
                                  })
                                }
                                className="w-full px-3 py-1.5 rounded-lg bg-[#111A2E] border border-[#1E2A44] text-xs text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] text-slate-400 mb-1">
                                Reader Count
                              </label>
                              <input
                                type="text"
                                value={editingBook.proof_readers_count || '1,400+ Active Readers'}
                                onChange={(e) =>
                                  setEditingBook({
                                    ...editingBook,
                                    proof_readers_count: e.target.value,
                                  })
                                }
                                className="w-full px-3 py-1.5 rounded-lg bg-[#111A2E] border border-[#1E2A44] text-xs text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] text-slate-400 mb-1">
                                Support Label
                              </label>
                              <input
                                type="text"
                                value={editingBook.proof_support_text || 'Direct Author Support'}
                                onChange={(e) =>
                                  setEditingBook({
                                    ...editingBook,
                                    proof_support_text: e.target.value,
                                  })
                                }
                                className="w-full px-3 py-1.5 rounded-lg bg-[#111A2E] border border-[#1E2A44] text-xs text-white"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 5. PAIN POINTS */}
                  {bookEditorTab === 'pain' && (
                    <div className="p-6 rounded-2xl bg-[#111A2E] border border-[#1E2A44] space-y-4">
                      <h3 className="font-serif-heading text-lg font-bold text-white">
                        Pain Points Section Customization
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                            Section Kicker
                          </label>
                          <input
                            type="text"
                            value={editingBook.pain_points_kicker || 'The Reality Check'}
                            onChange={(e) =>
                              setEditingBook({
                                ...editingBook,
                                pain_points_kicker: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl bg-[#0A0F1C] border border-[#1E2A44] text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                            Section Headline
                          </label>
                          <input
                            type="text"
                            value={editingBook.pain_points_title || 'Does This Sound Like You?'}
                            onChange={(e) =>
                              setEditingBook({
                                ...editingBook,
                                pain_points_title: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl bg-[#0A0F1C] border border-[#1E2A44] text-xs text-white font-bold"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                          Subtitle
                        </label>
                        <input
                          type="text"
                          value={editingBook.pain_points_subtitle || ''}
                          onChange={(e) =>
                            setEditingBook({
                              ...editingBook,
                              pain_points_subtitle: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-[#0A0F1C] border border-[#1E2A44] text-xs text-white"
                        />
                      </div>

                      <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-mono uppercase text-[#2FD6A0] font-bold">
                            Individual Pain Points ({editingBook.pain_points.length})
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingBook({
                                ...editingBook,
                                pain_points: [
                                  ...editingBook.pain_points,
                                  'New relatable dating/behavioral pain point',
                                ],
                              });
                            }}
                            className="px-2.5 py-1 rounded bg-[#1E2A44] text-xs text-slate-200 hover:text-white"
                          >
                            + Add Point
                          </button>
                        </div>

                        {editingBook.pain_points.map((point, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="text-xs font-mono text-[#E3B94A] font-bold w-6">
                              #{idx + 1}
                            </span>
                            <input
                              type="text"
                              value={point}
                              onChange={(e) => {
                                const copy = [...editingBook.pain_points];
                                copy[idx] = e.target.value;
                                setEditingBook({ ...editingBook, pain_points: copy });
                              }}
                              className="flex-1 px-3 py-2 rounded-lg bg-[#0A0F1C] border border-[#1E2A44] text-xs text-white"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const copy = editingBook.pain_points.filter((_, i) => i !== idx);
                                setEditingBook({ ...editingBook, pain_points: copy });
                              }}
                              className="p-1.5 text-slate-500 hover:text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 6. PROBLEM & PROMISE */}
                  {bookEditorTab === 'story' && (
                    <div className="p-6 rounded-2xl bg-[#111A2E] border border-[#1E2A44] space-y-4">
                      <h3 className="font-serif-heading text-lg font-bold text-white">
                        The Problem & The Promise Story Writeup
                      </h3>

                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                          Section Headline
                        </label>
                        <input
                          type="text"
                          value={editingBook.problem_promise_title}
                          onChange={(e) =>
                            setEditingBook({
                              ...editingBook,
                              problem_promise_title: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-[#0A0F1C] border border-[#1E2A44] text-xs text-white font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                          Narrative Body Text
                        </label>
                        <textarea
                          rows={4}
                          value={editingBook.problem_promise_text}
                          onChange={(e) =>
                            setEditingBook({
                              ...editingBook,
                              problem_promise_text: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-[#0A0F1C] border border-[#1E2A44] text-xs text-white leading-relaxed"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                          Key Transformation Quote
                        </label>
                        <input
                          type="text"
                          value={editingBook.problem_promise_quote}
                          onChange={(e) =>
                            setEditingBook({
                              ...editingBook,
                              problem_promise_quote: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-[#0A0F1C] border border-[#1E2A44] text-xs text-[#E3B94A] italic font-serif-heading"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div className="p-4 rounded-xl bg-[#0A0F1C] border border-[#1E2A44] space-y-2">
                          <label className="block text-[11px] font-mono uppercase text-[#F26D6D] font-bold">
                            "From" Transformation Card
                          </label>
                          <input
                            type="text"
                            value={editingBook.problem_promise_from_title || 'From Anxiety:'}
                            onChange={(e) =>
                              setEditingBook({
                                ...editingBook,
                                problem_promise_from_title: e.target.value,
                              })
                            }
                            className="w-full px-3 py-1.5 rounded-lg bg-[#111A2E] border border-[#1E2A44] text-xs text-white font-semibold"
                          />
                          <textarea
                            rows={2}
                            value={editingBook.problem_promise_from_text || ''}
                            onChange={(e) =>
                              setEditingBook({
                                ...editingBook,
                                problem_promise_from_text: e.target.value,
                              })
                            }
                            className="w-full px-3 py-1.5 rounded-lg bg-[#111A2E] border border-[#1E2A44] text-xs text-slate-300"
                          />
                        </div>

                        <div className="p-4 rounded-xl bg-[#0A0F1C] border border-[#2FD6A0]/30 space-y-2">
                          <label className="block text-[11px] font-mono uppercase text-[#2FD6A0] font-bold">
                            "To" Transformation Card
                          </label>
                          <input
                            type="text"
                            value={editingBook.problem_promise_to_title || 'To Quiet Frame:'}
                            onChange={(e) =>
                              setEditingBook({
                                ...editingBook,
                                problem_promise_to_title: e.target.value,
                              })
                            }
                            className="w-full px-3 py-1.5 rounded-lg bg-[#111A2E] border border-[#1E2A44] text-xs text-white font-semibold"
                          />
                          <textarea
                            rows={2}
                            value={editingBook.problem_promise_to_text || ''}
                            onChange={(e) =>
                              setEditingBook({
                                ...editingBook,
                                problem_promise_to_text: e.target.value,
                              })
                            }
                            className="w-full px-3 py-1.5 rounded-lg bg-[#111A2E] border border-[#1E2A44] text-xs text-slate-300"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 7. CURRICULUM (WHAT'S INSIDE) */}
                  {bookEditorTab === 'curriculum' && (
                    <div className="p-6 rounded-2xl bg-[#111A2E] border border-[#1E2A44] space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-serif-heading text-lg font-bold text-white">
                          What's Inside (Parts & Chapters)
                        </h3>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingBook({
                              ...editingBook,
                              whats_inside: [
                                ...editingBook.whats_inside,
                                {
                                  part: `Part ${editingBook.whats_inside.length + 1}`,
                                  title: 'New Section Title',
                                  chapters: ['Chapter: Practical Lesson'],
                                  pull_quote: 'Lesson quote',
                                },
                              ],
                            });
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#2FD6A0] text-slate-950 text-xs font-bold"
                        >
                          + Add Part
                        </button>
                      </div>

                      <div className="space-y-4">
                        {editingBook.whats_inside.map((part, pIdx) => (
                          <div
                            key={pIdx}
                            className="p-4 rounded-xl bg-[#0A0F1C] border border-[#1E2A44] space-y-3"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 flex-1">
                                <input
                                  type="text"
                                  value={part.part}
                                  onChange={(e) => {
                                    const copy = [...editingBook.whats_inside];
                                    copy[pIdx].part = e.target.value;
                                    setEditingBook({ ...editingBook, whats_inside: copy });
                                  }}
                                  className="w-24 px-2 py-1 rounded bg-[#111A2E] border border-[#1E2A44] text-[#E3B94A] font-mono text-xs font-bold"
                                />
                                <input
                                  type="text"
                                  value={part.title}
                                  onChange={(e) => {
                                    const copy = [...editingBook.whats_inside];
                                    copy[pIdx].title = e.target.value;
                                    setEditingBook({ ...editingBook, whats_inside: copy });
                                  }}
                                  className="flex-1 px-3 py-1 rounded bg-[#111A2E] border border-[#1E2A44] text-white text-xs font-bold"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const copy = editingBook.whats_inside.filter((_, i) => i !== pIdx);
                                  setEditingBook({ ...editingBook, whats_inside: copy });
                                }}
                                className="text-slate-500 hover:text-red-400 p-1"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            <div>
                              <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                                Pull Quote
                              </label>
                              <input
                                type="text"
                                value={part.pull_quote}
                                onChange={(e) => {
                                  const copy = [...editingBook.whats_inside];
                                  copy[pIdx].pull_quote = e.target.value;
                                  setEditingBook({ ...editingBook, whats_inside: copy });
                                }}
                                className="w-full px-2.5 py-1 rounded bg-[#111A2E] border border-[#1E2A44] text-[#2FD6A0] text-xs font-mono"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                                Chapters (One chapter per line)
                              </label>
                              <textarea
                                rows={2}
                                value={part.chapters.join('\n')}
                                onChange={(e) => {
                                  const copy = [...editingBook.whats_inside];
                                  copy[pIdx].chapters = e.target.value.split('\n');
                                  setEditingBook({ ...editingBook, whats_inside: copy });
                                }}
                                className="w-full px-2.5 py-1.5 rounded bg-[#111A2E] border border-[#1E2A44] text-slate-300 text-xs font-mono"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 8. TAKEAWAYS */}
                  {bookEditorTab === 'takeaways' && (
                    <div className="p-6 rounded-2xl bg-[#111A2E] border border-[#1E2A44] space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-serif-heading text-lg font-bold text-white">
                          Key Takeaways & Results
                        </h3>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingBook({
                              ...editingBook,
                              takeaways: [...editingBook.takeaways, 'New actionable outcome'],
                            });
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#2FD6A0] text-slate-950 font-bold text-xs"
                        >
                          + Add Takeaway
                        </button>
                      </div>

                      <div className="space-y-3">
                        {editingBook.takeaways.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-[#2FD6A0] shrink-0" />
                            <input
                              type="text"
                              value={item}
                              onChange={(e) => {
                                const copy = [...editingBook.takeaways];
                                copy[idx] = e.target.value;
                                setEditingBook({ ...editingBook, takeaways: copy });
                              }}
                              className="flex-1 px-3 py-2 rounded-lg bg-[#0A0F1C] border border-[#1E2A44] text-xs text-white"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const copy = editingBook.takeaways.filter((_, i) => i !== idx);
                                setEditingBook({ ...editingBook, takeaways: copy });
                              }}
                              className="p-1.5 text-slate-500 hover:text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 9. LEAD MAGNET (FREE CHAPTER) */}
                  {bookEditorTab === 'lead_magnet' && (
                    <div className="p-6 rounded-2xl bg-[#111A2E] border border-[#1E2A44] space-y-4">
                      <h3 className="font-serif-heading text-lg font-bold text-white">
                        Free Chapter Lead Magnet & Sample Delivery
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                            Card Title
                          </label>
                          <input
                            type="text"
                            value={editingBook.lead_magnet_title || 'Read Chapter 1 For Free'}
                            onChange={(e) =>
                              setEditingBook({ ...editingBook, lead_magnet_title: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-xl bg-[#0A0F1C] border border-[#1E2A44] text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                            Sample Chapter Title
                          </label>
                          <input
                            type="text"
                            value={editingBook.sample_chapter_title}
                            onChange={(e) =>
                              setEditingBook({
                                ...editingBook,
                                sample_chapter_title: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl bg-[#0A0F1C] border border-[#1E2A44] text-xs text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                          Sample Chapter Content Excerpt
                        </label>
                        <textarea
                          rows={5}
                          value={editingBook.sample_chapter_excerpt}
                          onChange={(e) =>
                            setEditingBook({
                              ...editingBook,
                              sample_chapter_excerpt: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-[#0A0F1C] border border-[#1E2A44] text-xs text-white leading-relaxed"
                        />
                      </div>
                    </div>
                  )}

                  {/* 10. AUTHOR SPOTLIGHT & PHOTO */}
                  {bookEditorTab === 'author' && (
                    <div className="p-6 rounded-2xl bg-[#111A2E] border border-[#1E2A44] space-y-6">
                      <h3 className="font-serif-heading text-lg font-bold text-white">
                        Author Spotlight & Profile Photo
                      </h3>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        <div className="lg:col-span-7 space-y-4">
                          <div>
                            <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                              Author Name
                            </label>
                            <input
                              type="text"
                              value={editingBook.author_name}
                              onChange={(e) =>
                                setEditingBook({ ...editingBook, author_name: e.target.value })
                              }
                              className="w-full px-3 py-2 rounded-xl bg-[#0A0F1C] border border-[#1E2A44] text-xs text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                              Brand Tag / Handle
                            </label>
                            <input
                              type="text"
                              value={editingBook.author_brand_tag || ''}
                              onChange={(e) =>
                                setEditingBook({ ...editingBook, author_brand_tag: e.target.value })
                              }
                              placeholder="Brand: Jade Capital · @the.jadecapital"
                              className="w-full px-3 py-2 rounded-xl bg-[#0A0F1C] border border-[#1E2A44] text-xs text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                              Author Biography
                            </label>
                            <textarea
                              rows={4}
                              value={editingBook.author_bio}
                              onChange={(e) =>
                                setEditingBook({ ...editingBook, author_bio: e.target.value })
                              }
                              className="w-full px-3 py-2 rounded-xl bg-[#0A0F1C] border border-[#1E2A44] text-xs text-white leading-relaxed"
                            />
                          </div>
                        </div>

                        <div className="lg:col-span-5 space-y-4">
                          <ImageUploader
                            label="Author Profile Picture"
                            sublabel="Upload author photo from your device"
                            value={editingBook.author_photo_url}
                            onChange={(newPhoto) =>
                              setEditingBook({ ...editingBook, author_photo_url: newPhoto })
                            }
                            aspectRatio="avatar"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 11. OFFER & GUARANTEE */}
                  {bookEditorTab === 'offer' && (
                    <div className="p-6 rounded-2xl bg-[#111A2E] border border-[#1E2A44] space-y-4">
                      <h3 className="font-serif-heading text-lg font-bold text-white">
                        Offer Inclusions & Guarantee Policy
                      </h3>

                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                          Included Deliverables (One per line)
                        </label>
                        <textarea
                          rows={4}
                          value={editingBook.offer_includes.join('\n')}
                          onChange={(e) =>
                            setEditingBook({
                              ...editingBook,
                              offer_includes: e.target.value.split('\n'),
                            })
                          }
                          className="w-full px-3 py-2.5 rounded-xl bg-[#0A0F1C] border border-[#1E2A44] text-white text-xs font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                          30-Day Money Back Guarantee Statement
                        </label>
                        <textarea
                          rows={3}
                          value={editingBook.guarantee_text}
                          onChange={(e) =>
                            setEditingBook({ ...editingBook, guarantee_text: e.target.value })
                          }
                          className="w-full px-3 py-2.5 rounded-xl bg-[#0A0F1C] border border-[#1E2A44] text-white text-xs"
                        />
                      </div>
                    </div>
                  )}

                  {/* 12. FINAL CTA */}
                  {bookEditorTab === 'final_cta' && (
                    <div className="p-6 rounded-2xl bg-[#111A2E] border border-[#1E2A44] space-y-4">
                      <h3 className="font-serif-heading text-lg font-bold text-white">
                        Final Call-To-Action Band Writeup
                      </h3>

                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                          Closing Headline
                        </label>
                        <input
                          type="text"
                          value={editingBook.final_cta_title || ''}
                          onChange={(e) =>
                            setEditingBook({ ...editingBook, final_cta_title: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-[#0A0F1C] border border-[#1E2A44] text-xs text-white font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                          Closing Subtitle
                        </label>
                        <textarea
                          rows={2}
                          value={editingBook.final_cta_subtitle || ''}
                          onChange={(e) =>
                            setEditingBook({ ...editingBook, final_cta_subtitle: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-[#0A0F1C] border border-[#1E2A44] text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                          CTA Button Label
                        </label>
                        <input
                          type="text"
                          value={editingBook.final_cta_button || ''}
                          onChange={(e) =>
                            setEditingBook({ ...editingBook, final_cta_button: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-[#0A0F1C] border border-[#1E2A44] text-xs text-white font-bold"
                        />
                      </div>
                    </div>
                  )}

                  {/* 13. SECTIONS CONFIG */}
                  {bookEditorTab === 'sections' && (
                    <div className="p-6 rounded-2xl bg-[#111A2E] border border-[#1E2A44] space-y-4">
                      <div>
                        <h3 className="font-serif-heading text-lg font-bold text-white">
                          Landing Page Section Visibility
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                          Toggle any block on or off for this specific book's landing page.
                        </p>
                      </div>

                      <div className="space-y-2">
                        {editingBook.sections_config.map((sec, idx) => (
                          <div
                            key={sec.key}
                            className="p-3.5 rounded-xl bg-[#0A0F1C] border border-[#1E2A44] flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-mono text-slate-500 w-6">#{idx + 1}</span>
                              <span className="text-xs font-semibold text-white">{sec.title}</span>
                              <span className="text-[10px] font-mono text-slate-500">({sec.key})</span>
                            </div>

                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={sec.enabled}
                                onChange={(e) => {
                                  const copy = [...editingBook.sections_config];
                                  copy[idx].enabled = e.target.checked;
                                  setEditingBook({ ...editingBook, sections_config: copy });
                                }}
                                className="sr-only peer"
                              />
                              <div className="w-9 h-5 bg-[#1E2A44] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2FD6A0]"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Save Bottom Bar */}
                  <div className="pt-4 flex items-center justify-between border-t border-[#1E2A44]">
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Delete "${editingBook.title}" permanently?`)) {
                          deleteBook(editingBook.id);
                          onRefreshData();
                          setEditingBook(books[0] || null);
                          showToast('Book deleted');
                        }
                      }}
                      className="px-3 py-2 text-xs text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Book</span>
                    </button>

                    <button
                      type="submit"
                      className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#E3B94A] hover:bg-[#CF9F30] text-slate-950 font-bold text-sm shadow-xl transition-all cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save All Changes</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB: OVERVIEW & ANALYTICS */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-white">
                    Publishing Analytics & Conversion
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Lightweight first-party conversion tracking. Real sales complete on Gumroad.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={exportLeadsToCSV}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#111A2E] hover:bg-[#15233e] border border-[#1E2A44] text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-[#2FD6A0]" />
                    <span>Export Leads CSV</span>
                  </button>
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-[#111A2E] border border-[#1E2A44]">
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                    Total Page Views
                  </span>
                  <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-mono">
                    {totalViews}
                  </p>
                  <span className="text-[10px] text-slate-500 mt-1 block">Live across all books</span>
                </div>

                <div className="p-5 rounded-2xl bg-[#111A2E] border border-[#1E2A44]">
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                    Gumroad CTA Clicks
                  </span>
                  <p className="text-2xl sm:text-3xl font-extrabold text-[#E3B94A] mt-1 font-mono">
                    {totalCtaClicks}
                  </p>
                  <span className="text-[10px] text-slate-500 mt-1 block">High-intent checkouts</span>
                </div>

                <div className="p-5 rounded-2xl bg-[#111A2E] border border-[#1E2A44]">
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                    Click-Through Rate (CTR)
                  </span>
                  <p className="text-2xl sm:text-3xl font-extrabold text-[#2FD6A0] mt-1 font-mono">
                    {ctr}%
                  </p>
                  <span className="text-[10px] text-slate-500 mt-1 block">Clicks ÷ Views</span>
                </div>

                <div className="p-5 rounded-2xl bg-[#111A2E] border border-[#1E2A44]">
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                    Captured Leads
                  </span>
                  <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-mono">
                    {totalLeads}
                  </p>
                  <span className="text-[10px] text-slate-500 mt-1 block">Free chapter readers</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB: TESTIMONIALS */}
          {activeTab === 'testimonials' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif-heading text-2xl font-bold text-white">
                    Reader Testimonials
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage reader quotes, author ratings, and toggle visibility.
                  </p>
                </div>

                <button
                  onClick={() => {
                    const newTestimonial: Testimonial = {
                      id: `test-${Date.now()}`,
                      book_id: books[0]?.id || null,
                      quote: 'Add reader quote here...',
                      name: 'Reader Name',
                      descriptor: 'City / Profession',
                      rating: 5,
                      approved: true,
                      sort_order: testimonials.length + 1,
                      date: 'Just now',
                    };
                    saveTestimonial(newTestimonial);
                    onRefreshData();
                    showToast('Added testimonial');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#2FD6A0] text-slate-950 font-bold text-xs cursor-pointer"
                >
                  + Add Testimonial
                </button>
              </div>

              <div className="space-y-4">
                {testimonials.map((t) => (
                  <div
                    key={t.id}
                    className="p-5 rounded-2xl bg-[#111A2E] border border-[#1E2A44] space-y-3"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <div className="flex text-[#E3B94A]">
                          {[...Array(t.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                        <span className="text-xs font-bold text-white">{t.name}</span>
                        <span className="text-slate-500">·</span>
                        <span className="text-xs text-slate-400">{t.descriptor}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            saveTestimonial({ ...t, approved: !t.approved });
                            onRefreshData();
                          }}
                          className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold cursor-pointer ${
                            t.approved
                              ? 'bg-[#2FD6A0]/20 text-[#2FD6A0]'
                              : 'bg-slate-700 text-slate-400'
                          }`}
                        >
                          {t.approved ? 'APPROVED' : 'HIDDEN'}
                        </button>
                        <button
                          onClick={() => {
                            deleteTestimonial(t.id);
                            onRefreshData();
                            showToast('Testimonial deleted');
                          }}
                          className="text-slate-500 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 italic font-light">
                      “{t.quote}”
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: FAQS */}
          {activeTab === 'faqs' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif-heading text-2xl font-bold text-white">
                    FAQ Manager
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage buyer questions and objections for the accordion blocks.
                  </p>
                </div>

                <button
                  onClick={() => {
                    const newFaq: FAQItem = {
                      id: `faq-${Date.now()}`,
                      book_id: null,
                      question: 'New question here?',
                      answer: 'Direct, clear response explaining delivery or terms.',
                      sort_order: faqs.length + 1,
                      enabled: true,
                    };
                    saveFAQ(newFaq);
                    onRefreshData();
                    showToast('Added FAQ');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#2FD6A0] text-slate-950 font-bold text-xs cursor-pointer"
                >
                  + Add FAQ
                </button>
              </div>

              <div className="space-y-3">
                {faqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="p-5 rounded-2xl bg-[#111A2E] border border-[#1E2A44] space-y-3"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => {
                          saveFAQ({ ...faq, question: e.target.value });
                          onRefreshData();
                        }}
                        className="flex-1 font-semibold text-white bg-transparent border-b border-transparent focus:border-[#2FD6A0] text-xs sm:text-sm"
                      />

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            saveFAQ({ ...faq, enabled: !faq.enabled });
                            onRefreshData();
                          }}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                            faq.enabled
                              ? 'bg-[#2FD6A0]/15 text-[#2FD6A0]'
                              : 'bg-slate-700 text-slate-400'
                          }`}
                        >
                          {faq.enabled ? 'ACTIVE' : 'OFF'}
                        </button>

                        <button
                          onClick={() => {
                            deleteFAQ(faq.id);
                            onRefreshData();
                          }}
                          className="text-slate-500 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <textarea
                      rows={2}
                      value={faq.answer}
                      onChange={(e) => {
                        saveFAQ({ ...faq, answer: e.target.value });
                        onRefreshData();
                      }}
                      className="w-full text-xs text-slate-300 bg-[#0A0F1C] p-2.5 rounded-lg border border-[#1E2A44]"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: LEADS */}
          {activeTab === 'leads' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif-heading text-2xl font-bold text-white">
                    Captured Reader Leads ({leads.length})
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Readers who downloaded sample chapters. Export to CSV for your email marketing list.
                  </p>
                </div>

                <button
                  onClick={exportLeadsToCSV}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2FD6A0] text-slate-950 font-bold text-xs shadow-md cursor-pointer shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Leads CSV</span>
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={leadSearch}
                    onChange={(e) => setLeadSearch(e.target.value)}
                    placeholder="Search by email..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#111A2E] border border-[#1E2A44] text-xs text-white"
                  />
                </div>

                <select
                  value={leadBookFilter}
                  onChange={(e) => setLeadBookFilter(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 rounded-xl bg-[#111A2E] border border-[#1E2A44] text-xs text-slate-300"
                >
                  <option value="all">All Books</option>
                  {books.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Leads Table */}
              <div className="rounded-2xl bg-[#111A2E] border border-[#1E2A44] overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#1E2A44] bg-[#0A0F1C] text-slate-400 font-mono">
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Book</th>
                      <th className="py-3 px-4">Source</th>
                      <th className="py-3 px-4">Captured At</th>
                      <th className="py-3 px-4 text-right">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E2A44]/60">
                    {filteredLeads.map((l) => (
                      <tr key={l.id} className="hover:bg-[#15233e]/50">
                        <td className="py-3 px-4 font-mono font-medium text-white">{l.email}</td>
                        <td className="py-3 px-4 text-slate-300">{l.book_title}</td>
                        <td className="py-3 px-4 text-slate-400">{l.source}</td>
                        <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                          {new Date(l.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              deleteLead(l.id);
                              onRefreshData();
                            }}
                            className="text-slate-500 hover:text-red-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredLeads.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-500">
                          No leads matching your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: SITE & BRAND SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif-heading text-2xl font-bold text-white">
                  Site & Brand Customization
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Customize the brand identity, logo image, global author, footer, and legal policies.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#111A2E] border border-[#1E2A44] space-y-6">
                {/* Brand & Logo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                        Brand Name
                      </label>
                      <input
                        type="text"
                        value={settings.brand_name}
                        onChange={(e) => {
                          const updated = { ...settings, brand_name: e.target.value };
                          saveSiteSettings(updated);
                          onRefreshData();
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-[#0A0F1C] border border-[#1E2A44] text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                        Default Author Name
                      </label>
                      <input
                        type="text"
                        value={settings.author_name}
                        onChange={(e) => {
                          const updated = { ...settings, author_name: e.target.value };
                          saveSiteSettings(updated);
                          onRefreshData();
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-[#0A0F1C] border border-[#1E2A44] text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                        Contact Support Email
                      </label>
                      <input
                        type="email"
                        value={settings.contact_email}
                        onChange={(e) => {
                          const updated = { ...settings, contact_email: e.target.value };
                          saveSiteSettings(updated);
                          onRefreshData();
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-[#0A0F1C] border border-[#1E2A44] text-xs text-white"
                      />
                    </div>
                  </div>

                  {/* Brand Logo Upload */}
                  <div>
                    <ImageUploader
                      label="Brand Header Logo Image"
                      sublabel="Upload logo file or paste image URL. If unset, the clean typography mark is used."
                      value={settings.logo_url}
                      onChange={(newLogo) => {
                        const updated = { ...settings, logo_url: newLogo };
                        saveSiteSettings(updated);
                        onRefreshData();
                      }}
                      aspectRatio="logo"
                    />
                  </div>
                </div>

                {/* Social Media Handles */}
                <div className="pt-4 border-t border-[#1E2A44] space-y-3">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-[#2FD6A0] font-bold">
                    Social Media Handles
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Instagram</label>
                      <input
                        type="text"
                        value={settings.socials.instagram}
                        onChange={(e) => {
                          const updated = {
                            ...settings,
                            socials: { ...settings.socials, instagram: e.target.value },
                          };
                          saveSiteSettings(updated);
                          onRefreshData();
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-[#0A0F1C] border border-[#1E2A44] text-xs text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">TikTok</label>
                      <input
                        type="text"
                        value={settings.socials.tiktok}
                        onChange={(e) => {
                          const updated = {
                            ...settings,
                            socials: { ...settings.socials, tiktok: e.target.value },
                          };
                          saveSiteSettings(updated);
                          onRefreshData();
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-[#0A0F1C] border border-[#1E2A44] text-xs text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">X (Twitter)</label>
                      <input
                        type="text"
                        value={settings.socials.x}
                        onChange={(e) => {
                          const updated = {
                            ...settings,
                            socials: { ...settings.socials, x: e.target.value },
                          };
                          saveSiteSettings(updated);
                          onRefreshData();
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-[#0A0F1C] border border-[#1E2A44] text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Copywriting */}
                <div className="pt-4 border-t border-[#1E2A44] space-y-3">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
                    Footer Writeups & Notices
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Copyright Line</label>
                      <input
                        type="text"
                        value={settings.footer_copyright || ''}
                        onChange={(e) => {
                          const updated = { ...settings, footer_copyright: e.target.value };
                          saveSiteSettings(updated);
                          onRefreshData();
                        }}
                        placeholder="© 2026 Jade Capital. All rights reserved."
                        className="w-full px-3 py-1.5 rounded-lg bg-[#0A0F1C] border border-[#1E2A44] text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        Security / Payment Notice
                      </label>
                      <input
                        type="text"
                        value={settings.footer_security_note || ''}
                        onChange={(e) => {
                          const updated = { ...settings, footer_security_note: e.target.value };
                          saveSiteSettings(updated);
                          onRefreshData();
                        }}
                        placeholder="Payments securely powered by Gumroad. 100% encrypted checkout."
                        className="w-full px-3 py-1.5 rounded-lg bg-[#0A0F1C] border border-[#1E2A44] text-xs text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Legal Policies */}
                <div className="pt-4 border-t border-[#1E2A44] space-y-3">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
                    Legal Policy Writeups
                  </h4>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1 font-mono uppercase">
                        Privacy Policy Text
                      </label>
                      <textarea
                        rows={3}
                        value={settings.legal_privacy}
                        onChange={(e) => {
                          const updated = { ...settings, legal_privacy: e.target.value };
                          saveSiteSettings(updated);
                          onRefreshData();
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-[#0A0F1C] border border-[#1E2A44] text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1 font-mono uppercase">
                        Terms of Service Text
                      </label>
                      <textarea
                        rows={3}
                        value={settings.legal_terms}
                        onChange={(e) => {
                          const updated = { ...settings, legal_terms: e.target.value };
                          saveSiteSettings(updated);
                          onRefreshData();
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-[#0A0F1C] border border-[#1E2A44] text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1 font-mono uppercase">
                        30-Day Refund Guarantee Policy Text
                      </label>
                      <textarea
                        rows={3}
                        value={settings.legal_refunds}
                        onChange={(e) => {
                          const updated = { ...settings, legal_refunds: e.target.value };
                          saveSiteSettings(updated);
                          onRefreshData();
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-[#0A0F1C] border border-[#1E2A44] text-xs text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="pt-6 border-t border-[#1E2A44]">
                  <h4 className="text-xs font-mono uppercase text-red-400 font-bold mb-1">
                    Danger Zone
                  </h4>
                  <p className="text-xs text-slate-400 mb-3">
                    Reset all books, writeups, and custom settings back to original seed defaults.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Reset everything back to factory seed data?')) {
                        resetToSeedData();
                        onRefreshData();
                        showToast('Reset to original seed data!');
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold hover:bg-red-500/30 cursor-pointer"
                  >
                    Reset All Data to Seed Defaults
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
