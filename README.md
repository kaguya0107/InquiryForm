# Inquiry Form App

Next.js 14 (App Router) inquiry page with JA/EN UI, React Hook Form + Zod validation, and JSON POST to a Make.com webhook.

## Requirements

- Node.js 18+ (recommended: match your deployment runtime)

## Setup

```bash
npm install
cp .env.example .env
```

Edit `.env` and set your webhook URL.

## Environment variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_MAKE_WEBHOOK_URL` | HTTPS endpoint that accepts `POST` with `Content-Type: application/json`. Missing or empty URL disables submission (shows an error toast). |

Payload shape sent on submit:

```json
{
  "company_name": "",
  "client_name": "",
  "email": "",
  "phone_number": "",
  "inquiry_content": ""
}
```

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Development server ([http://localhost:3000](http://localhost:3000)) |
| `npm run build` | Production build |
| `npm run start` | Run production server (after `build`) |
| `npm run lint` | ESLint |

## Notes

- Success flow opens a modal only (no success toast).
- If dev hits missing `/_next/static` chunks or `Cannot find module` under `.next/server`, stop the dev server, delete `.next`, and run `npm run dev` again.
