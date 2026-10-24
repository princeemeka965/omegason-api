function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function contactMessageText({ name, email, subject, message }) {
  return [
    'Omegason Integrated Energy Services',
    '',
    'New message from the contact form',
    '',
    `From: ${name} <${email}>`,
    `Subject: ${subject}`,
    '',
    message,
    '',
    'Reply to this email to answer them.',
  ].join('\n')
}

export function contactMessageHtml({ name, email, subject, message }) {
  const body = escapeHtml(message).replace(/\n/g, '<br>')
  return `<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:24px;background:#f4f6f8;font-family:Georgia,serif;color:#0b2545;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e3e7ee;">
      <tr>
        <td style="padding:28px 32px;">
          <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#8a7349;">Contact form</p>
          <h1 style="margin:8px 0 0;font-size:24px;line-height:1.3;">New message</h1>
          <p style="margin:20px 0 0;font-family:Arial,sans-serif;font-size:14px;line-height:1.5;"><strong>${escapeHtml(name)}</strong><br>${escapeHtml(email)}</p>
          <p style="margin:16px 0 0;font-family:Arial,sans-serif;font-size:14px;line-height:1.5;"><strong>Subject</strong><br>${escapeHtml(subject)}</p>
          <p style="margin:16px 0 0;font-family:Arial,sans-serif;font-size:15px;line-height:1.6;">${body}</p>
          <p style="margin:24px 0 0;font-family:Arial,sans-serif;font-size:13px;line-height:1.5;color:#5c6775;">Reply to this email to answer them.</p>
        </td>
      </tr>
    </table>
  </body>
</html>`
}
