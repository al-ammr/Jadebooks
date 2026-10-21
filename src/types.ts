export interface CoverTheme {
  primary_gradient: string;
  accent_color: string;
  gold_foil: boolean;
  badge_label: string;
}

export interface WhatsInsidePart {
  part: string;
  title: string;
  chapters: string[];
  pull_quote: string;
}

export interface SectionConfigItem {
  key: string;
  title: string;
  enabled: boolean;
  order: number;
}

export interface Book {
  id: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  is_featured: boolean;
  title: string;
  subtitle: string;
  series_line: string;
  author_name: string;
  
  // Hero section
  hero_kicker?: string;
  hero_headline: string;
  hero_subheadline: string;
  cta_label: string;
  original_price: string;
  sale_price: string;
  discount_badge: string;
  price_note: string;
  proof_rating_text?: string;
  proof_readers_count?: string;
  proof_support_text?: string;
  
  // Gumroad integration
  gumroad_url: string;
  checkout_mode: 'overlay' | 'redirect';
  discount_code?: string;
  
  // Images & 3D Cover
  cover_image_url?: string;
  cover_theme: CoverTheme;
  formats: string[];
  
  // Pain Points ("Does this sound like you?")
  pain_points_kicker?: string;
  pain_points_title?: string;
  pain_points_subtitle?: string;
  pain_points_cta?: string;
  pain_points: string[];
  
  // Problem & Promise
  problem_promise_kicker?: string;
  problem_promise_title: string;
  problem_promise_quote: string;
  problem_promise_text: string;
  problem_promise_from_title?: string;
  problem_promise_from_text?: string;
  problem_promise_to_title?: string;
  problem_promise_to_text?: string;
  
  // What's Inside (Curriculum)
  whats_inside_kicker?: string;
  whats_inside_title?: string;
  whats_inside_subtitle?: string;
  whats_inside_cta?: string;
  whats_inside: WhatsInsidePart[];
  
  // Key Takeaways
  takeaways_kicker?: string;
  takeaways_title?: string;
  takeaways_subtitle?: string;
  takeaways: string[];
  
  // Sample Chapter Lead Magnet
  lead_magnet_kicker?: string;
  lead_magnet_title?: string;
  lead_magnet_subtitle?: string;
  lead_magnet_cta?: string;
  sample_chapter_title: string;
  sample_chapter_excerpt: string;
  
  // Reader Reviews / Testimonials header
  testimonials_kicker?: string;
  testimonials_title?: string;
  testimonials_subtitle?: string;
  
  // Author
  author_kicker?: string;
  author_brand_tag?: string;
  author_bio: string;
  author_photo_url?: string;
  
  // Offer / Pricing Block
  offer_kicker?: string;
  offer_title?: string;
  offer_includes: string[];
  guarantee_text?: string;
  
  // FAQ Header
  faqs_kicker?: string;
  faqs_title?: string;
  
  // Final CTA Band
  final_cta_title?: string;
  final_cta_subtitle?: string;
  final_cta_button?: string;
  
  // Sections configuration
  sections_config: SectionConfigItem[];
  
  // SEO
  seo_title: string;
  seo_description: string;
  
  published_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  book_id: string | null;
  quote: string;
  name: string;
  descriptor: string;
  rating: number;
  approved: boolean;
  sort_order: number;
  date: string;
}

export interface FAQItem {
  id: string;
  book_id: string | null;
  question: string;
  answer: string;
  sort_order: number;
  enabled: boolean;
}

export interface Lead {
  id: string;
  book_id: string;
  book_title: string;
  email: string;
  created_at: string;
  source: string;
}

export interface AnalyticsEvent {
  id: string;
  book_id: string;
  type: 'page_view' | 'cta_click' | 'lead_submit' | 'scroll_50' | 'scroll_90';
  cta_location?: string;
  session_id: string;
  created_at: string;
}

export interface SiteSettings {
  brand_name: string;
  logo_url?: string;
  author_name: string;
  author_photo_url?: string;
  author_bio?: string;
  contact_email: string;
  socials: {
    instagram: string;
    tiktok: string;
    x: string;
    youtube: string;
    facebook: string;
  };
  meta_pixel_id: string;
  ga4_id: string;
  footer_copyright?: string;
  footer_security_note?: string;
  legal_privacy: string;
  legal_terms: string;
  legal_refunds: string;
  theme?: {
    accent_color: string;
    cta_gold: string;
    bg_color: string;
  };
}
