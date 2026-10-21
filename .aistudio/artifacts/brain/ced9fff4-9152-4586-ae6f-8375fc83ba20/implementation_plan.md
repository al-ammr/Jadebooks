# Jade Capital — Multi-Book Landing Page & Publishing System

Comprehensive architecture and design plan for Jade Capital's multi-book landing page engine. Delivers high-converting, mobile-first book landing pages with custom 3D book cover mockups, original vs. discounted pricing with savings callouts, streamlined book switcher navigation, Gumroad overlay checkout, free-chapter lead capture, and an administrative management dashboard.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural decisions were aligned during Phase 1 interactive clarification:

- **Top Navigation & Book Switcher**: Subtle, high-contrast top bar with the Jade Capital brand wordmark, a quick book-switcher menu (`Stop Overthinking Her`, `The Attraction Equation`, `Unbreakable Frame`), and an Admin Portal access button.
- **Pricing & Discount Display**: High-impact e-commerce pricing format featuring strikethrough original price (`$29.99`), vibrant sale price (`$14.99`), and an emerald discount savings badge (`50% OFF · Save $15`).
- **Initial Catalog**: Pre-seeded with the primary release *"Stop Overthinking Her"* (full manuscript-drawn copy) plus two companion relationship/dating titles to demonstrate seamless book-to-book switching, individual pricing, and distinct section configurations.

---

## 1. Overview & Core Concept

**Jade Capital** is a premium publishing brand authored by **Eleine Kayrah Jaine** (@the.jadecapital), delivering calm, practical guides for modern men on dating, attraction, texting, and emotional control.

The system serves two audiences:
1. **Readers & Buyers (Public Funnel)**: Fast, distraction-free landing pages optimized for maximum checkout conversion, risk reduction, and social proof. Every CTA drives users directly to the Gumroad checkout overlay.
2. **Author / Publisher (Admin Dashboard)**: A self-contained dashboard at `/admin` to create new books, duplicate existing books in one click, adjust prices & discount percentages, reorder/toggle page sections, manage testimonials & FAQs, review leads, and track conversion KPIs.

---

## 2. User Experience & Visual Design

### Visual Identity & Theme
- **Atmosphere**: Deep navy-black canvas (`#0A0F1C`), elevated navy surfaces (`#111A2E`), hairline borders (`#1E2A44`), and high-contrast typography.
- **Brand Accents**: Vibrant Jade Emerald (`#2FD6A0`) for brand highlights and trust badges; Rich Gold (`#E3B94A`) reserved strictly for Primary CTAs and focal price emphasis to guarantee maximum contrast against dark backgrounds.
- **Typography**: Editorial high-contrast serif display for headlines (`Playfair Display` / `Fraunces` style) paired with clean geometric body text (`Plus Jakarta Sans` / `Inter`).
- **Anti-Slop Discipline**: Zero static pills/badges sandwiching titles, no mechanical comment headers (`// 01`), no fake pulsing green dots, and clean unboxed metadata separated by quiet middots (`·`).

### Key User Flows

```
[ Visitor Lands on /books/:slug ]
           │
           ├── Top Header: Jade Capital Mark + Book Switcher Dropdown
           │
           ├── Hero: 3D Float Cover + Benefit Headline + Strike/Sale Price + Primary Gold CTA
           │
           ├── Pain Points ("Does this sound like you?") — 6 relatable inner-voice checks
           │
           ├── The Problem & Promise: Narrative transformation ("Not certainty. Clarity.")
           │
           ├── What's Inside: 8 Parts & 18 Chapters collapsible curriculum + pull quotes
           │
           ├── Lead Magnet Card: "Read Chapter 1 Free" (email capture → instant download)
           │
           ├── Social Proof: Curated, verified reader testimonials & ratings
           │
           ├── Author Spotlight: Eleine Kayrah Jaine bio, philosophy, and verified socials
           │
           ├── Offer Breakdown: Formats, bonuses, guarantee, and final conversion block
           │
           └── Sticky Mobile CTA Bar: Appears on scroll with price & 1-tap checkout
```

