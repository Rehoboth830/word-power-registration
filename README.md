# ROZYC 2026 Registration

Registration platform for **ROZYC 2026** (Rose of Sharon Zonal Youths Conference, theme "Beholding", 28 November 2026, Akure, Nigeria). Live at https://rozyc2026.vercel.app

A visitor sees the conference flyer, taps Register, fills a short form, and receives a branded confirmation email. Registrations are stored in a Google Sheet that the church team can open directly, and every registrant is reminded automatically until the event.

## Features

- Mobile-first hero: the full flyer is shown uncropped, with a Register bar that fills the remaining screen height
- Validated registration form (Nigerian phone format, email format, controlled option lists)
- Duplicate-registration guard: one registration per email address, with a clear message when repeated
- Animated success screen with an Add to Calendar link
- Branded HTML confirmation email, sent on registration
- Automatic reminder email every 5 days until the event
- Link-preview support (Open Graph and Twitter Card tags) for WhatsApp and social sharing
- Registrant data kept in Google Sheets, so non-technical staff can view and share it

## Architecture

    Browser (React + Vite)
        |  POST /api/register
        v
    Vercel serverless function ---> Google Sheets (duplicate check, append row)
        |
        +---> Gmail SMTP (confirmation email)

    Vercel Cron (daily) ---> /api/reminders ---> Google Sheets (find due rows)
                                              ---> Gmail SMTP (reminder email)
                                              ---> Google Sheets (advance next reminder date)

## Tech stack

- Frontend: React, TypeScript, Vite, Framer Motion
- Backend: Vercel serverless functions (TypeScript, ESM)
- Data: Google Sheets API, authenticated with a Google service account
- Email: Nodemailer over Gmail with an App Password
- Scheduling: Vercel Cron

## Project structure

    api/
      register.ts        Registration endpoint: validate, duplicate check, save, confirm
      reminders.ts       Daily cron endpoint: send due reminders, advance dates
      _lib/
        sheets.ts        Google Sheets client (read rows, append row, update cell)
        email.ts         Email templates and senders
    src/
      components/
        Hero.tsx               Flyer and Register bar
        RegistrationModal.tsx  Form, validation, success and error states
    vercel.json          Cron schedule and function time limits

## Configuration

The backend reads these environment variables, set in the Vercel project settings:

- GOOGLE_SERVICE_ACCOUNT_JSON: the full service-account key JSON
- SHEET_ID: ID of the Google Sheet that stores registrations (shared with the service account as Editor)
- GMAIL_USER: the Gmail address that sends the emails
- GMAIL_APP_PASSWORD: a Gmail App Password for that account
- CRON_SECRET: shared secret; the reminders endpoint rejects any request without it

No secrets are stored in the repository.

## Design decisions

- **Serverless instead of a self-hosted workflow engine.** The first version ran on a laptop-hosted n8n instance. Moving to Vercel functions removed the always-on machine and gave the site a stable public address.
- **Google Sheets as the database.** The organisers needed to view and share registrations without any tooling. A sheet fits the scale of one event.
- **A failed email never undoes a registration.** The row is saved first; if the confirmation email then fails, the error is logged and the registrant is still recorded.
- **Reminders are retried, not skipped.** A reminder's next date only advances after a successful send, so a failed send is retried the next day. Dates advance from the send day, so a missed day never causes a burst of emails.
- **Protected cron endpoint.** The reminders function checks a bearer secret so it cannot be triggered by outsiders.

## Known limitations

- The duplicate check reads the sheet and then appends, so two simultaneous submissions with the same email could both pass. For one event's traffic this is unlikely and acceptable.
- Gmail has a daily sending limit, so this setup suits events with hundreds to a few thousand registrants, not very large audiences.
- Reminder emails are sent one after another within a single function run.

## Local development

    npm install
    npm run dev       # frontend only

The API routes need the environment variables above. Run them locally with the Vercel CLI (vercel dev) after linking the project.

## Deployment

    npx vercel --prod

Built by Gbengisto (GitHub: Rehoboth830) for Rose of Sharon, RCCG, Igoba, Akure.