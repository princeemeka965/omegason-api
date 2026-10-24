import { ApiError } from '../errors.js'
import { isNigerianState } from '../lib/states.js'
import { sanitizeRichText } from '../lib/html.js'
import { isEmail, plainText } from '../lib/text.js'
import { Product, Quote, Setting } from '../models.js'
import { presentQuote } from '../present.js'
import { config } from '../config.js'
import { sendContactMessage, sendQuoteReply } from './mail.js'

const QUOTES_KEY = 'quotesEmail'

export async function getQuotesEmail() {
  const row = await Setting.findByPk(QUOTES_KEY)
  return row?.value || ''
}

export async function getSettings() {
  return { quotesEmail: await getQuotesEmail() }
}

export async function saveQuotesEmail(email) {
  const clean = String(email || '').trim().toLowerCase()
  if (clean && !isEmail(clean)) throw new ApiError(400, 'Enter a valid email address.')
  await Setting.upsert({ key: QUOTES_KEY, value: clean })
  if (clean) {
    await Quote.update({ destinationEmail: clean }, { where: { destinationEmail: null } })
  }
  return clean
}

export async function listQuotes() {
  const rows = await Quote.findAll({ order: [['createdAt', 'DESC']] })
  const missing = [...new Set(rows.filter((row) => row.productSlug && !row.productImage).map((row) => row.productSlug))]
  const images = new Map()
  if (missing.length) {
    const products = await Product.findAll({ where: { slug: missing }, attributes: ['slug', 'image'] })
    for (const product of products) images.set(product.slug, product.image || null)
  }
  return rows.map((row) => {
    const quote = presentQuote(row)
    if (!quote.productImage && images.get(row.productSlug)) quote.productImage = images.get(row.productSlug)
    return quote
  })
}

function cleanPhone(value) {
  const phone = String(value || '').trim()
  const digits = phone.replace(/\D/g, '')
  if (digits.length < 10 || digits.length > 15) return ''
  return phone.slice(0, 40)
}

export async function addQuote(input) {
  const name = String(input.name || '').trim()
  const email = String(input.email || '').trim()
  const phone = cleanPhone(input.phone)
  const state = String(input.state || '').trim()
  const subject = String(input.subject || '').trim()
  const message = String(input.message || '').trim()
  const productSlug = String(input.productSlug || '').trim()
  let productName = String(input.productName || '').trim()
  if (!name || !isEmail(email) || !subject || !message) {
    throw new ApiError(400, 'Enter your name, email, subject, and message.')
  }
  const needsState = Boolean(productSlug) || input.kind === 'sizing'
  if (needsState && !isNigerianState(state)) {
    throw new ApiError(400, 'Enter your name, email, state, subject, and message.')
  }
  if (state && !isNigerianState(state)) {
    throw new ApiError(400, 'Choose a state.')
  }
  if (String(input.phone || '').trim() && !phone) {
    throw new ApiError(400, 'Enter a phone number with 10 to 15 digits.')
  }
  if ((productSlug || input.kind === 'sizing') && !phone) {
    throw new ApiError(400, 'Enter your name, email, phone number, state, subject, and message.')
  }
  let productImage = null
  if (productSlug) {
    const product = await Product.findOne({ where: { slug: productSlug } })
    if (!productName) productName = product?.name || ''
    productImage = product?.image || null
  }
  const kind = productSlug ? 'product' : (input.kind === 'sizing' ? 'sizing' : 'general')
  const destinationEmail = kind === 'general' ? config.contactInbox : ((await getQuotesEmail()) || null)
  const quote = await Quote.create({
    name: name.slice(0, 160),
    email: email.slice(0, 160).toLowerCase(),
    phone,
    state,
    subject: subject.slice(0, 200),
    message: message.slice(0, 5000),
    productSlug: productSlug.slice(0, 80),
    productName: productName.slice(0, 160),
    productImage,
    kind,
    read: false,
    destinationEmail,
  })
  if (kind === 'general') {
    try {
      await sendContactMessage({
        name: quote.name,
        email: quote.email,
        subject: quote.subject,
        message: quote.message,
      })
    } catch (err) {
      console.error(err)
    }
  }
  return presentQuote(quote)
}

export async function markQuoteRead(id) {
  const quote = await Quote.findByPk(id)
  if (!quote) throw new ApiError(404, 'That quote request was not found.')
  quote.read = true
  await quote.save()
  return presentQuote(quote)
}

export async function replyToQuote(id, input) {
  const quote = await Quote.findByPk(id)
  if (!quote) throw new ApiError(404, 'That quote request was not found.')
  if (quote.kind !== 'sizing' && quote.kind !== 'product' && quote.kind !== 'general') {
    throw new ApiError(400, 'This request cannot be answered by email.')
  }
  const reply = sanitizeRichText(input?.message)
  const length = plainText(reply).length
  if (length < 10 || length > 4000 || reply.length > 20000) {
    throw new ApiError(400, 'Write the reply you want to send.')
  }
  quote.reply = reply
  quote.repliedAt = new Date()
  quote.read = true
  await quote.save()
  let productImage = quote.productImage
  if (quote.kind === 'product' && !productImage) {
    const product = await Product.findOne({ where: { slug: quote.productSlug }, attributes: ['image'] })
    productImage = product?.image || null
  }
  try {
    await sendQuoteReply({
      to: quote.email,
      name: quote.name,
      reply,
      subject: quote.subject,
      kind: quote.kind,
      productName: quote.productName,
      productImage,
    })
    return { quote: presentQuote(quote), emailed: true, emailError: '' }
  } catch (err) {
    const emailError = err instanceof ApiError
      ? err.message
      : 'The reply could not be emailed. Check the Resend key and from address, then try again.'
    return { quote: presentQuote(quote), emailed: false, emailError }
  }
}

export async function deleteQuote(id) {
  const quote = await Quote.findByPk(id)
  if (!quote) throw new ApiError(404, 'That quote request was not found.')
  await quote.destroy()
}
