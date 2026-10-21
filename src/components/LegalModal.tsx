import React from 'react';
import { SiteSettings } from '../types';
import { X, ShieldCheck } from 'lucide-react';

interface LegalModalProps {
  type: 'privacy' | 'terms' | 'refunds' | null;
  onClose: () => void;
  settings: SiteSettings;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose, settings }) => {
  if (!type) return null;

  const titles = {
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    refunds: '30-Day Money-Back Guarantee Policy',
  };

  const content = {
    privacy:
      settings.legal_privacy ||
      'Jade Capital respects your privacy. We collect minimal customer contact details solely to deliver digital downloads and receipts. We never sell, rent, or share personal data with external third parties.',
    terms:
      settings.legal_terms ||
      'All guides, worksheets, materials, and audio files are copyrighted intellectual property of Jade Capital and Eleine Kayrah Jaine. Purchasing confers a personal single-user license.',
    refunds:
      settings.legal_refunds ||
      'We proudly provide a 30-Day Unconditional Money-Back Guarantee. If the book does not provide clear actionable value, simply contact our support team at contact@thejadecapital.com with your order confirmation for a complete refund.',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#111A2E] border border-[#1E2A44] shadow-2xl p-6 sm:p-8 text-left">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#1E2A44] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-4 h-4 text-[#2FD6A0]" />
          <span className="text-[11px] font-mono text-[#2FD6A0] uppercase tracking-wider">
            Jade Capital Legal
          </span>
        </div>

        <h3 className="font-serif-heading text-xl sm:text-2xl font-bold text-white mb-4">
          {titles[type]}
        </h3>

        <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3 max-h-[300px] overflow-y-auto pr-2">
          <p>{content[type]}</p>
          <p className="text-slate-400 text-xs pt-2 border-t border-[#1E2A44]">
            For questions or requests, reach out directly to{' '}
            <a
              href={`mailto:${settings.contact_email}`}
              className="text-[#2FD6A0] hover:underline"
            >
              {settings.contact_email}
            </a>
            .
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-[#1E2A44] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#1E2A44] hover:bg-[#253759] text-xs font-semibold text-white transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
