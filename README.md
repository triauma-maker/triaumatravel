# Tria Uma-inspired Astro website

A luxury travel editorial website inspired by the visual direction of Tria Uma Resorts: immersive destination photography, restrained forest-green and ivory colours, editorial serif typography, generous spacing, and curated hotel/journal content.

## Requirements

- Node.js `>=22.12.0`
- npm

## Run locally

From this project directory:

```bash
npm install
npm run dev
```

Open the local URL printed by Astro (usually `http://localhost:4321`).

To create a production build:

```bash
npm run build
npm run preview
```

## Current pages

- `/` — Home
- `/hotels/` and `/hotels/[slug]/` — Hotels and resort details
- `/experience/` — Experiences
- `/journal/[slug]/` — Journal article details
- `/about/` — About
- `/contact/` — Contact
- `/faq/` — FAQ

Some navigation destinations (including Plans, Offers, Privacy) may still need dedicated pages; these are not part of this visual refinement pass.

## Visual refinement in this pass

- Refined the full-screen hero with a more editorial overlay, subtle image reveal, and scroll cue on desktop.
- Updated the homepage headline and copy to better reflect tailor-made luxury travel.
- Improved responsive spacing, keyboard focus visibility, and reduced-motion support.
- Kept the existing Astro components, content data, routes, and Tailwind setup rather than rebuilding the project.

Images are loaded from Unsplash URLs and Google Fonts is used for typography, so those resources require an internet connection in the browser.
