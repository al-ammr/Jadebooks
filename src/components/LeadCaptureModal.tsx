import React, { useState } from 'react';
import { Book } from '../types';
import { addLead, trackEvent } from '../services/storage';
import { X, CheckCircle, BookOpen, Download, Mail, ArrowRight } from 'lucide-react';

interface LeadCaptureModalProps {
  book: Book;
  isOpen: boolean;
  onClose: () => void;
  onGumroadCheckout: () => void;
}

export const LeadCaptureModal: React.FC<LeadCaptureModalProps> = ({
  book,
  isOpen,
  onClose,
  onGumroadCheckout,
}) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    addLead({
      book_id: book.id,
      book_title: book.title,
      email: email.trim(),
      source: 'Free Chapter Modal',
    });

    trackEvent(book.id, 'lead_submit');
    setSubmitted(true);
    setIsReading(true);
    setError('');
  };

  const downloadSampleFile = () => {
    const textContent = `JADE CAPITAL PUBLISHING\nAuthor: ${book.author_name}\nBook: ${book.title}\nSubtitle: ${book.subtitle}\n\n=========================================\n${book.sample_chapter_title}\n=========================================\n\n${book.sample_chapter_excerpt}\n\n-----------------------------------------\nGet the full 185-page guide, worksheets, and scorecards at:\n${book.gumroad_url}\n`;
    const element = document.createElement('a');
    const file = new Blob([textContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${book.slug}-sample-chapter-1.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl bg-[#111A2E] border border-[#1E2A44] shadow-2xl p-6 sm:p-8 text-left max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#1E2A44] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#2FD6A0] font-semibold">
                Free Sample Chapter
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-[11px] text-slate-400">PDF & EPUB Preview</span>
            </div>

            <h3 className="font-serif-heading text-2xl sm:text-3xl font-bold text-white mb-2">
              Read {book.title} — Chapter 1
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              Enter your email below to unlock the complete first chapter immediately. No spam, ever.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                  Your Best Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    placeholder="e.g. yourname@domain.com"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0A0F1C] border border-[#1E2A44] text-white placeholder-slate-500 focus:outline-none focus:border-[#2FD6A0] text-sm transition-colors"
                  />
                </div>
                {error && <p className="text-xs text-[#F26D6D] mt-1.5">{error}</p>}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-[#2FD6A0] hover:bg-[#25B586] text-slate-950 font-bold text-sm tracking-wide transition-all shadow-lg hover:shadow-[#2FD6A0]/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Unlock Sample Chapter</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-4 pt-4 border-t border-[#1E2A44]/60 flex items-center justify-between text-[11px] text-slate-400">
              <span>Instant browser delivery</span>
              <span>100% Privacy guaranteed</span>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#2FD6A0]/10 border border-[#2FD6A0]/20">
              <CheckCircle className="w-5 h-5 text-[#2FD6A0] shrink-0" />
              <div className="text-xs text-slate-200">
                <span className="font-semibold text-white">Access Granted:</span> You now have full access to Chapter 1 below.
              </div>
            </div>

            {/* In-Browser Reader */}
            <div className="rounded-xl bg-[#0A0F1C] p-5 border border-[#1E2A44] space-y-4">
              <div className="border-b border-[#1E2A44] pb-3">
                <span className="text-[10px] font-mono tracking-wider uppercase text-[#E3B94A]">
                  Full Chapter Excerpt
                </span>
                <h4 className="font-serif-heading text-lg font-bold text-white mt-1">
                  {book.sample_chapter_title}
                </h4>
              </div>

              <div className="text-sm text-slate-300 leading-relaxed space-y-3 max-h-[220px] overflow-y-auto pr-2">
                <p>{book.sample_chapter_excerpt}</p>
                <p>
                  When you obsess over response lag, you aren't listening to the other person. You are projecting your deepest insecurities onto an empty glass. Real clarity comes when you decide that your self-worth is non-negotiable.
                </p>
                <p className="italic text-slate-400 border-l-2 border-[#2FD6A0] pl-3 py-1">
                  "Interest is not measured in minutes. Attention is not intention."
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  onClick={downloadSampleFile}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#1E2A44] hover:bg-[#253759] text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#2FD6A0]" />
                  <span>Download Sample (.txt)</span>
                </button>
              </div>
            </div>

            {/* Upsell to complete guide */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#14233C] to-[#121B2F] border border-[#E3B94A]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs text-[#E3B94A] font-semibold">
                  Ready for the full 185-page guide & scorecards?
                </p>
                <p className="text-xs text-slate-300">
                  Get instant access for only <span className="font-mono font-bold text-white">{book.sale_price}</span> (save {book.discount_badge})
                </p>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onGumroadCheckout();
                }}
                className="px-4 py-2.5 rounded-xl bg-[#E3B94A] hover:bg-[#CF9F30] text-slate-950 font-bold text-xs shrink-0 cursor-pointer shadow-md transition-all"
              >
                Get Full Book
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
