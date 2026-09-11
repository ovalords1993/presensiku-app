# Deployment Notes

## Vercel

1. Import this repository into Vercel.
2. Set the following environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Deploy the project.

## Local development

1. Copy `.env.example` to `.env.local`
2. Fill in your Supabase values
3. Run `npm run dev`

## Health check

After starting the app, visit:
- `http://localhost:3000/api/health`

This endpoint reports whether:
- public Supabase client is configured
- service-role client is configured
- the app is running in demo mode
