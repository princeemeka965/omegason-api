function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

import { emailRichText, richTextToPlain } from '../lib/html.js'

function intro({ kind, productName }) {
  if (kind === 'product' && productName) return `Here is our reply to your quote request for ${productName}.`
  if (kind === 'product') return 'Here is our reply to your quote request.'
  if (kind === 'general') return 'Here is our reply to your message.'
  return 'Here is our reply to your solar sizing request.'
}

function labelFor(kind) {
  if (kind === 'product') return 'Quote request'
  if (kind === 'general') return 'Contact'
  return 'Solar sizing'
}

export function quoteReplyText({ name, reply, kind, productName }) {
  return [
    'Omegason Integrated Energy Services',
    '',
    `Hello ${name},`,
    '',
    intro({ kind, productName }),
    '',
    richTextToPlain(reply),
    '',
    'You can also call +234 806 249 8123.',
  ].join('\n')
}

export function quoteReplyHtml({ name, reply, kind, productName, imageSrc }) {
  const body = emailRichText(reply)
  const label = labelFor(kind)
  const product = kind === 'product' && imageSrc
    ? `<div style="margin:20px 0 0;border:1px solid #e3e7ee;">
                  <img src="${escapeHtml(imageSrc)}" alt="${escapeHtml(productName || 'Product')}" width="462" style="display:block;width:100%;max-width:462px;height:auto;border:0;">
                  ${productName ? `<p style="margin:0;padding:10px 14px;font-size:14px;font-weight:bold;color:#0b2545;">${escapeHtml(productName)}</p>` : ''}
                </div>`
    : ''
  return `<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:0;background:#f4f6f8;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f6f8;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;background:#ffffff;border:1px solid #e3e7ee;">
            <tr>
              <td style="background:#0b2545;padding:22px 28px;">
                <p style="margin:0;font-family:Georgia,serif;font-size:20px;color:#ffffff;">Omegason</p>
                <p style="margin:4px 0 0;font-family:Arial,sans-serif;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#c4a574;">${label}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;font-family:Arial,sans-serif;color:#1c2430;">
                <h1 style="margin:0;font-family:Georgia,serif;font-size:24px;line-height:1.3;color:#0b2545;">Hello ${escapeHtml(name)},</h1>
                <p style="margin:16px 0 0;font-size:15px;line-height:1.6;">${escapeHtml(intro({ kind, productName }))}</p>
                ${product}
                ${body}
                <p style="margin:24px 0 0;font-size:14px;line-height:1.6;color:#5c6775;">You can also call +234 806 249 8123.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}
