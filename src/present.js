import { iso, plainText } from './lib/text.js'

export function presentCategory(row) {
  return {
    id: row.id,
    label: row.label,
    createdAt: iso(row.createdAt),
  }
}

export function presentProduct(row) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.categoryId,
    summary: row.summary,
    descriptionHtml: row.descriptionHtml,
    specificationsHtml: row.specificationsHtml,
    price: row.price == null ? null : Number(row.price),
    image: row.image || null,
    featured: Boolean(row.featured),
    createdAt: iso(row.createdAt),
    updatedAt: iso(row.updatedAt),
  }
}

export function presentPublicProduct(row) {
  const product = presentProduct(row)
  return {
    ...product,
    description: plainText(product.descriptionHtml),
  }
}

export function presentStory(row) {
  const body = row.body || ''
  const paragraphs = body
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean)
  return {
    id: row.id,
    title: row.title,
    summary: row.summary,
    body,
    paragraphs,
    image: row.image || null,
    featured: Boolean(row.featured),
    position: row.position,
  }
}

export function presentPhase(row, stories = []) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    headline: row.headline,
    lead: row.lead,
    published: row.published !== false,
    position: row.position,
    stories: stories.map(presentStory),
  }
}

function readingMinutes(html) {
  const words = plainText(html).split(' ').filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

export function presentPost(row, { body = true } = {}) {
  const post = {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    coverImage: row.coverImage || null,
    published: Boolean(row.published),
    publishedAt: row.publishedAt ? iso(row.publishedAt) : null,
    readingMinutes: readingMinutes(row.body),
    createdAt: iso(row.createdAt),
    updatedAt: iso(row.updatedAt),
  }
  if (body) post.body = row.body
  return post
}

export function presentQuote(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone || '',
    state: row.state || '',
    subject: row.subject,
    message: row.message,
    productSlug: row.productSlug || '',
    productName: row.productName || '',
    productImage: row.productImage || null,
    kind: row.kind || 'general',
    createdAt: iso(row.createdAt),
    read: Boolean(row.read),
    destinationEmail: row.destinationEmail || null,
    reply: row.reply || '',
    repliedAt: row.repliedAt ? iso(row.repliedAt) : null,
  }
}
