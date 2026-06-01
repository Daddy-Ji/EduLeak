## EduLeak — Free Education Platform

A free, SEO-optimized course site for students from class 9 through college, with an admin panel to add courses via manual entry, gallery upload, downloadable link, API, or external redirect. Editorial Warm visual direction (paper, ink, gold), responsive, designed to feel hand-crafted — not AI-generated.

---

### Design direction
- Palette: `#f5f3ee` (paper), `#e8e4dd` (mist), `#c9a84c` (gold), `#0d0d0d` (ink)
- Typography: serif display (Instrument Serif / Fraunces) + grotesk body (Work Sans)
- Editorial layout cues: oversized numerals, rule lines, captioned thumbnails, asymmetric grids, generous whitespace, subtle grain texture, gold underline accents on links
- Motion: restrained — letter-spacing transitions, reveal-on-scroll, no rainbow gradients
- Anti-AI-slop pass: no "Trusted by", no generic 3-up feature cards, no purple gradients, no double hero CTAs, single distinctive nav

### Information architecture (routes)
```
/                       Landing — hero, featured courses, levels, about strip
/courses                Browse all (filter by level/subject)
/levels/$level          Class 9, 10, 11, 12, College
/subjects/$subject      Physics, Maths, Chemistry, Biology, CS, etc.
/courses/$slug          Course detail — chapters, embedded videos, PDFs, redirect button
/about                  Mission
/contact                Contact form
/login                  Admin email/password login
/admin                  Dashboard (protected)
/admin/courses          List / create / edit / delete
/admin/courses/new      Create course
/admin/courses/$id/edit Edit course + chapters
/sitemap.xml            Auto-generated
robots.txt              Allow all
```
Each public route gets its own `head()` with unique title, description, OG tags, canonical, and JSON-LD (Course / BreadcrumbList / Organization).

### Course content model
Each course supports a mix of source types per chapter:
- **YouTube embed** (video URL)
- **PDF notes** (uploaded to storage, or external link)
- **External redirect** (whole course / chapter points to another site — opens in same tab with referral notice, tracked)
- **Manual rich text** lesson body

Hierarchy: Course → Chapters → Lessons (lesson = video + pdf + notes + optional redirect URL).

### Admin panel
- Email/password auth via Lovable Cloud; first user promoted to admin via `user_roles` table
- Protected under `_authenticated` + role check (`has_role(uid, 'admin')`)
- Course editor with:
  - Manual fields (title, slug, level, subject, description, cover image, SEO title/desc)
  - Cover image: upload to storage bucket OR paste downloadable URL OR pick from gallery of previously uploaded covers
  - Chapter manager (drag-order, add/remove, per-lesson type picker)
  - "Import via API" form: paste JSON or URL → server function fetches and stores
  - Publish toggle (draft/published — only published appear publicly & in sitemap)

### SEO foundation
- Per-route `head()` metadata (title <60ch, desc <160ch, og:*, canonical on leaves)
- Dynamic `/sitemap.xml` server route enumerating all published courses + static pages
- `robots.txt` with Allow:/
- JSON-LD: Organization on root, Course schema on `/courses/$slug`, BreadcrumbList on deep routes
- Semantic HTML (single H1 per page), alt text on all images, lazy loading
- Slug-based URLs (`/courses/class-11-physics-mechanics`)
- OG image: course cover doubles as og:image on detail pages

### Backend (Lovable Cloud)
Tables:
- `profiles` (id → auth.users, display_name)
- `user_roles` (user_id, role) + `app_role` enum + `has_role()` security-definer fn
- `courses` (id, slug unique, title, description, level, subject, cover_url, seo_title, seo_description, redirect_url nullable, published bool, created_at)
- `chapters` (id, course_id fk, title, position)
- `lessons` (id, chapter_id fk, title, video_url, pdf_url, redirect_url, body, position)
- `media_assets` (id, url, kind, uploaded_by) — gallery
Storage bucket: `course-media` (public).
RLS: public SELECT on published courses/chapters/lessons; admin-only INSERT/UPDATE/DELETE via `has_role`.
All writes via `createServerFn` + `requireSupabaseAuth`; public reads via server fn + `supabaseAdmin` scoped to `published=true`.

### Responsive
Mobile-first (preview is 390×844). Sticky compact header, hamburger nav on <md, single-column course cards, full-width video embeds, large tap targets.

---

### Build order
1. Enable Lovable Cloud, create schema + RLS + storage bucket + seed roles
2. Sitewide shell: editorial layout, header/footer, fonts, design tokens, root SEO
3. Public pages: landing, courses list, course detail, level/subject filters
4. Auth: login page, `_authenticated` guard with admin role check
5. Admin panel: dashboard, course CRUD, chapter/lesson editor, media gallery, API import
6. SEO polish: sitemap server route, JSON-LD, per-route metadata, robots.txt
7. QA at 390px and desktop; trigger SEO scan

### Technical notes
- TanStack Start file-based routes, all data via `createServerFn`
- Public list/detail server fns use `supabaseAdmin` filtered by `published=true` (so SSR/prerender works without a session)
- Auth-gated admin fns use `requireSupabaseAuth` + `has_role()` check
- `attachSupabaseAuth` middleware wired in `src/start.ts`
- Forms validated with zod (server + client)
- YouTube URLs normalized to embed format
- After publish, share `project--<id>.lovable.app` so external redirect tracking & sitemap are stable

### Out of scope (can add later)
Payments, quizzes/MCQs, user accounts for students, progress tracking, comments, search indexing beyond title/subject.
