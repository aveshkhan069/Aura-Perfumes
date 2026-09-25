# Supabase setup

For a one-time full database setup, copy all of `setup.sql` into Supabase Dashboard → SQL Editor and run it. It creates the complete storefront/customer schema, RLS policies, trusted cart/order RPCs, auth profile trigger, and Aura seed catalog. It intentionally leaves the two previously hidden products out of the seed.

The versioned `migrations/` folder is retained for CLI-based incremental deployment. Do not run the auth-only migration as a substitute for `setup.sql` when initializing a fresh project.

1. Keep the public project URL and anon/publishable key in `.env` as `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Never use a service-role key in this app.
2. In Supabase Auth URL Configuration, add the local app URL (`http://localhost:3000`) and the deployed Aura site URL to the allowed redirect URLs. Add `/reset-password` to the allowed callback routes.
3. Configure email confirmation and SMTP under Supabase Auth for production.
4. Google OAuth is wired in the UI; enable Google in Supabase Auth Providers and add the provider callback URL shown in the dashboard before using it.
5. Admin roles must be assigned by a trusted project owner in the Supabase dashboard or a secure server-side process. The client cannot set its own profile role.

All customer tables have RLS. The signup trigger always assigns the `customer` role. The SQL order RPC calculates current prices, stock, coupons, totals, and snapshots order items; payment remains pending until a trusted provider webhook confirms it.
