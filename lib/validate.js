const { z } = require('zod');

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Please enter your name.').max(200),
  email: z
    .string()
    .trim()
    .email('Please enter a valid email address.')
    .max(320),
  phone: z.string().trim().max(40).optional().default(''),
  service: z.string().trim().max(200).optional().default(''),
  message: z
    .string()
    .trim()
    .min(10, 'Please enter a message of at least 10 characters.')
    .max(2000),
  website: z.string().optional(),
});

const ticketSchema = z.object({
  name: z.string().trim().min(1, 'Please enter your name.').max(200),
  email: z.string().trim().email('Please enter a valid email address.').max(320),
  phone: z.string().trim().max(40).optional().default(''),
  subject: z.string().trim().min(3, 'Please enter a subject.').max(200),
  message: z
    .string()
    .trim()
    .min(10, 'Please describe the issue in at least 10 characters.')
    .max(4000),
  priority: z.enum(['normal', 'high', 'critical']).optional().default('normal'),
  website: z.string().optional(),
});

const loginSchema = z.object({
  username: z.string().trim().min(1).max(100),
  password: z.string().min(1).max(200),
});

function parse(schema, data) {
  const result = schema.safeParse(data);
  if (!result.success) {
    const msg = result.error.issues[0]?.message || 'Invalid input.';
    const err = new Error(msg);
    err.status = 400;
    throw err;
  }
  return result.data;
}

module.exports = { contactSchema, ticketSchema, loginSchema, parse };
