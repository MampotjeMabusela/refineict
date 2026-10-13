# Cursor Agent Prompt — Nexora IT website

Paste everything below into the Cursor Agent (Agent mode, Claude/GPT top model) with this project folder open.

---

You are a senior full-stack engineer and UI designer. This folder contains a working full-stack website for an IT company (Node.js + Express backend, static HTML/CSS/JS frontend in `/public`, company details in `/public/config.js`). Take it from good to production-grade, working through the phases below in order. Run the app after each phase (`npm install && npm start`) and fix every error before continuing.

## Rules
- Do not rewrite from scratch. Extend the existing code and keep `public/config.js` as the single place for company name, logo, phone, email, address, stats, services, images and testimonials. Every new piece of copy must come from config.
- No frameworks on the frontend unless I ask. Keep it fast: Lighthouse 90+ on all four scores.
- Keep the visual identity: ink navy `#0c1a2e`, cobalt `#2f5bff`, amber `#ffb020`, Sora (headings) + Source Sans 3 (body). Do not introduce purple gradients or stock "SaaS template" look.
- Accessibility floor: visible focus, labels on every input, AA contrast, `prefers-reduced-motion` respected.

## Phase 1 — Pages and content
1. Split into real pages: `index.html`, `services.html`, `about.html`, `contact.html`, plus one detail page per service generated from `config.js` (`service.html?slug=...`). Share the header/footer via a small JS include.
2. Add sections: industries served, certifications/partners logo strip (placeholder SVGs, configurable), FAQ accordion, pricing/support plans (Essential, Business, Enterprise), case studies, and a blog/news list stored in `data/posts.json`.
3. Add a floating WhatsApp button and a click-to-call bar on mobile, both driven by config.

## Phase 2 — Visual polish
1. Replace remote Unsplash links with local optimised images in `public/img` (WebP, `loading="lazy"`, width/height set). Keep a CSS fallback if an image fails.
2. Add one signature animated element in the hero (the network topology SVG: animate packets travelling between nodes). Everything else stays calm. Add a sticky-nav shadow on scroll and a subtle count-up on stats (already present).
3. Add a dark/light theme toggle using CSS variables, saved in localStorage.

## Phase 3 — Backend
1. Move the lead store from JSON file to SQLite (`better-sqlite3`). Migrate existing `data/leads.json` on first run.
2. Send an email notification for each new lead with Nodemailer (SMTP details in `.env`, provide `.env.example`). Send an auto-reply to the customer.
3. Add a password-protected `/admin` page (session cookie, bcrypt, credentials from `.env`) to list, search, mark as handled and export leads to CSV.
4. Harden: `helmet`, `express-rate-limit`, input validation with `zod`, CORS locked down, request logging with `morgan`, graceful error handler.
5. Add a support-ticket form (`/api/tickets`) with reference numbers returned to the user.

## Phase 4 — SEO and quality
1. Per-page `<title>`, meta description, Open Graph/Twitter tags, canonical URLs, JSON-LD (`Organization`, `LocalBusiness`, `Service`), `sitemap.xml`, `robots.txt`.
2. Add tests for the API with `node:test` and supertest. Add ESLint + Prettier.
3. Add a `Dockerfile` and `docker-compose.yml`, and a `README.md` with local run, environment variables, and deployment steps for a VPS (Nginx + PM2 + Let's Encrypt).

## Definition of done
- `npm install && npm start` works on a clean machine.
- Every form submits, validates and stores/sends correctly; errors are shown in plain language.
- Fully responsive from 360px to 1920px.
- Changing only `public/config.js` (and images in `public/img`) rebrands the whole site.
- Finish with a short summary of what changed and any decisions I need to make.
