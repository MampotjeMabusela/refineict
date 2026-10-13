# Nexora IT — production website

Node.js + Express backend with a static HTML/CSS/JS frontend. Company branding and copy live in `public/config.js`.

## Quick start

```bash
cp .env.example .env
npm install
npm start
```

Open http://localhost:3000

- Edit company name, phone, email, logo, stats, services, images, FAQ, plans, etc. in **`public/config.js`**.
- Replace images in **`public/img/`** (WebP recommended). Regenerate placeholders with `npm run images`.
- Blog posts: **`data/posts.json`**.
- Leads & tickets: SQLite at **`data/nexora.db`** via Node’s built-in `node:sqlite` (migrates `data/leads.json` on first run). Requires **Node 22+**.

## Environment variables

See `.env.example`. Important:

| Variable | Purpose |
|---|---|
| `SESSION_SECRET` | Signs admin session cookies |
| `ADMIN_USER` / `ADMIN_PASSWORD` | Admin login (dev) |
| `ADMIN_PASSWORD_HASH` | bcrypt hash (preferred in production) |
| `SMTP_*` / `NOTIFY_EMAIL` | Lead & ticket email notifications + auto-reply |
| `CORS_ORIGIN` | Allowed browser origin |

Generate a password hash:

```bash
node -e "console.log(require('bcryptjs').hashSync('your-password', 10))"
```

Admin UI: http://localhost:3000/admin

## Scripts

| Command | Description |
|---|---|
| `npm start` | Run the server |
| `npm run dev` | Run with `--watch` |
| `npm test` | API tests (`node:test` + supertest) |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |
| `npm run images` | Generate local WebP hero/about images |

## Docker

```bash
cp .env.example .env
docker compose up --build -d
```

Data persists in the `nexora-data` volume.

## Deploy on a VPS (Nginx + PM2 + Let's Encrypt)

1. Point DNS A record at the server.
2. Install Node 20+, Nginx, Certbot.
3. Clone the repo, `cp .env.example .env`, set production values (`NODE_ENV=production`, strong `SESSION_SECRET`, `ADMIN_PASSWORD_HASH`, SMTP, `CORS_ORIGIN=https://your-domain`).
4. `npm install --omit=dev && npm run images`
5. Install PM2: `npm i -g pm2` then `pm2 start server.js --name nexora` and `pm2 save`.
6. Nginx reverse proxy example:

```nginx
server {
  listen 80;
  server_name nexora-it.co.za www.nexora-it.co.za;
  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

7. `sudo certbot --nginx -d nexora-it.co.za -d www.nexora-it.co.za`
8. Update `public/config.js` `url`, and canonical/OG URLs in HTML / `sitemap.xml` / `robots.txt` to your domain.

## Stack notes

- Frontend: vanilla JS, shared header/footer via `public/js/include.js`
- Forms: `/api/contact`, `/api/tickets` (Zod validation, rate limits, honeypot)
- Security: Helmet, CORS lockdown, express-rate-limit, morgan, session cookie admin
- Database: Node.js built-in `node:sqlite` (no native compile step; Node 22+)
- Images: `npm run images` uses `sharp` when available to emit WebP into `public/img/`
