---
name: Editorial Travel Atelier
colors:
  surface: '#fcf9f4'
  surface-dim: '#dcdad5'
  surface-bright: '#fcf9f4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3ee'
  surface-container: '#f0ede9'
  surface-container-high: '#ebe8e3'
  surface-container-highest: '#e5e2dd'
  on-surface: '#1c1c19'
  on-surface-variant: '#404848'
  inverse-surface: '#31302d'
  inverse-on-surface: '#f3f0eb'
  outline: '#707978'
  outline-variant: '#bfc8c8'
  surface-tint: '#306767'
  primary: '#003434'
  on-primary: '#ffffff'
  primary-container: '#0f4c4c'
  on-primary-container: '#85bbbb'
  inverse-primary: '#9ad0d0'
  secondary: '#286867'
  on-secondary: '#ffffff'
  secondary-container: '#afeeed'
  on-secondary-container: '#2f6e6e'
  tertiary: '#4a230f'
  on-tertiary: '#ffffff'
  tertiary-container: '#653923'
  on-tertiary-container: '#e2a487'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b5edec'
  primary-fixed-dim: '#9ad0d0'
  on-primary-fixed: '#002020'
  on-primary-fixed-variant: '#134f4f'
  secondary-fixed: '#afeeed'
  secondary-fixed-dim: '#94d1d1'
  on-secondary-fixed: '#002020'
  on-secondary-fixed-variant: '#024f4f'
  tertiary-fixed: '#ffdbcc'
  tertiary-fixed-dim: '#f9b89a'
  on-tertiary-fixed: '#331202'
  on-tertiary-fixed-variant: '#683b25'
  background: '#fcf9f4'
  on-background: '#1c1c19'
  surface-variant: '#e5e2dd'
typography:
  display-xl:
    fontFamily: EB Garamond
    fontSize: 80px
    fontWeight: '400'
    lineHeight: 88px
    letterSpacing: -0.02em
  display-xl-mobile:
    fontFamily: EB Garamond
    fontSize: 48px
    fontWeight: '400'
    lineHeight: 54px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: EB Garamond
    fontSize: 56px
    fontWeight: '400'
    lineHeight: 64px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: EB Garamond
    fontSize: 36px
    fontWeight: '400'
    lineHeight: 42px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: EB Garamond
    fontSize: 36px
    fontWeight: '400'
    lineHeight: 44px
    letterSpacing: 0em
  headline-md-mobile:
    fontFamily: EB Garamond
    fontSize: 28px
    fontWeight: '400'
    lineHeight: 34px
    letterSpacing: 0em
  headline-sm:
    fontFamily: EB Garamond
    fontSize: 24px
    fontWeight: '400'
    lineHeight: 32px
    letterSpacing: 0em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter-xs: 0.5rem
  gutter-sm: 1rem
  gutter-md: 1.5rem
  gutter-lg: 2.5rem
  gutter-xl: 4rem
  margin-mobile: 1.25rem
  margin-tablet: 2.5rem
  margin-desktop: 5rem
  content-max-width: 84rem
---

## Brand & Style

This design system embodies the serene, deliberate aesthetic of high-end travel journalism and calm utility. Evoking "quiet confidence," the interface behaves like an impeccably printed periodical: unhurried, authoritative, and tactfully minimal. Rather than overwhelming the traveler with high-velocity dashboard metrics, it fosters clarity, anticipation, and thoughtful exploration.

The visual direction merges **Editorial Luxury** with **Crisp Graphic Outlines**:
- **Warm Architectural Base:** Built entirely on layered warm cream hues reminiscent of archival book paper, never stark digital whites.
- **Graphic Precision:** High-definition 2px structural contours outline all elements, imparting structure and a crafted tactile quality without resorting to synthetic shadows.
- **Restrained Purpose:** Color is an instrument of clear intent, not ornament. Contrast is maintained strictly through generous typographic scale and crisp structural division.

## Colors

The color palette is strictly disciplined, composed of a warm paper matrix, obsidian graphic lines, and an intentional deep teal reserved for crucial actions.

### Surface Canvas & Tones
- **Canvas Base (`#FAF7F2`):** Primary window background, simulating premium raw paper stock.
- **Surface Elevation (`#F5F0E8`):** Secondary structural fill for secondary cards, inputs, and alternating editorial sections.
- **Surface Highlight (`#FFFDF9`):** Pure light wash used exclusively inside active modal sheets or focal cards.

### Ink & Structural Line
- **Ink Primary (`#111111`):** Deep near-black for primary display headings, editorial body copy, and primary interactive states.
- **Ink Structural Border (`#1A1A1A`):** The definitive 2px stroke applied systematically across borders, dividers, badges, and card boundaries.
- **Ink Muted (`#595652`):** Low-contrast warm gray for metadata, timestamps, and secondary captions.

### Accent
- **Deep Teal (`#0F4C4C`):** High-conviction primary CTA backgrounds, booking commitments, and confirmed itinerary states.
- **Teal Focus Hover (`#135858`):** Subtle tactile lift state for primary interactive elements. Never used as broad decorative filler or ambient background art.

## Typography

Typographic presence is achieved through sheer scale rather than visual weight. The system strictly avoids bold weights in display scenarios, relying on regular weight (`400`) **EB Garamond** from 48px to 80px to evoke the timeless grace of literary travel books.

