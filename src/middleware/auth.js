import { config } from '../config.js'
import { readSession } from '../services/auth.js'

export const COOKIE = 'admin_token'

export function requireAdmin(req, res, next) {
  const session = readSession(req.cookies?.[COOKIE])
  if (!session) {
    res.status(401).json({ error: 'Sign in to continue.' })
    return
  }
  req.admin = session
  next()
}

function cookieOptions(maxAge) {
  return {
    httpOnly: true,
    sameSite: config.cookieSameSite,
    secure: config.cookieSecure,
    path: '/',
    ...(maxAge == null ? {} : { maxAge }),
  }
}

export function setSessionCookie(res, token, maxAge) {
  res.cookie(COOKIE, token, cookieOptions(maxAge))
}

export function clearSessionCookie(res) {
  res.clearCookie(COOKIE, cookieOptions())
}
