const nodemailer = require('nodemailer');

function smtpConfigured() {
  const host = process.env.SMTP_HOST || '';
  if (!host || !process.env.SMTP_FROM) return false;
  if (host.includes('example.com')) return false;
  return true;
}

function createTransport() {
  if (!smtpConfigured()) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth:
      process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS || '' }
        : undefined,
  });
}

async function sendLeadEmails(lead) {
  const transport = createTransport();
  if (!transport) {
    console.warn('SMTP not configured — skipping lead emails');
    return { skipped: true };
  }
  const notifyTo = process.env.NOTIFY_EMAIL || process.env.SMTP_FROM;
  const company = process.env.COMPANY_NAME || 'Refine ICT';

  await transport.sendMail({
    from: process.env.SMTP_FROM,
    to: notifyTo,
    subject: `[${company}] New lead from ${lead.name}`,
    text: [
      'New website lead',
      `Name: ${lead.name}`,
      `Email: ${lead.email}`,
      `Phone: ${lead.phone || '—'}`,
      `Service: ${lead.service || '—'}`,
      '',
      lead.message,
    ].join('\n'),
  });

  await transport.sendMail({
    from: process.env.SMTP_FROM,
    to: lead.email,
    subject: `We received your request — ${company}`,
    text: [
      `Hi ${lead.name},`,
      '',
      `Thanks for contacting ${company}. We have received your message and will reply within one business day.`,
      '',
      'Summary of what you sent:',
      lead.message,
      '',
      'Kind regards,',
      company,
    ].join('\n'),
  });

  return { ok: true };
}

async function sendTicketEmails(ticket) {
  const transport = createTransport();
  if (!transport) {
    console.warn('SMTP not configured — skipping ticket emails');
    return { skipped: true };
  }
  const notifyTo = process.env.NOTIFY_EMAIL || process.env.SMTP_FROM;
  const company = process.env.COMPANY_NAME || 'Refine ICT';

  await transport.sendMail({
    from: process.env.SMTP_FROM,
    to: notifyTo,
    subject: `[${company}] Ticket ${ticket.reference} — ${ticket.subject}`,
    text: [
      `Ticket ${ticket.reference}`,
      `Priority: ${ticket.priority}`,
      `From: ${ticket.name} <${ticket.email}>`,
      `Phone: ${ticket.phone || '—'}`,
      '',
      ticket.message,
    ].join('\n'),
  });

  await transport.sendMail({
    from: process.env.SMTP_FROM,
    to: ticket.email,
    subject: `Ticket ${ticket.reference} received — ${company}`,
    text: [
      `Hi ${ticket.name},`,
      '',
      `Your support ticket has been logged. Reference: ${ticket.reference}`,
      'Please keep this number handy when you follow up.',
      '',
      'Kind regards,',
      company,
    ].join('\n'),
  });

  return { ok: true };
}

module.exports = { sendLeadEmails, sendTicketEmails, smtpConfigured };