- **Editorial Headings:** Display styles emphasize open line heights and tight tracking, permitting natural serif ligatures to express quiet elegance.
- **Utilitarian Pairs:** Body copy and tactical labels use **Inter** at `400` and `500` weights, grounding the bookish serif with structural modern legibility. 
- **Scale Scaling:** On mobile breakpoints, display sizes compress down to safe thresholds (80px to 48px, 56px to 36px) while retaining identical proportional line heights.

## Layout & Spacing

The layout is built around a wide-margin, 12-column fluid grid that evokes the feeling of open white space in an editorial broadsheet. 

### Rhythm & Constraints
- **Grid Structure:** 12-column architecture constrained to an expansive max-width of `84rem` (`1344px`), centered on viewport with generous horizontal breathing room.
- **Column Gutters:** `1.5rem` (`24px`) on desktop, tapering to `1rem` (`16px`) on mobile viewports.
- **Vertical Air:** Generous inter-section intervals of `4rem` (`64px`) to `6rem` (`96px`), creating dramatic pauses between destination chapters and itinerary phases.

### Responsive Behavior
- **Desktop (1024px+):** Asymmetrical editorial splits (e.g., 5-column sticky itinerary overview paired with a 7-column narrative day log).
- **Tablet (768px - 1023px):** Collapses into balanced 2-column groupings; exterior margins settle at `2.5rem`.
- **Mobile (320px - 767px):** Full-bleed vertical rhythm with `1.25rem` (`20px`) margins, turning horizontally complex schedules into single-column card flows.

## Elevation & Depth

This design system rejects drop shadows, blurs, and skeuomorphic lighting models entirely. Visual depth and hierarchy are constructed through **Bold Borders** and **Tonal Stratification**:

- **Zero Drop Shadows:** No `box-shadow` properties are permitted anywhere in the layout.
- **Definitive 2px Stroke:** Visual containment is established by uninterrupted 2px solid `#1A1A1A` borders framing every component, card, input, and overlay.
- **Physical Overlays:** Modals, action sheets, and dropdown menus do not hover on diffused shadows; they sit atop a `#F5F0E8` base bordered with 2px `#1A1A1A`, resting cleanly on top of the underlying canvas.
- **Interactive Planes:** Press and active states avoid elevation shifts, instead switching fills (e.g., `#FAF7F2` to `#F5F0E8`) or shifting internal elements cleanly within the persistent 2px shell.

## Shapes

The geometric personality features high contrast between sharp linear strokes and soft, organic boundary radiuses:

- **Hero & Feature Units:** Generously rounded at `60px`, framing featured destinations and visual header vignettes with an inviting, architectural aperture.
- **Standard Cards & Containers:** Grounded at `32px` corner radii, balancing soft tactility with precise boundary containment.
- **Interactive Controls & Pills:** Rendered in absolute pill shapes (`9999px`) for buttons, status tags, chip selectors, and inputs.
- **Uniform Outline:** All shapes maintain an invariant 2px solid `#1A1A1A` border along their curved paths.

## Components

### Day/Night Mode Switch
- Located unobtrusively in the global navigation at the top-right corner.
- Constructed as an elongated pill container (`9999px` radius) bound by a 2px solid `#1A1A1A` border, background `#FAF7F2`.
- Houses twin minimal line glyphs for Sun and Moon. The active state is demarcated by a solid `#1A1A1A` fill pill with inverted cream icon, shifting with seamless linear motion.

### Buttons
- **Primary CTA:** Background `#0F4C4C`, text `#FAF7F2` (`Inter` 500, 14px), 2px solid `#1A1A1A` border, `9999px` pill radius, padding `14px 28px`. Hover shifts fill to `#135858`.
- **Secondary Action:** Background `#FAF7F2`, text `#111111`, 2px solid `#1A1A1A` border, `9999px` radius. Hover shifts fill to `#F5F0E8`.
- **Destructive/Text Action:** Understated text-only links with an active 2px bottom border underline on hover, preserving calm visual weight.

### Cards & Editorial Vignettes
- **Itinerary Card:** Background `#FFFDF9`, 2px solid `#1A1A1A` border, `32px` corner radius, internal padding `32px`.
- **Feature Hero Unit:** Background `#F5F0E8`, 2px solid `#1A1A1A` border, `60px` corner radius, housing rich photography flush-clipped to the internal curve.
- **Photography Treatment:** Authentic, candid imagery graded with warm Mediterranean/Nordic daylight undertones, encased within the crisp 2px frame.

### Chips & Filter Pills
- Fully rounded pills (`9999px`), 2px solid `#1A1A1A` stroke, padding `8px 18px`.
- Unselected: `#FAF7F2` fill, `#111111` label text.
- Selected: `#0F4C4C` fill, `#FAF7F2` label text, retaining the 2px `#1A1A1A` border.

### Input Fields & Controls
- Pill-shaped (`9999px`) or card-shaped (`32px` radius) text fields with an authentic `#FAF7F2` background, inset padding `14px 24px`, and 2px `#1A1A1A` perimeter.
- Focus state: Border remains crisp 2px `#1A1A1A` with an inner 1px accent ring of `#0F4C4C`, never relying on glow effects.
- Checkboxes and Radios: 20px structural elements enclosed in 2px `#1A1A1A` lines, displaying a solid `#0F4C4C` inner indicator when checked.

### Lists & Day Timelines
- Uncluttered typographic rows demarcated by 2px `#1A1A1A` horizontal rules.
- Timestamp indicators styled in monoline uppercase Inter labels (`label-sm`), paired with prominent EB Garamond itinerary events (`headline-sm`).