require('dotenv').config();

const path = require('path');
const fs = require('fs');
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const morgan = require('morgan');
const session = require('express-session');
const bcrypt = require('bcryptjs');

const { createLead, listLeads, setLeadHandled, createTicket, leadsToCsv } = require('./lib/db');
const { sendLeadEmails, sendTicketEmails } = require('./lib/mail');
const { contactSchema, ticketSchema, loginSchema, parse } = require('./lib/validate');
const { runKat } = require('./lib/kat');

const app = express();
const PORT = Number(process.env.PORT || 3000);
const PUBLIC = path.join(__dirname, 'public');
const IS_PROD = process.env.NODE_ENV === 'production';

const ALLOWED_ORIGIN =
  process.env.CORS_ORIGIN ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : `http://localhost:${PORT}`);

app.set('trust proxy', 1);

app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        'img-src': ["'self'", 'data:', 'https:'],
        'script-src': ["'self'", "'unsafe-inline'"],
        'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        'font-src': ["'self'", 'https://fonts.gstatic.com', 'data:'],
        'connect-src': ["'self'"],
        'frame-src': ["'self'"],
      },
    },
  })
);

function isAllowedOrigin(origin) {
  if (!origin) return true;
  if (origin === ALLOWED_ORIGIN) return true;
  if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) return true;
  try {
    const host = new URL(origin).hostname;
    if (host.endsWith('.vercel.app')) return true;
  } catch {
    return false;
  }
  return false;
}

app.use(
  cors({
    origin(origin, cb) {
      if (isAllowedOrigin(origin)) return cb(null, true);
      return cb(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

app.use(morgan(IS_PROD ? 'combined' : 'dev'));
app.use(express.json({ limit: '32kb' }));
app.use(express.urlencoded({ extended: false, limit: '32kb' }));

app.use(
  session({
    name: 'nexora.sid',
    secret: process.env.SESSION_SECRET || 'dev-only-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: IS_PROD,
      maxAge: 1000 * 60 * 60 * 8,
    },
  })
);

const formLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Try again in a few minutes.' },
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many login attempts. Try again later.' },
});

const katLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Theo is getting a lot of questions — try again in a moment.' },
});

app.use(express.static(PUBLIC, { extensions: ['html'] }));

function requireAdmin(req, res, next) {
  if (req.session && req.session.admin) return next();
  return res.status(401).json({ error: 'Please sign in.' });
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/kat', katLimiter, async (req, res, next) => {
  try {
    const message = String(req.body?.message || '').trim();
    if (!message) {
      const err = new Error('Please type a message for Theo.');
      err.status = 400;
      throw err;
    }
    if (message.length > 800) {
      const err = new Error('Message is too long (max 800 characters).');
      err.status = 400;
      throw err;
    }
    const history = Array.isArray(req.body?.history) ? req.body.history : [];
    const result = await runKat({ message, history });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

app.get('/api/posts', (_req, res, next) => {
  try {
    const file = path.join(__dirname, 'data', 'posts.json');
    const posts = JSON.parse(fs.readFileSync(file, 'utf8'));
    res.json(posts);
  } catch (err) {
    next(err);
  }
});

app.post('/api/contact', formLimiter, async (req, res, next) => {
  try {
    const data = parse(contactSchema, req.body || {});
    if (data.website) return res.json({ ok: true }); // honeypot
    const lead = createLead(data);
    sendLeadEmails(lead).catch((e) => console.error('Lead email failed:', e.message));
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

app.post('/api/tickets', formLimiter, async (req, res, next) => {
  try {
    const data = parse(ticketSchema, req.body || {});
    if (data.website) return res.json({ ok: true, reference: 'NX-HONEYPOT' });
    const ticket = createTicket(data);
    sendTicketEmails(ticket).catch((e) => console.error('Ticket email failed:', e.message));
    res.json({ ok: true, reference: ticket.reference });
  } catch (err) {
    next(err);
  }
});

app.post('/api/admin/login', loginLimiter, async (req, res, next) => {
  try {
    const { username, password } = parse(loginSchema, req.body || {});
    const expectedUser = process.env.ADMIN_USER || 'admin';
    const hash = process.env.ADMIN_PASSWORD_HASH;
    const plain = process.env.ADMIN_PASSWORD;

    let ok = false;
    if (username === expectedUser) {
      if (hash) ok = await bcrypt.compare(password, hash);
      else if (plain) ok = password === plain;
    }
    if (!ok) {
      const err = new Error('Invalid username or password.');
      err.status = 401;
      throw err;
    }
    req.session.admin = { user: username };
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

app.post('/api/admin/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('nexora.sid');
    res.json({ ok: true });
  });
});

app.get('/api/admin/me', (req, res) => {
  if (!req.session?.admin) return res.status(401).json({ error: 'Please sign in.' });
  res.json({ ok: true, user: req.session.admin.user });
});

app.get('/api/admin/leads', requireAdmin, (req, res, next) => {
  try {
    const rows = listLeads({ q: req.query.q, handled: req.query.handled });
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

app.patch('/api/admin/leads/:id', requireAdmin, (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!id) {
      const err = new Error('Invalid lead id.');
      err.status = 400;
      throw err;
    }
    const handled = Boolean(req.body?.handled);
    const row = setLeadHandled(id, handled);
    if (!row) {
      const err = new Error('Lead not found.');
      err.status = 404;
      throw err;
    }
    res.json(row);
  } catch (err) {
    next(err);
  }
});

app.get('/api/admin/leads.csv', requireAdmin, (req, res, next) => {
  try {
    const rows = listLeads({ q: req.query.q, handled: req.query.handled });
    const csv = leadsToCsv(rows);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"');
    res.send(csv);
  } catch (err) {
    next(err);
  }
});

app.get('/admin', (_req, res) => {
  res.sendFile(path.join(PUBLIC, 'admin.html'));
});

app.use((err, _req, res, _next) => {
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ error: 'Origin not allowed.' });
  }
  const status = err.status || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({
    error: status >= 500 ? 'Something went wrong on our side. Please try again shortly.' : err.message,
  });
});

function start() {
  if (!process.env.SESSION_SECRET && IS_PROD) {
    console.warn('WARNING: SESSION_SECRET is not set.');
  }
  const server = app.listen(PORT, () => {
    console.log(`Refine ICT running on http://localhost:${PORT}`);
  });
  const shutdown = () => {
    console.log('Shutting down…');
    server.close(() => process.exit(0));
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
  return server;
}

if (require.main === module) start();

module.exports = { app, start };
