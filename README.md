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

## Supabase CMS setup

The admin dashboard stores shared website content and itinerary-builder settings in Supabase. Public pages can read that content; only users listed in `triauma_cms_admins` can change it. Guest profiles and custom itineraries are saved in the visitor's browser and do not require an account. They are available only in the same browser and on the same website origin; they are not synced across devices, private browsing sessions, or after browser storage is cleared.

For instructions on signing in and managing website content, see the [Admin User Guide](./docs/panduan-admin.md).

1. In the Supabase SQL Editor, run `supabase/schema.sql`.
2. Create or invite the admin account under **Authentication → Users**. Public sign-ups are not needed for guest itineraries and can remain disabled.
3. Add that user's UUID to the admin allowlist by running this query with the account email:

   ```sql
   insert into public.triauma_cms_admins (user_id, email)
   select id, email
   from auth.users
   where lower(email) = lower('ADMIN_EMAIL')
   on conflict (user_id) do update set email = excluded.email;
   ```

4. Copy `.env.example` to `.env` and set `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_PUBLISHABLE_KEY` from the Supabase project's API Keys page. Use the `sb_publishable_...` key in local development and Vercel (Production, Preview, and Development), then redeploy. This frontend does not need a Supabase secret key. Never put a secret key in a `PUBLIC_` variable, source control, or browser code.
5. To migrate the existing CMS data, first run this updated project locally at the same origin where the old content is stored (usually `http://localhost:4321`). Sign in to `/admin` using the Supabase admin account. If the CMS table is empty, the dashboard copies the existing local browser content and itinerary settings into Supabase. Verify the content there before opening the deployed admin for the first time.
The local `.env` is ignored by Git. Supabase must be configured and the latest schema applied for admin sign-in and shared CMS content. Previously migrated guest rows in `triauma_customer_profiles` and `triauma_customer_itineraries` are not used by the browser-local itinerary flow.

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
