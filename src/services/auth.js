import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { config } from '../config.js'
import { ApiError } from '../errors.js'
import { isEmail } from '../lib/text.js'
import { Admin } from '../models.js'

const SESSION_MS = 7 * 24 * 60 * 60 * 1000

export async function signIn({ email, password }) {
  const clean = String(email || '').trim().toLowerCase()
  if (!isEmail(clean) || String(password || '').length < 8) {
    throw new ApiError(401, 'Email or password is incorrect.')
  }
  const admin = await Admin.findOne({ where: { email: clean } })
  const matches = admin ? await bcrypt.compare(String(password), admin.passwordHash) : false
  if (!admin || !matches) throw new ApiError(401, 'Email or password is incorrect.')
  const token = jwt.sign({ sub: admin.id, email: admin.email }, config.jwtSecret, { expiresIn: '7d' })
  return {
    token,
    session: { email: admin.email, signedInAt: Date.now() },
    maxAge: SESSION_MS,
  }
}

export function readSession(token) {
  if (!token) return null
  try {
    const payload = jwt.verify(token, config.jwtSecret)
    if (!payload?.sub || !payload.email) return null
    return { id: payload.sub, email: payload.email, signedInAt: payload.iat * 1000 }
  } catch {
    return null
  }
}
