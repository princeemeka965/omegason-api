import sanitizeHtml from 'sanitize-html'
import { plainText } from './text.js'

const TAGS = ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'h2', 'h3', 'ul', 'ol', 'li', 'a', 'blockquote']

const OPTIONS = {
  allowedTags: TAGS,
  allowedAttributes: { a: ['href', 'rel', 'target'] },
  allowedSchemes: ['http', 'https', 'mailto'],
  transformTags: {
    a: (tagName, attribs) => ({
      tagName: 'a',
      attribs: {
        href: attribs.href,
        rel: 'noopener noreferrer',
        target: '_blank',
      },
    }),
  },
}

export function sanitizeRichText(html) {
  const clean = sanitizeHtml(String(html || ''), OPTIONS).trim()
  if (!plainText(clean)) return ''
  return clean
}

// Blog posts also carry images placed in the editor. Only web links are kept, so a
// post cannot embed a data: payload or a javascript: source.
const ARTICLE_OPTIONS = {
  ...OPTIONS,
  allowedTags: [...TAGS, 'img'],
  allowedAttributes: { ...OPTIONS.allowedAttributes, img: ['src', 'alt'] },
  allowedSchemesByTag: { img: ['https', 'http'] },
  allowProtocolRelative: false,
  exclusiveFilter: (frame) => frame.tag === 'img' && !/^https?:\/\//i.test(frame.attribs.src || ''),
}

export function sanitizeArticle(html) {
  const clean = sanitizeHtml(String(html || ''), ARTICLE_OPTIONS).trim()
  if (!plainText(clean) && !/<img\s/i.test(clean)) return ''
  return clean
}

// Mail clients drop <style> blocks, so every tag carries its own inline style.
const EMAIL_STYLES = {
  p: 'margin:16px 0 0;font-size:15px;line-height:1.6;',
  h2: 'margin:24px 0 0;font-family:Georgia,serif;font-size:20px;line-height:1.3;color:#0b2545;',
  h3: 'margin:20px 0 0;font-family:Georgia,serif;font-size:17px;line-height:1.3;color:#0b2545;',
  ul: 'margin:16px 0 0;padding:0 0 0 22px;font-size:15px;line-height:1.6;',
  ol: 'margin:16px 0 0;padding:0 0 0 22px;font-size:15px;line-height:1.6;',
  li: 'margin:4px 0 0;',
  blockquote: 'margin:16px 0 0;padding:4px 0 4px 14px;border-left:3px solid #c4a574;color:#5c6775;',
  a: 'color:#0b2545;text-decoration:underline;',
}

export function emailRichText(html) {
  const transformTags = { ...OPTIONS.transformTags }
  const allowedAttributes = { ...OPTIONS.allowedAttributes }
  for (const [tag, style] of Object.entries(EMAIL_STYLES)) {
    const base = transformTags[tag]
    transformTags[tag] = (tagName, attribs) => {
      const next = base ? base(tagName, attribs) : { tagName, attribs }
      return { tagName: next.tagName, attribs: { ...next.attribs, style } }
    }
    allowedAttributes[tag] = [...(allowedAttributes[tag] || []), 'style']
  }
  return sanitizeHtml(String(html || ''), { ...OPTIONS, allowedAttributes, transformTags }).trim()
}

export function richTextToPlain(html) {
  return String(html || '')
    .replace(/<li[^>]*>/gi, '- ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|h2|h3|li|blockquote|ul|ol)>/gi, '\n')
    .replace(/<a [^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '$2 ($1)')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&amp;/gi, '&')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}
