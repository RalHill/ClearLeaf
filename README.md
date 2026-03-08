# ClearLeaf — Canada's HR Intelligence Layer

Canada's first province-specific employment law intelligence SaaS platform.

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Tech Stack

- **Framework**: Next.js 16.1 with React 19
- **Database**: Supabase PostgreSQL + pgvector
- **Auth**: Supabase Auth (magic link + Google OAuth)
- **AI**: Claude Haiku 3.5 via OpenRouter
- **Background Jobs**: Inngest
- **Payments**: Stripe
- **Hosting**: Vercel
- **Styling**: Tailwind CSS 3.x + shadcn/ui

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your keys.

## Deployment

Deploy to [Vercel](https://vercel.com/new) with a single click.

## Architecture

- `/app` — Next.js 16.1 App Router
- `/components` — Reusable React components
- `/lib` — Utilities, auth, AI, database clients
- `/public` — Static assets
- `/supabase` — Database migrations

## License

Confidential — 2026
