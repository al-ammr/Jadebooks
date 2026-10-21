import React from 'react';
import { Book } from '../types';

interface BookCover3DProps {
  book: Book;
  size?: 'normal' | 'small' | 'large';
  className?: string;
  interactive?: boolean;
}

export const BookCover3D: React.FC<BookCover3DProps> = ({
  book,
  size = 'normal',
  className = '',
  interactive = true,
}) => {
  const isLarge = size === 'large';
  const isSmall = size === 'small';

  const widthClass = isLarge
    ? 'w-[280px] sm:w-[320px] md:w-[360px] h-[410px] sm:h-[470px] md:h-[520px]'
    : isSmall
    ? 'w-[140px] h-[200px]'
    : 'w-[240px] sm:w-[280px] h-[350px] sm:h-[410px]';

  const accentColor = book.cover_theme?.accent_color || '#2FD6A0';
  const badgeLabel = book.cover_theme?.badge_label || 'JADE CAPITAL';

  return (
    <div className={`book-stage relative flex items-center justify-center p-4 ${className}`}>
      {/* Ambient Floor Shadow with Soft Brand Glow */}
      <div
        className="absolute -bottom-6 w-3/4 h-8 rounded-full blur-xl pointer-events-none transition-all duration-500"
        style={{
          background: `radial-gradient(ellipse at center, ${accentColor}33 0%, rgba(0,0,0,0.85) 70%, transparent 100%)`,
        }}
      />

      {/* 3D Book Container */}
      <div
        className={`book-3d ${widthClass} relative rounded-r-md select-none ${
          interactive ? 'cursor-pointer' : ''
        }`}
        style={{
          boxShadow: `
            -16px 20px 40px -10px rgba(0, 0, 0, 0.9),
            -4px 6px 15px -4px rgba(0, 0, 0, 0.6),
            0 0 35px ${accentColor}22
          `,
        }}
      >
        {/* Book Spine (Left 3D side) */}
        <div
          className="book-spine rounded-l-xs flex flex-col justify-between items-center py-5 text-white/90 overflow-hidden"
          style={{
            background: 'linear-gradient(90deg, #050912 0%, #152238 60%, #080E1C 100%)',
            borderRight: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <span className="text-[7px] tracking-widest text-[#E3B94A] uppercase font-bold rotate-90 mt-2">
            JC
          </span>
          <span className="text-[9px] tracking-wider text-slate-300 font-medium rotate-90 whitespace-nowrap max-w-[200px] truncate">
            {book.title}
          </span>
          <span className="text-[7px] text-slate-400 rotate-90 mb-2">JAINE</span>
        </div>

        {/* Book Paper Pages Edge (Right 3D side) */}
        <div className="book-pages-edge" />

        {/* Front Cover Face */}
        <div
          className="w-full h-full rounded-r-md relative overflow-hidden flex flex-col justify-between p-5 sm:p-7 z-10 border border-white/10"
          style={{
            background:
              book.cover_theme?.primary_gradient === 'custom'
                ? '#0A0F1C'
                : 'linear-gradient(145deg, #0d172a 0%, #09101f 45%, #050a14 100%)',
          }}
        >
          {/* Custom Uploaded Graphic Cover */}
          {book.cover_image_url ? (
            <>
              <img
                src={book.cover_image_url}
                alt={book.title}
                className="absolute inset-0 w-full h-full object-cover z-0"
              />
              {/* Optional Subtle Badge on Custom Cover */}
              <div className="relative z-20 flex justify-end">
                <span
                  className="text-[8px] font-semibold tracking-wider px-2 py-0.5 rounded text-black font-mono uppercase shadow-md"
                  style={{ backgroundColor: accentColor }}
                >
                  {badgeLabel}
                </span>
              </div>
            </>
          ) : (
            /* Built-in Fallback CSS Cover Artwork */
            <>
              {/* Cover Header */}
              <div className="relative z-20 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: accentColor }}
                  />
                  <span className="text-[10px] font-bold tracking-[0.25em] text-slate-300 uppercase">
                    JADE CAPITAL
                  </span>
                </div>
                <span
                  className="text-[9px] font-semibold tracking-wider px-2 py-0.5 rounded text-black font-mono uppercase"
                  style={{ backgroundColor: accentColor }}
                >
                  {badgeLabel}
                </span>
              </div>

              {/* Cover Center Typography & Motif */}
              <div className="relative z-20 my-auto text-center py-4">
                <div className="w-12 h-[1px] mx-auto mb-4 bg-gradient-to-r from-transparent via-[#E3B94A] to-transparent opacity-80" />

                <p className="text-[11px] sm:text-xs text-[#E3B94A] tracking-wider uppercase font-medium mb-2 font-mono">
                  {book.series_line ? 'FIELD GUIDE' : 'EDITION'}
                </p>

                <h3 className="font-serif-heading text-2xl sm:text-3xl font-extrabold text-white leading-tight tracking-tight drop-shadow-md">
                  {book.title}
                </h3>

                {book.subtitle && !isSmall && (
                  <p className="text-[11px] sm:text-xs text-slate-300/90 font-light mt-3 px-2 line-clamp-3 leading-relaxed">
                    {book.subtitle}
                  </p>
                )}

                <div className="w-8 h-[1px] mx-auto mt-4 bg-gradient-to-r from-transparent via-[#2FD6A0] to-transparent opacity-60" />
              </div>

              {/* Cover Footer Byline */}
              <div className="relative z-20 pt-3 border-t border-white/10 flex items-center justify-between text-left">
                <div>
                  <p className="text-[9px] tracking-wider text-slate-400 uppercase font-mono">
                    Author
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-white tracking-wide">
                    {book.author_name}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-[#E3B94A] font-mono tracking-widest uppercase">
                    FIRST ED.
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Luxury Sheen & Spine Hinge Reflection (Applied to both modes) */}
          <div
            className="absolute inset-0 pointer-events-none z-10 opacity-70"
            style={{
              background: `
                linear-gradient(90deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.03) 4%, transparent 10%, rgba(255,255,255,0.05) 75%, transparent 100%)
              `,
            }}
          />

          {/* Diagonal Glass Sheen Highlight */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.05] to-transparent pointer-events-none z-10" />

          {/* Spine Fold Texture Crease */}
          <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/60 via-black/25 to-transparent pointer-events-none z-20" />
        </div>
      </div>
    </div>
  );
};
