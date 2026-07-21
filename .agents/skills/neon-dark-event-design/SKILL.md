---
name: neon-dark-event-design
description: Bold, high-contrast dark UI design system with an electric chartreuse/lime accent color, inspired by sports & event landing pages (e.g. marathon registration sites). Use this whenever building a webpage, landing page, dashboard, or UI component that should feel energetic, modern, and bold — dark near-black backgrounds, lime-yellow accent, pill-shaped buttons, dark cards with subtle borders, duotone/gradient-overlaid photography, and bento-style asymmetric grids. Trigger this any time the user references "the marathon design," "dark theme with yellow-green/lime accent," "neon dark," or asks for a bold/energetic aesthetic similar to event or sports registration sites. Pair with the frontend-design skill for general layout/Tailwind constraints in this environment — this skill supplies the specific color tokens, type treatment, and component patterns to use on top of that.
---

# Neon Dark Event Design

A design system extracted from a marathon-registration landing page reference. Dark,
confident, high-energy — built around one saturated accent color against near-black,
with generous use of rounded cards and pill buttons.

## Color tokens

Sampled directly from the reference (use these, don't approximate from memory):

| Token | Hex | Use |
|---|---|---|
| `--bg-base` | `#0A0A0A` | Page background |
| `--bg-panel` | `#1A1A1A` | Card / section background (one step lighter than base) |
| `--bg-panel-raised` | `#202020` | Nested cards, hover states |
| `--accent` | `#E8F802` | Primary accent — chartreuse/lime. CTAs, highlights, active states, route lines |
| `--accent-dim` | `#B8C400` | Accent on hover/pressed, or where full brightness is too loud |
| `--text-primary` | `#F0F0F0` | Headlines, primary copy |
| `--text-secondary` | `#A0A0A0` | Supporting copy, captions, metadata |
| `--border-subtle` | `rgba(255,255,255,0.08)` | 1px hairline borders on dark cards |
| `--border-accent` | `rgba(232,248,2,0.4)` | Border/glow on cards that need to pop (e.g. featured route card) |

Rule of thumb: **one accent color, used sparingly but decisively.** Lime never appears
as a large fill except on primary CTA buttons and small badges — everywhere else it's a
thin border, an icon, a line, or text on a dark chip. Large lime fills read as gaudy;
lime-as-punctuation reads as premium.

## Typography

- Headlines: bold, condensed/tight-tracking grotesk (e.g. Archivo, Barlow Condensed,
  Inter with tight letter-spacing). Large sizes (40–64px for hero), all-caps for
  section eyebrows and stat labels.
- Eyebrow labels ("SAVE THE DATE", "ROUTE DETAIL", "OUR SPONSORS"): small (11–13px),
  uppercase, letter-spacing +0.1em, `--text-secondary` or `--accent`.
- Body copy: regular weight, `--text-secondary`, comfortable line-height (1.5+) — the
  bold display type carries the energy so body text can stay calm and readable.
- Big numbers/stats (e.g. "4,702 registered"): oversized bold numerals in
  `--text-primary`, small caption label directly beneath in `--text-secondary`.

## Components

**Buttons**
- Primary: fully pill-shaped (border-radius: 999px), `--accent` fill, near-black text,
  bold weight, generous horizontal padding (24–32px).
- Secondary: pill-shaped, transparent fill, 1px `--text-secondary` or white border,
  white text.

**Cards**
- `--bg-panel` background, 16–20px border-radius, `--border-subtle` 1px border.
- Featured/highlighted cards upgrade to `--border-accent` border or a soft lime glow
  (box-shadow with low-opacity accent color).
- Cards holding a photo: image fills the top, with a bottom-anchored linear gradient
  (transparent → `--bg-base`) so text overlaid on the image stays legible.

**Badges / pills**
- Small rounded-rect or full-pill tags, `--accent` fill with near-black bold text
  (e.g. a "10K" distance tag). Used to flag categories, not for general labeling.

**Avatars / portraits**
- Circular or rounded-square crop, thin `--accent` ring border when the person is
  featured/highlighted (e.g. guest performers).

**Route / timeline / step lists**
- Vertical dashed or dotted connector line in `--text-secondary` or `--accent`,
  numbered circular nodes at each step, step content in a card to the right.

**Sponsor / logo strips**
- Logos desaturated to grayscale/white, laid out in a simple evenly-spaced row —
  keeps focus on the accent color elsewhere on the page.

**Layout**
- Bento-style grid: asymmetric card sizes (one large hero/feature card + several
  smaller supporting cards), not a uniform grid. Generous gaps between cards (16–24px)
  so the dark background shows through as negative space.
- Hero sections often split ~60/40: bold headline + CTA on one side, a stat card or
  photo collage on the other.

## Applying this to a different domain

This reference is a sports/event site, so the energy level (neon, bold, loud CTAs) fits
its purpose. If you're asked to apply this system to a different kind of product —
e.g. a clinical or field-worker tool where clarity, calm, and fast scanning under
pressure matter more than excitement — carry over the *structural* patterns (dark
panels, pill buttons, card-based bento layout, thin accent borders, bold headline
type) but consider:
- Dropping the accent saturation/brightness a notch, or reserving full-brightness lime
  strictly for primary actions and status/alert indicators (which actually benefits
  from a high-visibility color).
- Checking contrast: `--accent` (#E8F802) on `--bg-base` easily passes WCAG AA for
  large text but verify for small text and for any accent-on-white combinations.
- Considering a light-mode variant if the tool will be used outdoors or on
  low-brightness field devices — dark UI is stylish but can be harder to read in
  bright sunlight, which matters for community health worker tools used in the field.

Always confirm with the user whether they want the aesthetic applied as-is or adapted
before committing to a full dark neon theme on a non-event product.
