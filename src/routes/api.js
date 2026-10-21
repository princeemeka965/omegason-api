import express, { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { COOKIE, clearSessionCookie, requireAdmin, setSessionCookie } from '../middleware/auth.js'
import { cancelAccountChange, confirmAccountChange, getAccount, requestAccountChange } from '../services/account.js'
import { readSession, signIn } from '../services/auth.js'
import {
  createCategory,
  deleteCategory,
  deleteProduct,
  listCategories,
  listProducts,
  listPublicProducts,
  renameCategory,
  saveProduct,
} from '../services/catalogue.js'
import {
  deletePhase,
  deleteStory,
  listPublicPhases,
  listPhases,
  movePhase,
  moveStory,
  savePhase,
  saveStory,
} from '../services/phases.js'
import { uploadImage } from '../services/cloudinary.js'
import { deletePost, getPost, getPublicPost, listPosts, listPublicPosts, savePost } from '../services/posts.js'
import { addQuote, deleteQuote, getSettings, listQuotes, markQuoteRead, replyToQuote } from '../services/quotes.js'

const authLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts. Wait a few minutes and try again.' },
})

const replyLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many replies. Wait a few minutes and try again.' },
})

const uploadLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many image uploads. Wait a few minutes and try again.' },
})

const imageBody = express.raw({ type: () => true, limit: '8mb' })

const quoteLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many quote requests. Wait a few minutes and try again.' },
})

export const api = Router()

api.get('/health', (_req, res) => {
  res.json({ ok: true })
})

// Everything the public website shows, in one request on page load. Only published
// content: quotes, settings and drafts stay behind /admin/bootstrap.
api.get('/site', async (_req, res) => {
  const [categories, products, phases, posts] = await Promise.all([
    listCategories(),
    listPublicProducts(),
    listPublicPhases(),
    listPublicPosts(),
  ])
  res.json({ categories, products, phases, posts })
})

api.get('/catalog', async (_req, res) => {
  const [categories, products] = await Promise.all([listCategories(), listPublicProducts()])
  res.json({ categories, products })
})

api.get('/phases', async (_req, res) => {
  res.json({ phases: await listPublicPhases() })
})

api.get('/posts', async (_req, res) => {
  res.json({ posts: await listPublicPosts() })
})

api.get('/posts/:slug', async (req, res) => {
  res.json(await getPublicPost(req.params.slug))
})

api.post('/auth/login', authLimit, async (req, res) => {
  const result = await signIn(req.body || {})
  setSessionCookie(res, result.token, result.maxAge)
  res.json(result.session)
})

api.post('/auth/logout', (req, res) => {
  clearSessionCookie(res)
  res.json({ ok: true })
})

api.get('/auth/session', (req, res) => {
  const session = readSession(req.cookies?.[COOKIE])
  if (!session) {
    res.status(401).json({ error: 'Sign in to continue.' })
    return
  }
  res.json({ email: session.email, signedInAt: session.signedInAt })
})

api.get('/admin/bootstrap', requireAdmin, async (req, res) => {
  const [categories, products, quotes, settings, account, phases, posts] = await Promise.all([
    listCategories(),
    listProducts(),
    listQuotes(),
    getSettings(),
    getAccount(req.admin.id),
    listPhases(),
    listPosts(),
  ])
  res.json({ categories, products, quotes, settings, account, phases, posts })
})

api.get('/admin/posts/:id', requireAdmin, async (req, res) => {
  res.json(await getPost(req.params.id))
})

api.post('/admin/posts', requireAdmin, async (req, res) => {
  res.status(201).json(await savePost(req.body || {}))
})

api.put('/admin/posts/:id', requireAdmin, async (req, res) => {
  res.json(await savePost(req.body || {}, req.params.id))
})

api.delete('/admin/posts/:id', requireAdmin, async (req, res) => {
  await deletePost(req.params.id)
  res.json({ ok: true })
})

api.post('/categories', requireAdmin, async (req, res) => {
  res.status(201).json(await createCategory(req.body?.label))
})

api.patch('/categories/:id', requireAdmin, async (req, res) => {
  res.json(await renameCategory(req.params.id, req.body?.label))
})

api.delete('/categories/:id', requireAdmin, async (req, res) => {
  await deleteCategory(req.params.id)
  res.json({ ok: true })
})

api.post('/phases', requireAdmin, async (req, res) => {
  res.status(201).json(await savePhase(req.body || {}))
})

api.put('/phases/:id', requireAdmin, async (req, res) => {
  res.json(await savePhase(req.body || {}, req.params.id))
})

api.delete('/phases/:id', requireAdmin, async (req, res) => {
  await deletePhase(req.params.id)
  res.json({ ok: true })
})

api.post('/phases/:id/move', requireAdmin, async (req, res) => {
  res.json(await movePhase(req.params.id, req.body || {}))
})

api.post('/phases/:id/stories', requireAdmin, async (req, res) => {
  res.status(201).json(await saveStory(req.body || {}, { phaseId: req.params.id }))
})

api.put('/stories/:id', requireAdmin, async (req, res) => {
  res.json(await saveStory(req.body || {}, { id: req.params.id }))
})

api.delete('/stories/:id', requireAdmin, async (req, res) => {
  res.json(await deleteStory(req.params.id))
})

api.post('/stories/:id/move', requireAdmin, async (req, res) => {
  res.json(await moveStory(req.params.id, req.body || {}))
})

api.post('/uploads', requireAdmin, uploadLimit, (req, res, next) => {
  imageBody(req, res, (err) => {
    if (!err) return next()
    err.status = err.status || 413
    if (err.status === 413) err.message = 'Use an image under 8 MB.'
    next(err)
  })
}, async (req, res) => {
  const mime = String(req.headers['content-type'] || '').split(';')[0].trim().toLowerCase()
  res.status(201).json(await uploadImage(req.body, mime))
})

api.post('/products', requireAdmin, async (req, res) => {
  res.status(201).json(await saveProduct(req.body || {}))
})

api.put('/products/:id', requireAdmin, async (req, res) => {
  res.json(await saveProduct(req.body || {}, req.params.id))
})

api.delete('/products/:id', requireAdmin, async (req, res) => {
  await deleteProduct(req.params.id)
  res.json({ ok: true })
})

api.get('/quotes', requireAdmin, async (_req, res) => {
  res.json(await listQuotes())
})

api.post('/quotes', quoteLimit, async (req, res) => {
  res.status(201).json(await addQuote(req.body || {}))
})

api.patch('/quotes/:id', requireAdmin, async (req, res) => {
  res.json(await markQuoteRead(req.params.id))
})

api.post('/quotes/:id/reply', requireAdmin, replyLimit, async (req, res) => {
  res.json(await replyToQuote(req.params.id, req.body || {}))
})

api.delete('/quotes/:id', requireAdmin, async (req, res) => {
  await deleteQuote(req.params.id)
  res.json({ ok: true })
})

api.post('/settings/account', requireAdmin, authLimit, async (req, res) => {
  res.json(await requestAccountChange(req.admin.id, req.body || {}))
})

api.post('/settings/account/verify', requireAdmin, authLimit, async (req, res) => {
  const result = await confirmAccountChange(req.admin.id, req.body?.code)
  setSessionCookie(res, result.token, result.maxAge)
  res.json({ name: result.name, email: result.email })
})

api.delete('/settings/account/otp', requireAdmin, async (req, res) => {
  await cancelAccountChange(req.admin.id)
  res.json({ ok: true })
})
