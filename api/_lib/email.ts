import nodemailer from 'nodemailer';

type Registrant = { fullName: string; attendance: string; email: string };

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildHtml(name: string, attendance: string, intro: string, closing: string): string {
  return `<div style="background-color:#f3f4f6;padding:40px 20px;font-family:Arial, sans-serif;">
  <table role="presentation" width="100%" style="max-width:520px;margin:0 auto;background-color:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
    <tr>
      <td bgcolor="#000000" style="background-color:#000000;height:6px;line-height:6px;font-size:0;">&nbsp;</td>
    </tr>
    <tr>
      <td bgcolor="#ffffff" style="background-color:#ffffff;padding:36px 32px 28px;text-align:center;">
        <p style="margin:0;color:#3fc9b4;font-size:12px;letter-spacing:2px;text-transform:uppercase;font-weight:bold;">Rose of Sharon Zonal Youths Conference</p>
        <h1 style="margin:14px 0 0;color:#06201d;font-size:32px;font-family:Arial, Helvetica, sans-serif;font-weight:900;letter-spacing:0.5px;">ROZYC 2026</h1>
      </td>
    </tr>
    <tr>
      <td bgcolor="#ffffff" style="background-color:#ffffff;padding:0 32px 32px;">
        <p style="margin:0 0 16px;color:#111827;font-size:16px;">Hi <b>${name}</b>,</p>
        <p style="margin:0 0 20px;color:#374151;font-size:15px;line-height:1.7;">${intro}</p>

        <p style="margin:0 0 24px;padding:16px 18px;background-color:#f0fdfa;border-left:3px solid #3fc9b4;color:#065f46;font-size:13.5px;font-style:italic;line-height:1.6;">
          "But we all, with open face beholding as in a glass the glory of the Lord, are changed into the same image."<br>&mdash; 2 Corinthians 3:18
        </p>

        <table role="presentation" width="100%" style="border:1px solid #e5e7eb;border-radius:10px;margin-bottom:24px;overflow:hidden;">
          <tr>
            <td style="padding:16px 20px;border-left:4px solid #3fc9b4;border-bottom:1px solid #e5e7eb;">
              <p style="margin:0;font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">Theme</p>
              <p style="margin:4px 0 0;font-size:15px;color:#111827;font-weight:bold;">Beholding</p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 20px;border-left:4px solid #e8c468;border-bottom:1px solid #e5e7eb;">
              <p style="margin:0;font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">Date</p>
              <p style="margin:4px 0 0;font-size:15px;color:#111827;font-weight:bold;">November 28, 2026</p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 20px;border-left:4px solid #8fe3d3;">
              <p style="margin:0;font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">Attending</p>
              <p style="margin:4px 0 0;font-size:15px;color:#111827;font-weight:bold;text-transform:capitalize;">${attendance}</p>
            </td>
          </tr>
        </table>

        <table role="presentation" align="center" style="margin:0 auto 20px;">
          <tr>
            <td bgcolor="#06201d" style="border-radius:8px;background-color:#06201d;">
              <a href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=ROZYC%202026%20-%20Beholding&dates=20261128/20261129&details=Rose%20of%20Sharon%20Zonal%20Youths%20Conference%202026.%20Theme%3A%20Beholding.&location=Rose%20of%20Sharon%2C%20Igoba%2C%20Akure" style="display:inline-block;padding:13px 30px;color:#ffffff;font-weight:bold;font-size:14px;text-decoration:none;">+ Add to Calendar</a>
            </td>
          </tr>
        </table>

        <p style="margin:0;color:#374151;font-size:15px;line-height:1.6;text-align:center;">${closing}</p>
      </td>
    </tr>
    <tr>
      <td bgcolor="#f9fafb" style="background-color:#f9fafb;padding:20px 32px;text-align:center;border-top:1px solid #e5e7eb;">
        <p style="margin:0;color:#6b7280;font-size:13px;">See you there!<br><b style="color:#06201d;">ROZYC 2026 TEAM</b></p>
      </td>
    </tr>
  </table>
  <p style="max-width:520px;margin:16px auto 0;text-align:center;color:#9ca3af;font-size:11px;line-height:1.5;">
    You're receiving this email because you registered for ROZYC 2026.<br>
    Rose of Sharon Zonal Youths Conference &middot; Igoba, Akure, Nigeria
  </p>
</div>`;
}

function transport() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) throw new Error('GMAIL_USER or GMAIL_APP_PASSWORD is not set');
  return { user, mailer: nodemailer.createTransport({ service: 'gmail', auth: { user, pass } }) };
}

export async function sendConfirmation(r: Registrant): Promise<void> {
  const { user, mailer } = transport();
  await mailer.sendMail({
    from: `"ROZYC 2026 Team" <${user}>`,
    to: r.email,
    subject: 'ROZYC 2026 - Registration Confirmed',
    html: buildHtml(esc(r.fullName), esc(r.attendance), CONFIRM_INTRO, CONFIRM_CLOSING),
  });
}

const CONFIRM_INTRO = `Something is about to shift. <b>ROZYC 2026</b> isn't just another gathering &mdash; it's a set-apart moment for a generation ready to behold God like never before, and be changed in the process. Your seat is confirmed. Now the countdown begins.`;
const CONFIRM_CLOSING = `Come expectant. Come ready. A greater awakening awaits &mdash; and we'll see you there.`;
const REMINDER_INTRO = `The countdown continues. Your seat for <b>ROZYC 2026</b> is still reserved, and the moment is drawing nearer. This isn't just a date on a calendar - it's an invitation to encounter something greater. Come expectant. Don't let the day catch you unprepared.`;
const REMINDER_CLOSING = `A greater awakening awaits - and your seat is waiting with it.`;

export async function sendReminder(r: Registrant): Promise<void> {
  const { user, mailer } = transport();
  await mailer.sendMail({
    from: `"ROZYC 2026 Team" <${user}>`,
    to: r.email,
    subject: 'The Countdown Continues - ROZYC 2026 Awaits You',
    html: buildHtml(esc(r.fullName), esc(r.attendance), REMINDER_INTRO, REMINDER_CLOSING),
  });
}