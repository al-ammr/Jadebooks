import React, { useState, useRef, useEffect } from 'react';
import { Book } from '../types';
import { ChevronDown, BookOpen, Settings, Check } from 'lucide-react';

interface TopNavProps {
  currentBook: Book;
  allBooks: Book[];
  settings?: import('../types').SiteSettings;
  onSelectBook: (slug: string) => void;
  onOpenAdmin: () => void;
  onCtaClick: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentBook,
  allBooks,
  settings,
  onSelectBook,
  onOpenAdmin,
  onCtaClick,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const publishedBooks = allBooks.filter((b) => b.status === 'published');
  const brandName = settings?.brand_name || 'Jade Capital';

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#0A0F1C]/90 border-b border-[#1E2A44] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href={`#top`}
            className="flex items-center gap-2 group text-white hover:text-[#2FD6A0] transition-colors"
          >
            {settings?.logo_url ? (
              <img
                src={settings.logo_url}
                alt={brandName}
                className="h-8 max-w-[120px] object-contain rounded"
              />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-[#111A2E] border border-[#1E2A44] flex items-center justify-center text-[#2FD6A0] font-bold text-sm group-hover:border-[#2FD6A0]/40 transition-colors">
                JC
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-serif-heading font-bold text-base sm:text-lg tracking-tight text-white group-hover:text-[#2FD6A0] transition-colors whitespace-nowrap">
                {brandName}
              </span>
            </div>
          </a>
        </div>

        {/* Zone 2: Book Switcher Menu */}
        <div className="relative shrink-0" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#111A2E] hover:bg-[#15233e] border border-[#1E2A44] hover:border-[#2FD6A0]/40 text-xs sm:text-sm font-medium text-slate-200 transition-all cursor-pointer"
            aria-expanded={dropdownOpen}
            aria-label="Switch selected book"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#2FD6A0] shrink-0" />
            <span className="max-w-[130px] sm:max-w-[220px] md:max-w-[280px] truncate text-slate-100 font-semibold">
              {currentBook.title}
            </span>
            <span className="text-[11px] text-[#2FD6A0] font-mono shrink-0 hidden md:inline">
              {currentBook.sale_price}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                dropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Book Switcher Dropdown */}
          {dropdownOpen && (
            <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-[280px] sm:w-[320px] rounded-xl bg-[#111A2E] border border-[#1E2A44] shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2 border-b border-[#1E2A44]/80 flex items-center justify-between">
                <span className="text-[11px] font-mono tracking-wider uppercase text-slate-400">
                  Select Book ({publishedBooks.length})
                </span>
                <span className="text-[10px] text-[#2FD6A0] font-medium">Instant Switch</span>
              </div>

              <div className="py-1 max-h-[300px] overflow-y-auto space-y-1">
                {publishedBooks.map((book) => {
                  const isCurrent = book.slug === currentBook.slug;
                  return (
                    <button
                      key={book.id}
                      onClick={() => {
                        onSelectBook(book.slug);
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-lg flex items-start justify-between gap-2 transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-[#1E2A44]/60 text-white border border-[#2FD6A0]/30'
                          : 'hover:bg-[#15233e] text-slate-300 hover:text-white'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs sm:text-sm font-semibold truncate text-slate-100">
                            {book.title}
                          </p>
                          {isCurrent && (
                            <Check className="w-3.5 h-3.5 text-[#2FD6A0] shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {book.subtitle}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-[#E3B94A] font-mono block">
                          {book.sale_price}
                        </span>
                        <span className="text-[10px] text-slate-500 line-through font-mono block">
                          {book.original_price}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Zone 3: Direct Actions (CTA & Admin link) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#111A2E] text-xs font-medium transition-colors cursor-pointer"
            title="Open Admin Dashboard"
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Admin</span>
          </button>

          <button
            onClick={onCtaClick}
            className="gumroad-button flex items-center justify-center px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-[#E3B94A] hover:bg-[#CF9F30] text-slate-950 font-semibold text-xs sm:text-sm transition-all shadow-md hover:shadow-lg hover:shadow-[#E3B94A]/20 cursor-pointer whitespace-nowrap"
          >
            {currentBook.cta_label || `Get Book — ${currentBook.sale_price}`}
          </button>
        </div>
      </div>
    </header>
  );
};
