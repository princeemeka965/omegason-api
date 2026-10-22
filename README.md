# Omegason API

Express + Sequelize API for the Omegason catalogue admin. The database is Supabase Postgres.

## Run it

```bash
cd C:\omegason-api
npm install
npm run dev
```

Copy `.env.example` to `.env`. Set `DATABASE_URL` to the URI from Supabase: Project Settings → Database → Connection string. Use the direct connection or the session pooler on port 5432. The transaction pooler on port 6543 does not work with Sequelize.

The first boot creates the tables and the admin from `ADMIN_EMAIL` and `ADMIN_PASSWORD`.

Local sign-in, until you change `.env`:

- Email: `admin@omegasonenergy.org`
- Password: `omegason1`

`OTP_REVEAL=true` returns the one-time code in the login response. Set it to `false` once a mail service sends the code.

The website reads the API address from `VITE_API_URL`. Locally that is `http://localhost:5050`. On Netlify, set `VITE_API_URL` to this service's public URL. `https://www.omegasonenergy.org`, `https://omegasonenergy.org`, and local Vite are allowed without `CLIENT_ORIGIN`. If the site is opened from a Netlify address, add that exact origin to `CLIENT_ORIGIN` on Render and redeploy.

## Routes

| Method | Path | Who |
| --- | --- | --- |
| GET | `/api/health` | public |
| GET | `/api/catalog` | public categories and uploaded products |
| POST | `/api/quotes` | public quote request |
| POST | `/api/auth/login` | email + password, issues an OTP |
| POST | `/api/auth/verify` | OTP, sets the `admin_token` cookie |
| GET | `/api/auth/session` | current admin |
| POST | `/api/auth/logout` | clears the cookie |
| DELETE | `/api/auth/otp` | drops a pending code |
| GET | `/api/admin/bootstrap` | categories, products, quotes, inbox |
| POST / PATCH / DELETE | `/api/categories` | admin |
| POST / PUT / DELETE | `/api/products` | admin |
| GET / PATCH / DELETE | `/api/quotes` | admin |
| PUT | `/api/settings/quotes-email` | admin |
