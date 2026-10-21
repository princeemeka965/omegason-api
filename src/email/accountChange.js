function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function changeLines({ name, email, password, quotesEmail }) {
  const lines = []
  if (name) lines.push(`Name will be set to ${name}.`)
  if (email) lines.push(`The sign-in email will change to ${email}.`)
  if (password) lines.push('The password will be replaced.')
  if (quotesEmail === '') lines.push('The quotes inbox will be cleared.')
  else if (quotesEmail) lines.push(`Quote requests will be addressed to ${quotesEmail}.`)
  return lines
}

export function accountChangeText({ code, changes }) {
  const lines = changeLines(changes)
  const summary = lines.length ? `\n\nRequested changes:\n${lines.map((line) => `- ${line}`).join('\n')}` : ''
  return [
    'Omegason Integrated Energy Services',
    '',
    'Confirm your admin account changes',
    '',
    'Use this verification code to apply the changes. It was sent to this inbox, the address already on the account. A new email address receives nothing until this code is entered.',
    '',
    code,
    '',
    'This code expires in 10 minutes.',
    summary,
    '',
    'If you did not ask for this, ignore the email. Nothing changes until the code is entered.',
  ].join('\n')
}

export function accountChangeHtml({ code, changes }) {
  const lines = changeLines(changes)
    .map((line) => `<li style="margin:0 0 6px;">${escapeHtml(line)}</li>`)
    .join('')
  const summary = lines
    ? `<p style="margin:24px 0 8px;font-size:14px;font-weight:700;color:#0b2545;">Requested changes</p><ul style="margin:0;padding:0 0 0 18px;font-size:15px;line-height:1.5;color:#1c2430;">${lines}</ul>`
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
                <p style="margin:4px 0 0;font-family:Arial,sans-serif;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#c4a574;">Admin verification</p>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;font-family:Arial,sans-serif;color:#1c2430;">
                <h1 style="margin:0;font-family:Georgia,serif;font-size:24px;line-height:1.3;color:#0b2545;">Confirm your admin account changes</h1>
                <p style="margin:16px 0 0;font-size:15px;line-height:1.6;">Use this verification code to apply the changes. It was sent to this inbox, the address already on the account. A new email address receives nothing until this code is entered.</p>
                <p style="margin:24px 0 0;padding:16px;background:#f4f6f8;border-left:4px solid #8d6232;font-family:Consolas,monospace;font-size:32px;letter-spacing:0.28em;color:#0b2545;">${escapeHtml(code)}</p>
                <p style="margin:16px 0 0;font-size:14px;line-height:1.5;color:#5c6775;">This code expires in 10 minutes.</p>
                ${summary}
                <p style="margin:24px 0 0;font-size:14px;line-height:1.6;color:#5c6775;">If you did not ask for this, ignore the email. Nothing changes until the code is entered.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}
