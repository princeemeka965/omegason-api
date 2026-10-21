import crypto from 'node:crypto'

export const OTP_TTL_MS = 10 * 60 * 1000
export const MAX_ATTEMPTS = 5

export function newCode() {
  return String(crypto.randomInt(100000, 1000000))
}

export function hashCode(adminId, code) {
  return crypto.createHash('sha256').update(`${adminId}:${code}`).digest('hex')
}

export function codesMatch(adminId, code, hash) {
  const next = hashCode(adminId, code)
  const left = Buffer.from(next)
  const right = Buffer.from(String(hash || ''))
  if (left.length !== right.length) return false
  return crypto.timingSafeEqual(left, right)
}
