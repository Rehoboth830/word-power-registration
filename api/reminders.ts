import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getRows, updateCell } from './_lib/sheets.js';
import { sendReminder } from './_lib/email.js';

const EVENT_CUTOFF = new Date('2026-11-29T00:00:00+01:00');
const GAP_MS = 5 * 86400000;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Vercel cron sends "Authorization: Bearer <CRON_SECRET>". Anyone else is refused.
  const secret = process.env.CRON_SECRET;
  if (!secret) return res.status(500).json({ error: 'CRON_SECRET is not set' });
  if (req.headers.authorization !== `Bearer ${secret}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const now = new Date();
  if (now >= EVENT_CUTOFF) return res.status(200).json({ sent: 0, note: 'Event has passed' });

  let rows: string[][];
  try {
    rows = await getRows();
  } catch (err) {
    console.error('Could not read sheet:', err);
    return res.status(500).json({ error: 'Could not read sheet' });
  }

  let sent = 0;
  let failed = 0;

  // Row 0 is the header. Sheet row number = index + 1.
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    const email = (r[4] ?? '').trim();
    const due = new Date(r[9] ?? '');
    if (!email || Number.isNaN(due.getTime()) || due > now) continue;

    try {
      await sendReminder({ fullName: r[1] ?? '', attendance: r[6] ?? '', email });
    } catch (err) {
      failed++;
      console.error(`Reminder failed for row ${i + 1}:`, err);
      continue; // date not advanced, so it is retried tomorrow
    }

    try {
      // From today, not from the old date, so a missed day never causes a burst.
      await updateCell(i + 1, 'J', new Date(now.getTime() + GAP_MS).toISOString());
      sent++;
    } catch (err) {
      failed++;
      console.error(`Sent but could not update row ${i + 1}:`, err);
    }
  }

  return res.status(200).json({ sent, failed });
}