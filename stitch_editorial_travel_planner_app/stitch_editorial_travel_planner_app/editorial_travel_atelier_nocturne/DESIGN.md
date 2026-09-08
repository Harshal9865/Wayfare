---
name: Editorial Travel Atelier (Nocturne)
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#bdc9c6'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#879390'
  outline-variant: '#3e4947'
  surface-tint: '#76d7c9'
  primary: '#76d7c9'
  on-primary: '#003732'
  primary-container: '#3aa093'
  on-primary-container: '#00302b'
  inverse-primary: '#006a61'
  secondary: '#c8c6c2'
  on-secondary: '#31302d'
  secondary-container: '#474743'
  on-secondary-container: '#b7b5b0'
  tertiary: '#81d5c9'
  on-tertiary: '#003732'
  tertiary-container: '#489e94'
  on-tertiary-container: '#00302b'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#93f4e5'
  primary-fixed-dim: '#76d7c9'
  on-primary-fixed: '#00201c'
  on-primary-fixed-variant: '#005048'
  secondary-fixed: '#e5e2dd'
  secondary-fixed-dim: '#c8c6c2'
  on-secondary-fixed: '#1c1c19'
  on-secondary-fixed-variant: '#474743'
  tertiary-fixed: '#9df2e5'
  tertiary-fixed-dim: '#81d5c9'
  on-tertiary-fixed: '#00201d'
  on-tertiary-fixed-variant: '#005049'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-hero:
    fontFamily: EB Garamond
    fontSize: 64px
    fontWeight: '400'
    lineHeight: 72px
    letterSpacing: -0.02em
  display-hero-mobile:
    fontFamily: EB Garamond
    fontSize: 40px
    fontWeight: '400'
    lineHeight: 46px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: EB Garamond
    fontSize: 48px
    fontWeight: '400'
    lineHeight: 54px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: EB Garamond
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 38px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: EB Garamond
    fontSize: 36px
    fontWeight: '400'
    lineHeight: 42px
  headline-md-mobile:
    fontFamily: EB Garamond
    fontSize: 26px
    fontWeight: '400'
    lineHeight: 32px
  headline-sm:
    fontFamily: EB Garamond
    fontSize: 24px
    fontWeight: '400'
    lineHeight: 30px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.12em
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  space-2xs: 0.25rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
  space-3xl: 4.5rem
  space-4xl: 6rem
  gutter-mobile: 1rem
  gutter-desktop: 2rem
  margin-mobile: 1.25rem
  margin-desktop: 4rem
---

## Brand & Style
This design system represents a refined, nocturnal editorial atelier for bespoke travel curation. It captures the romance of late-night travel planning, private salon itineraries, and vintage archival journals rendered in a contemporary digital format. 

The aesthetic is characterized by a blend of classical editorial publishing and modern architectural restraint. It balances expansive dark space with high-impact serif typography and sculptural, rounded containers. The experience evokes the quiet intimacy of an exclusive concierge club after hours: deliberate, serene, and richly layered.

## Colors
The palette is rooted in low-luminance warmth and precise contrast:

- **Canvas & Backgrounds:** Deepest charcoal `#141414` serves as the root viewport background, with `#1A1A1A` defining surface layers and container tiers.
- **Typography & Foreground:** Primary editorial headlines and essential indicators use warm cream `#FAF7F2`. Secondary running copy and metadata utilize muted cream `#E8E5DF` or softened alpha variants (`rgba(250, 247, 242, 0.65)`).
- **Accents:** Vivid luminous teal (`#1E8C80`, shifting to `#1A7A70` on interaction states) is strictly reserved for actionable drivers, key interactive states, and primary CTAs.
- **Borders & Dividers:** Structure is held through explicit 2px solid strokes using either warm cream at calibrated opacity (`rgba(250, 247, 242, 0.25)` resting, `rgba(250, 247, 242, 0.40)` active) or solid warm charcoal tints (`#333230` to `#3D3B38`).
- **Media Treatments:** Photography features an ambient cool-toned, desaturated multiply overlay (`rgba(20, 28, 30, 0.35)`) to integrate vivid travel captures naturally into the dark canvas.

## Typography
Typographic rhythm is built on the deliberate contrast between classical high-literary serifs and razor-sharp modern sans-serif utilitarian elements:

- **EB Garamond (Headlines & Editorial Callouts):** Maintained strictly at regular weight (`400`). Headlines should never be forced into bold weights; hierarchy is established strictly via scale, line rhythm, and surrounding negative space. Italic variants are reserved for curated travel reflections, quotes, and cultural classifications.
- **Inter (Body, UI, & Metadata):** Provides structured legibility across descriptions, functional indicators, and technical details.
- **Micro-Editorial Labels:** Category classifications, itinerary timelines, and geographical coordinates use `label-caps` rendered in all-caps with generous letter-spacing (`0.12em`) to echo high-end broadsheet architecture.

