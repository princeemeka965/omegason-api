import { Resend } from 'resend'
import { config } from '../config.js'
import { accountChangeHtml, accountChangeText } from '../email/accountChange.js'
import { contactMessageHtml, contactMessageText } from '../email/contactMessage.js'
import { quoteReplyHtml, quoteReplyText } from '../email/quoteReply.js'
import { ApiError } from '../errors.js'

export function mailConfigured() {
  return Boolean(config.resendApiKey && config.resendFrom)
}

const PRODUCT_IMAGE_CID = 'product-image'

// Mail clients block data: URLs, so an inline upload travels as a CID attachment.
// Site paths need the public address; a localhost one will not load in the inbox.
function emailImage(image) {
  const value = String(image || '').trim()
  if (!value) return { src: '', attachments: [] }
  const inline = value.match(/^data:image\/(png|jpe?g|gif|webp);base64,(.+)$/i)
  if (inline) {
    const extension = inline[1].toLowerCase() === 'jpeg' ? 'jpg' : inline[1].toLowerCase()
    return {
      src: `cid:${PRODUCT_IMAGE_CID}`,
      attachments: [{ filename: `product.${extension}`, content: inline[2], contentId: PRODUCT_IMAGE_CID }],
    }
  }
  if (/^https?:\/\//i.test(value)) return { src: value, attachments: [] }
  if (value.startsWith('/') && config.siteUrl) return { src: `${config.siteUrl}${value}`, attachments: [] }
  return { src: '', attachments: [] }
}

export async function sendQuoteReply({ to, name, reply, subject, kind, productName, productImage }) {
  if (!mailConfigured()) {
    throw new ApiError(424, 'The reply is saved. Add RESEND_API_KEY and RESEND_FROM, then send it again.')
  }
  const image = kind === 'product' ? emailImage(productImage) : { src: '', attachments: [] }
  const content = { name, reply, kind, productName, imageSrc: image.src }
  const resend = new Resend(config.resendApiKey)
  const { error } = await resend.emails.send({
    from: config.resendFrom,
    to,
    subject: `Re: ${subject}`,
    html: quoteReplyHtml(content),
    text: quoteReplyText(content),
    ...(image.attachments.length ? { attachments: image.attachments } : {}),
  })
  if (error) {
    console.error(error)
    throw new ApiError(424, 'The reply is saved. The email did not go out. Check the Resend key and from address, then send it again.')
  }
}

export async function sendContactMessage({ name, email, subject, message }) {
  if (!mailConfigured()) {
    throw new ApiError(424, 'Add RESEND_API_KEY and RESEND_FROM to the API environment, then try again.')
  }
  const content = { name, email, subject, message }
  const resend = new Resend(config.resendApiKey)
  const { error } = await resend.emails.send({
    from: config.resendFrom,
    to: config.contactInbox,
    replyTo: email,
    subject: `Contact: ${subject}`,
    html: contactMessageHtml(content),
    text: contactMessageText(content),
  })
  if (error) {
    console.error(error)
    throw new ApiError(424, 'The message is saved. The email did not go out. Check the Resend key and from address.')
  }
}

export async function sendAccountChangeEmail({ to, code, changes }) {
  if (!mailConfigured()) {
    throw new ApiError(424, 'Add RESEND_API_KEY and RESEND_FROM to the API environment, then try again.')
  }
  const resend = new Resend(config.resendApiKey)
  const { error } = await resend.emails.send({
    from: config.resendFrom,
    to,
    subject: 'Your Omegason admin verification code',
    html: accountChangeHtml({ code, changes }),
    text: accountChangeText({ code, changes }),
  })
  if (error) {
    console.error(error)
    throw new ApiError(424, 'The verification email could not be sent. Check the Resend key and from address, then try again.')
  }
}