### 3D Book Cover & Media Presentation
- Custom 3D CSS perspective book mockup with realistic depth, lighting gloss, page edges, and soft emerald shadow glow.
- Responsive book switching that transitions cover art, color accents, pricing details, and curriculum without page reloads.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Client-Side State with Persistent Local Storage + Seed Database**
  - *Chosen Approach*: Robust client-side database layer initialized from rich seed data and saved to `localStorage`, with export/import capabilities and full CRUD.
  - *Why*: Allows instant preview, book duplication, price edits, lead collection, and section toggling out-of-the-box without requiring external database provisioning delays, while remaining 100% compatible with Supabase/Cloud SQL backend migration.
- **Decision 2: Gumroad Overlay Checkout with Fallback Redirect**
  - *Chosen Approach*: Embeds `gumroad.js` dynamically so users checkout in an on-page modal without leaving the landing page, automatically appending UTM tags and discounts.
  - *Why*: Research indicates keeping users on-page boosts completion rates, while the fallback ensures visitors with ad-blockers can still purchase seamlessly.
- **Decision 3: Zero-Friction Lead Capture with Instant Digital Delivery**
  - *Chosen Approach*: Single-input email capture for the free sample chapter. Upon submission, the email is logged to Admin Leads and the user receives immediate in-browser reading/download access alongside a confirmation state.

---

## 4. Technical Architecture & Data Strategy

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Jade Capital Client SPA                           │
├──────────────────────────────────────┬──────────────────────────────────────┤
│             Public Funnel            │           Admin Management           │
│                                      │                                      │
│  ┌────────────────────────────────┐  │  ┌────────────────────────────────┐  │
│  │ Top Bar: Book Switcher Menu    │  │  │ Dashboard Overview (KPIs/CTR)  │  │
│  ├────────────────────────────────┤  │  ├────────────────────────────────┤  │
│  │ Hero & 3D Cover Mockup         │  │  │ Book Manager & Tabbed Editor   │  │
│  ├────────────────────────────────┤  │  ├────────────────────────────────┤  │
│  │ Price & Discount Off Block     │  │  │ - Price & Discount Off Editor  │  │
│  ├────────────────────────────────┤  │  │ - 1-Click "Duplicate Book"     │  │
│  │ Pain Points & Narrative Flow   │  │  │ - Section Reordering & Toggles │  │
│  ├────────────────────────────────┤  │  ├────────────────────────────────┤  │
│  │ What's Inside (Parts/Chapters) │  │  │ Testimonials & FAQs Manager    │  │
│  ├────────────────────────────────┤  │  ├────────────────────────────────┤  │
│  │ Free Chapter Lead Magnet       │  │  │ Leads Table & CSV Export       │  │
│  ├────────────────────────────────┤  │  ├────────────────────────────────┤  │
│  │ Sticky Mobile CTA Bar          │  │  │ Settings (Socials, Brand, Bio) │  │
│  └────────────────────────────────┘  │  └────────────────────────────────┘  │
├──────────────────────────────────────┴──────────────────────────────────────┤
│                         Data & Persistence Engine                           │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ • LocalStorage Repository (Books, Leads, FAQs, Testimonials, Analytics)│  │
│  │ • Gumroad Overlay Script Integration (Deferred JS loader + UTM)        │  │
│  │ • First-Party Event Bus (page_view, cta_click, lead_submit)           │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Core Entities & Data Schema

1. **Book Model (`Book`)**:
   - `id`, `slug`, `title`, `subtitle`, `series_line`, `status` (`published` | `draft`)
   - `original_price` (e.g. `"$29.99"`), `sale_price` (e.g. `"$14.99"`), `discount_percent` (`50%`)
   - `cover_image_url`, `spine_title`, `badge_text`
   - `gumroad_url`, `cta_label`, `price_note`
   - `pain_points` (`string[]`), `problem_promise` (markdown/narrative)
   - `whats_inside` (`{ part: string, chapters: string[], pull_quote: string }[]`)
   - `takeaways` (`string[]`), `offer_includes` (`string[]`), `guarantee_text`
   - `sections_config` (`{ key: string, enabled: boolean, order: number }[]`)
2. **Lead Model (`Lead`)**:
   - `id`, `book_id`, `email`, `created_at`, `source`
3. **Testimonial & FAQ Models**:
   - Per-book and global assignment with approval toggles.
