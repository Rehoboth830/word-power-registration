import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getRows, appendRow } from './_lib/sheets.js';
import { sendConfirmation } from './_lib/email.js';

const DESCRIBES = [
  'head_lead_pastor', 'ordained_minister', 'ministry_worker', 'music_minister',
  'marketplace_professional', 'business_owner', 'student', 'missionary', 'others',
];

function clean(v: unknown, max: number): string {
  if (typeof v !== 'string') return '';
  return v.replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, max);
}

function isValidEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function isValidNigerianPhone(v: string): boolean {
  const digits = v.replace(/\D/g, '');
  if (digits.length === 10) return /^[789]/.test(digits);
  if (digits.length === 11) return /^0[789]/.test(digits);
  return false;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const d = {
    fullName: clean(body.fullName, 120),
    stateCity: clean(body.stateCity, 120),
    phone: clean(body.phone, 30),
    email: clean(body.email, 200).toLowerCase(),
    describes: clean(body.describes, 60),
    attendance: clean(body.attendance, 40),
    volunteer: clean(body.volunteer, 60) || 'none',
    expectations: clean(body.expectations, 1000),
  };

  if (!d.fullName || !d.stateCity || !d.attendance) {
    return res.status(400).json({ error: 'Please fill in all required fields.' });
  }
  if (!isValidEmail(d.email)) {
    return res.status(400).json({ error: 'Enter a valid email address.' });
  }
  if (!isValidNigerianPhone(d.phone)) {
    return res.status(400).json({ error: 'Enter a valid phone number.' });
  }
  if (!DESCRIBES.includes(d.describes)) {
    return res.status(400).json({ error: 'Please select an option.' });
  }

  try {
    const rows = await getRows();
    const exists = rows.some((r) => (r[4] ?? '').trim().toLowerCase() === d.email);
    if (exists) {
      return res.status(409).json({ error: 'You have already registered with this email address.' });
    }

    const now = new Date();
    const nextReminder = new Date(now.getTime() + 5 * 86400000);
    await appendRow([
      now.toISOString(), d.fullName, d.stateCity, d.phone, d.email,
      d.describes, d.attendance, d.volunteer, d.expectations, nextReminder.toISOString(),
    ]);
  } catch (err) {
    console.error('Sheet error:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }

  // The registration is already saved. A failed email must not undo it.
  try {
    await sendConfirmation(d);
  } catch (err) {
    console.error('Confirmation email failed:', err);
  }

  return res.status(200).json({ ok: true });
}