## Layout & Spacing
The layout follows a fluid 12-column architectural grid on desktop with generous outward margins (`4rem`) and disciplined column gutters (`2rem`). Mobile layouts collapse to a 4-column framework with continuous fluid gutters (`1rem`).

Spacing employs an 8px modular baseline with proportional editorial breathing room:
- **Hero & Curated Features:** Spaced with extra-large paddings (`space-3xl` and `space-4xl`) to allow large serif headlines to command attention without clipping adjacent elements.
- **Editorial Cards & Containers:** Maintain generous internal padding (`space-xl` on desktop, `space-lg` on mobile), ensuring body copy and destination imagery have distinct structural breathing room inside their heavy perimeter strokes.

## Elevation & Depth
Depth is created through surface contrast and structural borders rather than diffuse drop shadows:

- **Surface Tiers:** Layering relies on distinct tonal fields. Base canvases sit at `#141414`, elevated cards and drawers rise to `#1A1A1A`, and nested utility clusters rest on `#212121`.
- **Architectural 2px Outlines:** Elevation boundaries are defined through solid 2px borders (`rgba(250, 247, 242, 0.25)` or `#333230`), creating crisp physical presence against the dark background.
- **Ambient Shadow Occlusion:** Soft shadows are minimized. When required for floating controls or navigation overlays, use a low-key, saturated dark cast: `0 16px 40px -8px rgba(0, 0, 0, 0.65)`.
- **Atmospheric Image Filters:** Hero destination photography utilizes an internal vignette and a 20% desaturated cool tint overlay, ensuring imagery recedes gracefully behind the warm cream typography.

## Shapes
Shapes define the tactile identity through large, architectural corner radii paired with continuous-curve geometry:

- **Hero Sections & Full-Width Features:** Utilize a sweeping `60px` corner radius for an open, bespoke magazine layout.
- **Standard Cards & Module Enclosures:** Uniformly sculpted at `32px` corner radius.
- **Pill Toggles & Action Indicators:** Formed using full 9999px pill radii for switches, category badges, and navigation toggles.
- **Border Integration:** All cards, modules, and pill elements must preserve the system's exact 2px solid stroke weight to anchor the rounded contours against dark surfaces.

## Components

### Buttons & Call-to-Actions
- **Primary Action Buttons:** Solid vivid teal background (`#1E8C80`), warm cream text (`#FAF7F2`), rounded pill radius (`9999px`), 2px solid border in `#1E8C80`. Hover states shift to deep teal (`#1A7A70`).
- **Secondary / Ghost Buttons:** Transparent background with warm cream text (`#FAF7F2`) enclosed in a 2px solid border (`rgba(250, 247, 242, 0.25)`). On hover, borders brighten to `rgba(250, 247, 242, 0.5)` with an interior wash of `#1A1A1A`.

### Theme Toggle (Day / Night Switcher)
- **Structure:** Pill-shaped enclosure (`9999px`) with a 2px solid border in `#3D3B38` and a dark fill (`#141414`).
- **Active State:** Fixed in the night configuration: the moon icon rests on a solid `#1A1A1A` circular thumb with a glowing warm cream icon (`#FAF7F2`), while the sun icon recedes in dimmed muted cream (`rgba(250, 247, 242, 0.3)`).

### Editorial Destination Cards
- **Structure:** `32px` corner radius, `#1A1A1A` background, encased in an exact 2px solid border (`rgba(250, 247, 242, 0.25)` or `#333230`).
- **Layout:** Imagery is top-bound or full-bleed with a subtle cool-toned gradient. Headlines use `EB Garamond` regular (`headline-md`) over warm cream text with `Inter` uppercase labels for itinerary details and duration badges.

### Chips & Filter Pills
- **State Styling:** Pill-shaped geometry (`9999px`) with 2px solid border. 
- **Inactive:** `#1A1A1A` fill, `#333230` border, `#E8E5DF` text.
- **Active:** `#FAF7F2` fill with `#141414` bold text, or `#1E8C80` fill for filtering interactions.

### Form Inputs & Text Fields
- **Container:** Dark base (`#141414`), 2px solid border in `#333230`, rounded to `16px` or `9999px` (for search bars).
- **Focus State:** 2px stroke shifts to `#1E8C80` with typography rendered in `#FAF7F2`. Placeholder copy is set in `#E8E5DF` at 40% opacity.

### Selection Controls (Checkboxes & Radios)
- **Checkboxes:** Rounded `8px` squares framed by a 2px solid cream border at 40% opacity. When checked, filled with teal (`#1E8C80`) displaying a warm cream checkmark.
- **Radios:** Concentric circle system with a 2px outer border in warm cream and an inner `#1E8C80` focal dot when selected.