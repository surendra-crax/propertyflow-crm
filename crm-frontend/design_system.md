---
name: Enterprise Design System
description: Design tokens, utilities, and conventions established in the May 2026 enterprise transformation
type: project
---

## Design Philosophy
Replaced generic indigo/purple AI-generated look with professional navy/blue enterprise palette.

## Color Palette
- **Primary**: Electric blue oklch(0.55 0.2 250) — professional, not garish
- **Background**: Very slight blue-tinted white oklch(0.985 0.002 240)
- **Sidebar**: Deep navy oklch(0.12 0.025 252) with white/5 borders
- **Charts**: Blue, Emerald, Amber, Violet, Red — consistent enterprise palette

## CSS Utilities (globals.css)
- `.enterprise-card` — standard card with border, shadow, hover effect
- `.shimmer` — shimmer loading skeleton (light and dark mode)
- `.badge-new/contacted/followup/visit/negotiation/won/lost` — lead status badges
- `.glass` — glass morphism effect
- `.tabular-nums` — monospace numbers for data display

## Layout
- Sidebar: 240px wide, collapsible on mobile, grouped navigation sections
- Navbar: 56px tall, search bar, dark mode toggle, user avatar, notifications
- Main: `p-4 md:p-6` padding, `space-y-5` between sections

## Component Conventions
- All page headers: h1 with optional badge + subtitle
- Data cards: enterprise-card class, not raw divs
- Loading states: shimmer class, not simple animate-pulse
- Empty states: icon (20% opacity) + title + subtitle + CTA button
- Buttons: primary uses bg-primary class, secondary uses bg-muted

## React Query Setup
- queryClient in lib/query-client.ts
- staleTime: 60s, gcTime: 5min, retry: 1, refetchOnWindowFocus: false
- Leads page uses useQuery with placeholderData for smooth page transitions
