import { ApiError } from '../errors.js'
import { richTextToPlain, sanitizeArticle } from '../lib/html.js'
import { plainText, slugify } from '../lib/text.js'
import { Post } from '../models.js'
import { presentPost } from '../present.js'
import { imageValue } from './catalogue.js'

const BODY_TEXT_LIMIT = 60000
const BODY_HTML_LIMIT = 300000

const newestFirst = [
  ['publishedAt', 'DESC'],
  ['createdAt', 'DESC'],
]

export async function listPosts() {
  const rows = await Post.findAll({ order: [['updatedAt', 'DESC']] })
  return rows.map((row) => presentPost(row, { body: false }))
}

export async function getPost(id) {
  const post = await Post.findByPk(id)
  if (!post) throw new ApiError(404, 'That post was not found.')
  return presentPost(post)
}

export async function listPublicPosts() {
  const rows = await Post.findAll({ where: { published: true }, order: newestFirst })
  return rows.map((row) => presentPost(row, { body: false }))
}

export async function getPublicPost(slug) {
  const post = await Post.findOne({ where: { slug: String(slug || ''), published: true } })
  if (!post) throw new ApiError(404, 'That post was not found.')
  return presentPost(post)
}

async function uniqueSlug(value, ignoreId) {
  const base = slugify(value) || `post-${Date.now()}`
  let slug = base
  let n = 2
  while (true) {
    const taken = await Post.findOne({ where: { slug }, attributes: ['id'] })
    if (!taken || taken.id === ignoreId) return slug
    slug = `${base}-${n++}`.slice(0, 120)
  }
}

function postInput(input) {
  const title = String(input.title || '').trim()
  if (!title) throw new ApiError(400, 'Enter a title.')
  if (title.length > 160) throw new ApiError(400, 'Keep the title to 160 characters.')
  const body = sanitizeArticle(input.body)
  if (!body) throw new ApiError(400, 'Write the post.')
  if (plainText(body).length > BODY_TEXT_LIMIT || body.length > BODY_HTML_LIMIT) {
    throw new ApiError(400, 'The post is too long. Split it into two posts.')
  }
  let excerpt = String(input.excerpt || '').trim()
  if (excerpt.length > 300) throw new ApiError(400, 'Keep the summary to 300 characters.')
  if (!excerpt) {
    const paragraphs = body.match(/<p>[\s\S]*?<\/p>/g) || [body]
    const text = paragraphs.map((part) => richTextToPlain(part)).join(' ').replace(/\s+/g, ' ').trim()
    excerpt = text.length > 200 ? `${text.slice(0, 197).trimEnd()}…` : text
  }
  return {
    title,
    excerpt,
    body,
    coverImage: imageValue(input.coverImage),
    published: Boolean(input.published),
  }
}

export async function savePost(input, id) {
  const current = id ? await Post.findByPk(id) : null
  if (id && !current) throw new ApiError(404, 'That post was not found.')
  const next = postInput(input)
  const row = current || Post.build()
  Object.assign(row, next, { slug: await uniqueSlug(input.slug || next.title, current?.id) })
  if (next.published && !row.publishedAt) row.publishedAt = new Date()
  await row.save()
  return presentPost(row)
}

export async function deletePost(id) {
  const post = await Post.findByPk(id)
  if (!post) throw new ApiError(404, 'That post was not found.')
  await post.destroy()
}
