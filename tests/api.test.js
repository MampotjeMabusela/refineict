const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');

process.env.NODE_ENV = 'test';
process.env.SESSION_SECRET = 'test-secret';
process.env.ADMIN_USER = 'admin';
process.env.ADMIN_PASSWORD = 'testpass';
process.env.CORS_ORIGIN = 'http://localhost:3000';
process.env.KAT_DISABLE_LLM = '1';

const { app } = require('../server');

describe('API', () => {
  it('GET /api/health', async () => {
    const res = await request(app).get('/api/health');
    assert.equal(res.status, 200);
    assert.equal(res.body.ok, true);
  });

  it('GET /api/posts returns array', async () => {
    const res = await request(app).get('/api/posts');
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body));
    assert.ok(res.body.length >= 1);
  });

  it('POST /api/contact validates input', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ name: '', email: 'bad', message: 'short' });
    assert.equal(res.status, 400);
    assert.ok(res.body.error);
  });

  it('POST /api/contact accepts valid lead', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({
        name: 'Test User',
        email: 'test.user@example.com',
        phone: '0120000000',
        service: 'Cybersecurity',
        message: 'We need a security review for our office.',
      });
    assert.equal(res.status, 200);
    assert.equal(res.body.ok, true);
  });

  it('POST /api/contact honeypot is silent ok', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({
        name: 'Bot',
        email: 'bot@example.com',
        message: 'This is spam content long enough.',
        website: 'http://spam.test',
      });
    assert.equal(res.status, 200);
    assert.equal(res.body.ok, true);
  });

  it('POST /api/tickets returns reference', async () => {
    const res = await request(app)
      .post('/api/tickets')
      .send({
        name: 'Client',
        email: 'client@example.com',
        subject: 'Printer offline',
        message: 'The reception printer is not responding since this morning.',
        priority: 'high',
      });
    assert.equal(res.status, 200);
    assert.equal(res.body.ok, true);
    assert.match(res.body.reference, /^RF-\d{4}-\d{4}$/);
  });

  it('POST /api/kat answers and can navigate', async () => {
    const pricing = await request(app).post('/api/kat').send({ message: 'take me to pricing' });
    assert.equal(pricing.status, 200);
    assert.equal(pricing.body.ok, true);
    assert.equal(pricing.body.agent, 'Kat');
    assert.ok(pricing.body.reply);
    assert.ok(pricing.body.navigate);
    assert.match(pricing.body.navigate.href, /plans|#pricing|services/i);

    const about = await request(app).post('/api/kat').send({ message: 'What is your phone number?' });
    assert.equal(about.status, 200);
    assert.match(String(about.body.reply), /72 614|hello@refineict|WhatsApp/i);
  });

  it('POST /api/kat validates empty message', async () => {
    const res = await request(app).post('/api/kat').send({ message: '   ' });
    assert.equal(res.status, 400);
  });

  it('admin login and lead list', async () => {
    const agent = request.agent(app);
    const bad = await agent.post('/api/admin/login').send({ username: 'admin', password: 'wrong' });
    assert.equal(bad.status, 401);

    const ok = await agent.post('/api/admin/login').send({ username: 'admin', password: 'testpass' });
    assert.equal(ok.status, 200);

    const me = await agent.get('/api/admin/me');
    assert.equal(me.status, 200);

    const leads = await agent.get('/api/admin/leads');
    assert.equal(leads.status, 200);
    assert.ok(Array.isArray(leads.body));

    const csv = await agent.get('/api/admin/leads.csv');
    assert.equal(csv.status, 200);
    assert.match(csv.text, /email/);
  });
});
