import dotenv from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
dotenv.config({ path: path.join(root, '.env') })

function required(name) {
  const value = String(process.env[name] || '').trim()
  if (!value) throw new Error(`Set ${name} in C:\\omegason-api\\.env`)
  return value
}

const jwtSecret = required('JWT_SECRET')
if (jwtSecret.length < 16) throw new Error('JWT_SECRET must be at least 16 characters.')

const databaseUrl = required('DATABASE_URL')
if (!databaseUrl.startsWith('postgres')) {
  throw new Error('DATABASE_URL must be the Supabase Postgres connection string.')
}

const production = process.env.NODE_ENV === 'production'

// The browser sends the page's origin with no trailing slash. A value that is
// only in CLIENT_ORIGIN is added too, so a Netlify preview URL can be allowed
// without removing the public site.
const builtinOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://omegason.netlify.app',
  'https://www.omegasonenergy.org',
  'https://omegasonenergy.org',
]

const clientOrigins = [
  ...new Set([
    ...builtinOrigins,
    ...(process.env.CLIENT_ORIGIN || '')
      .split(',')
      .map((origin) => origin.trim().replace(/\/+$/, ''))
      .filter(Boolean),
  ]),
]

export const config = {
  root,
  port: Number(process.env.PORT) || 5050,
  clientOrigins,
  // Public site address. Emails turn /products/... image paths into links against it.
  siteUrl: String(process.env.SITE_URL || clientOrigins[0] || '').trim().replace(/\/+$/, ''),
  jwtSecret,
  adminEmail: String(process.env.ADMIN_EMAIL || '').trim().toLowerCase(),
  adminPassword: String(process.env.ADMIN_PASSWORD || ''),
  revealOtp: process.env.OTP_REVEAL !== 'false',
  resendApiKey: String(process.env.RESEND_API_KEY || '').trim(),
  resendFrom: String(process.env.RESEND_FROM || '').trim(),
  contactInbox: String(process.env.CONTACT_INBOX || 'omegasonenergy@gmail.com').trim().toLowerCase(),
  cloudinaryCloudName: String(process.env.CLOUDINARY_CLOUD_NAME || '').trim(),
  cloudinaryApiKey: String(process.env.CLOUDINARY_API_KEY || '').trim(),
  cloudinaryApiSecret: String(process.env.CLOUDINARY_API_SECRET || '').trim(),
  databaseUrl,
  production,
  cookieSameSite: production ? 'none' : 'lax',
  cookieSecure: production,
}
