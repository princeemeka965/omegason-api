import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { config } from '../config.js'
import { ApiError } from '../errors.js'
import { codesMatch, hashCode, MAX_ATTEMPTS, newCode, OTP_TTL_MS } from '../lib/otp.js'
import { isEmail } from '../lib/text.js'
import { AccountChange, Admin } from '../models.js'
import { mailConfigured, sendAccountChangeEmail } from './mail.js'
import { getQuotesEmail, saveQuotesEmail } from './quotes.js'

const SESSION_MS = 7 * 24 * 60 * 60 * 1000

function present(admin) {
  return { name: admin.name || '', email: admin.email }
}

export async function getAccount(adminId) {
  const admin = await Admin.findByPk(adminId)
  if (!admin) throw new ApiError(401, 'Sign in to continue.')
  return present(admin)
}

async function loadChallenge(adminId) {
  return AccountChange.findOne({ where: { adminId }, order: [['createdAt', 'DESC']] })
}

export async function requestAccountChange(adminId, input) {
  const admin = await Admin.findByPk(adminId)
  if (!admin) throw new ApiError(401, 'Sign in to continue.')

  const name = admin.name || ''
  const email = String(input.email || '').trim().toLowerCase()
  const password = String(input.password || '')
  const passwordConfirm = String(input.passwordConfirm || '')
  if (!isEmail(email)) throw new ApiError(400, 'Enter a valid email address.')
  if (password || passwordConfirm) {
    if (password.length < 8) throw new ApiError(400, 'Use a password of at least 8 characters.')
    if (password !== passwordConfirm) throw new ApiError(400, 'The new passwords do not match.')
  }

  const quotesEmail = String(input.quotesEmail || '').trim().toLowerCase()
  if (quotesEmail && !isEmail(quotesEmail)) throw new ApiError(400, 'Enter a valid email address for quote requests.')
  const currentQuotes = (await getQuotesEmail()).toLowerCase()
  const quotesChanged = quotesEmail !== currentQuotes

  const emailChanged = email !== admin.email
  const passwordChanged = Boolean(password)
  if (!emailChanged && !passwordChanged && !quotesChanged) {
    throw new ApiError(400, 'Nothing has changed.')
  }
  if (emailChanged) {
    const taken = await Admin.findOne({ where: { email } })
    if (taken && taken.id !== admin.id) throw new ApiError(400, 'That email is already used.')
  }

  const code = newCode()
  const expiresAt = new Date(Date.now() + OTP_TTL_MS)
  const passwordHash = passwordChanged ? await bcrypt.hash(password, 10) : null
  await AccountChange.destroy({ where: { adminId: admin.id } })
  await AccountChange.create({
    adminId: admin.id,
    codeHash: hashCode(admin.id, code),
    expiresAt,
    attempts: 0,
    name,
    email,
    passwordHash,
    quotesEmail: quotesChanged ? quotesEmail : null,
  })

  const changes = {
    name: '',
    email: emailChanged ? email : '',
    password: passwordChanged,
    quotesEmail: quotesChanged ? quotesEmail : null,
  }

  // Always the address already on the account. A replacement email is not used until the code is entered.
  if (mailConfigured()) {
    try {
      await sendAccountChangeEmail({ to: admin.email, code, changes })
    } catch (error) {
      await AccountChange.destroy({ where: { adminId: admin.id } })
      throw error
    }
  } else if (!config.revealOtp) {
    await AccountChange.destroy({ where: { adminId: admin.id } })
    throw new ApiError(424, 'Add RESEND_API_KEY and RESEND_FROM to the API environment, then try again.')
  }

  return {
    sentTo: admin.email,
    expiresAt: expiresAt.toISOString(),
    devCode: mailConfigured() || !config.revealOtp ? null : code,
  }
}

export async function confirmAccountChange(adminId, code) {
  const admin = await Admin.findByPk(adminId)
  const digits = String(code || '').replace(/\D/g, '')
  const challenge = admin ? await loadChallenge(admin.id) : null
  if (!admin || !challenge) throw new ApiError(401, 'That code has expired. Request a new one.')
  if (new Date(challenge.expiresAt).getTime() <= Date.now() || challenge.attempts >= MAX_ATTEMPTS) {
    await challenge.destroy()
    throw new ApiError(401, 'That code has expired. Request a new one.')
  }
  if (!codesMatch(admin.id, digits, challenge.codeHash)) {
    challenge.attempts += 1
    await challenge.save()
    if (challenge.attempts >= MAX_ATTEMPTS) {
      await challenge.destroy()
      throw new ApiError(401, 'That code has expired. Request a new one.')
    }
    throw new ApiError(401, 'That code is incorrect.')
  }

  if (challenge.email !== admin.email) {
    const taken = await Admin.findOne({ where: { email: challenge.email } })
    if (taken && taken.id !== admin.id) {
      await challenge.destroy()
      throw new ApiError(400, 'That email is already used. Start the change again.')
    }
  }

  admin.name = challenge.name
  admin.email = challenge.email
  if (challenge.passwordHash) admin.passwordHash = challenge.passwordHash
  await admin.save()
  if (challenge.quotesEmail != null) await saveQuotesEmail(challenge.quotesEmail)
  await challenge.destroy()

  const token = jwt.sign({ sub: admin.id, email: admin.email }, config.jwtSecret, { expiresIn: '7d' })
  return { token, maxAge: SESSION_MS, ...present(admin) }
}

export async function cancelAccountChange(adminId) {
  await AccountChange.destroy({ where: { adminId } })
}
