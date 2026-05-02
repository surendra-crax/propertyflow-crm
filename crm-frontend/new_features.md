---
name: New Enterprise Features Added
description: Four new enterprise features added during the May 2026 enterprise transformation
type: project
---

Four new enterprise features were added during the enterprise transformation:

1. **Interactive Floor Plan Viewer** — `/floor-plans`
   - SVG-based unit layout visualization by floor
   - Color-coded status (Available=green, Reserved=amber, Sold=red, MgmtQuota=purple)
   - Zoom controls, floor selector, unit detail panel
   - Component: `app/(dashboard)/floor-plans/page.tsx`

2. **Property Location Map** — `/map`
   - Leaflet.js (OpenStreetMap, no API key needed)
   - Plots all projects using geocoded Indian city coordinates
   - GPS "My Location" button, project list sidebar
   - Component: `app/(dashboard)/map/PropertyMapInner.tsx` (dynamically imported, no SSR)

3. **EMI/Loan Calculator** — `/tools/emi-calculator`
   - Full EMI calculation with range sliders
   - Comparison mode (two scenarios side by side)
   - Yearly amortization schedule table
   - Loan balance chart over time
   - Component: `app/(dashboard)/tools/emi-calculator/page.tsx`

4. **AI Lead Intelligence** — `/analytics/intelligence`
   - Lead scoring display with score bar visualization
   - Temperature analysis (HOT/WARM/COLD) with explanation
   - Next-best-action recommendations (contextual)
   - Pipeline health radar chart
   - Quick call/WhatsApp actions per lead
   - Component: `app/(dashboard)/analytics/intelligence/page.tsx`

**How to apply:** These pages are all linked from the new sidebar. If user asks about these features, they are fully functional and do not require any backend changes.
