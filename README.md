# ANT Digital Office (ANTDO) v1.0

Foundation source code for Alpha Nusantara Teknologi.

## Run locally
1. Install Node.js LTS.
2. `npm install`
3. Copy `.env.example` to `.env.local` when Supabase credentials are available.
4. `npm run dev`
5. Open `http://localhost:3000`

## Deploy
Push this repository to GitHub, then import the repository into Vercel. Add the same environment variables in Vercel before enabling Supabase features.

## Scope
This package is the foundation/testing build: navigation, dashboard shell, module routes, responsive UI, and Supabase client placeholder. Business workflows and authentication are intentionally added in controlled stages after the foundation passes build/deployment testing.
