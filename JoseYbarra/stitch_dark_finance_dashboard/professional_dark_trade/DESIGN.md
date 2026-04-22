---
name: Professional Dark Trade
colors:
  surface: '#17130a'
  surface-dim: '#17130a'
  surface-bright: '#3e382e'
  surface-container-lowest: '#120e06'
  surface-container-low: '#201b12'
  surface-container: '#241f16'
  surface-container-high: '#2f2920'
  surface-container-highest: '#3a342a'
  on-surface: '#ece1d2'
  on-surface-variant: '#d3c5ad'
  inverse-surface: '#ece1d2'
  inverse-on-surface: '#353026'
  outline: '#9c8f7a'
  outline-variant: '#4f4634'
  surface-tint: '#f7be33'
  primary: '#ffda91'
  on-primary: '#402d00'
  primary-container: '#f3ba2f'
  on-primary-container: '#674b00'
  inverse-primary: '#795900'
  secondary: '#c2c7cf'
  on-secondary: '#2c3137'
  secondary-container: '#42474e'
  on-secondary-container: '#b1b5bd'
  tertiary: '#b4e6ff'
  on-tertiary: '#003546'
  tertiary-container: '#59d0ff'
  on-tertiary-container: '#005771'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdea0'
  primary-fixed-dim: '#f7be33'
  on-primary-fixed: '#261a00'
  on-primary-fixed-variant: '#5c4300'
  secondary-fixed: '#dee3eb'
  secondary-fixed-dim: '#c2c7cf'
  on-secondary-fixed: '#171c22'
  on-secondary-fixed-variant: '#42474e'
  tertiary-fixed: '#bee9ff'
  tertiary-fixed-dim: '#68d3ff'
  on-tertiary-fixed: '#001f2a'
  on-tertiary-fixed-variant: '#004d64'
  background: '#17130a'
  on-background: '#ece1d2'
  surface-variant: '#3a342a'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  title-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-base:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  data-mono:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin: 24px
---

## Brand & Style

This design system is engineered for the high-stakes environment of digital asset trading. The brand personality is authoritative, precise, and utilitarian, prioritizing data density and clarity over decorative flair. It targets professional traders and institutional investors who require a stable, high-performance interface that minimizes eye strain during long sessions.

The design style is **Corporate Modern** with a focus on high-contrast functionality. It utilizes a strict hierarchy where color is reserved for action and critical status updates, while the layout remains sober and grounded in a structured grid. The emotional response is one of confidence and reliability, ensuring the user feels in total control of their financial data.

## Colors

The palette is optimized for low-light environments and long-term readability. The foundation is a deep charcoal black that provides the maximum contrast for the Binance Yellow primary color, which is used exclusively for primary actions and highlights.

Secondary grays are used to create structural depth and define different functional zones (navigation, order books, charts). Semantic colors for financial data—Green for gains and Red for losses—are calibrated for high luminosity against the dark background, ensuring instant recognition of market trends. To maintain professional focus and brand integrity, blue tones are strictly prohibited from the interface.

## Typography

This design system utilizes **Inter** for its exceptional legibility in data-heavy interfaces. The typography system prioritizes clarity and information density. 

Special attention is paid to numerical data; "tabular figures" (tnum) should be enabled for all price and balance displays to ensure that numbers align vertically in lists and tables. We use a clear hierarchy where titles are slightly bolder and larger, while secondary information and labels use a reduced font size and lighter gray to maintain a clean visual scan-path.

## Layout & Spacing

The layout philosophy follows a **Fixed Grid** system for the main trading dashboard and a **Fluid Grid** for secondary pages. A 12-column system is used for marketing and informational pages, while the core trading interface uses a modular "panel-based" layout.

Spacing is based on a 4px baseline grid. Functional density is high, particularly in order books and trade history, where 4px (xs) and 8px (sm) spacing are the standards. Larger components like cards and sections use 16px (md) to 24px (lg) padding to ensure the UI does not feel cluttered despite the high volume of data.

## Elevation & Depth

In this design system, depth is achieved through **Tonal Layers** and **Low-Contrast Outlines** rather than traditional shadows. This keeps the interface feeling flat, fast, and technical.

- **Level 0 (Background):** The deepest charcoal (#0B0E11). Used for the main application background.
- **Level 1 (Surface):** Secondary dark gray (#1E2329). Used for containers, cards, and navigation bars.
- **Level 2 (Interaction):** Lighter gray (#2B3139). Used for hover states and active indicators.

Instead of shadows, we use thin 1px borders (#2B3139) to define the boundaries of cards and sections. This creates a crisp, architectural feel that mirrors professional trading software.

## Shapes

The shape language is strictly **Soft (0.25rem / 4px to 0.5rem / 8px)**. This provides a modern, approachable feel without sacrificing the professional, "engineered" aesthetic of the platform.

- **Buttons & Inputs:** 4px radius for a precise look.
- **Cards & Modals:** 8px radius to provide a clear container hierarchy.
- **Badges:** Small 2px radius or fully square for a technical, "tag" appearance.

## Components

### Buttons
- **Primary:** Solid Binance Yellow (#F3BA2F) with black text. 4px rounded corners.
- **Secondary:** Transparent with a thin gray border (#2B3139) and white text.
- **Buy/Sell:** High-luminosity Green (#0ECB81) or Red (#F6465D) solid backgrounds for immediate action recognition.

### Input Fields
- Dark backgrounds (#1E2329) with subtle 1px borders. 
- Focus state: Border color changes to Binance Yellow.
- Labels are positioned above the input in `label-caps` style for maximum density.

### Cards
- Background: #1E2329.
- Border: 1px solid #2B3139.
- Corner Radius: 8px.
- No shadows; depth is indicated by the contrast between the surface and the background.

### Data Tables
- Row hover states use a subtle highlight (#2B3139).
- Column headers use `label-caps` in secondary text color.
- Numerical values use `data-mono` for vertical alignment.

### Chips & Status Badges
- Used for market types (e.g., "Spot", "Futures") or status.
- Small font size, light gray background with medium gray text. No vibrant colors unless indicating a live state or specific financial movement.