import { starterCategories } from '../data/catalogue.js'
import { ApiError } from '../errors.js'
import { sanitizeRichText } from '../lib/html.js'
import { plainText, slugify } from '../lib/text.js'
import { Category, Product } from '../models.js'
import { presentCategory, presentProduct, presentPublicProduct } from '../present.js'

const IMAGE_LIMIT = 1_200_000

async function nextPosition() {
  const max = await Category.max('position')
  return Number.isFinite(max) ? max + 1 : 0
}

export async function listCategories() {
  const rows = await Category.findAll({ order: [['position', 'ASC'], ['createdAt', 'ASC']] })
  return rows.map(presentCategory)
}

export async function createCategory(label) {
  const name = String(label || '').trim()
  if (!name) throw new ApiError(400, 'Enter a category name.')
  const existing = await Category.findAll()
  if (existing.some((category) => category.label.toLowerCase() === name.toLowerCase())) {
    throw new ApiError(400, 'A category with that name already exists.')
  }
  const slug = slugify(name)
  const starter = starterCategories.find(
    (category) => category.id === slug || category.label.toLowerCase() === name.toLowerCase(),
  )
  let id = starter && !existing.some((category) => category.id === starter.id) ? starter.id : slug || `category-${Date.now()}`
  const base = id
  let n = 2
  while (existing.some((category) => category.id === id)) id = `${base}-${n++}`
  const category = await Category.create({ id, label: name, position: await nextPosition() })
  return presentCategory(category)
}

export async function renameCategory(id, label) {
  const name = String(label || '').trim()
  if (!name) throw new ApiError(400, 'Enter a category name.')
  const category = await Category.findByPk(id)
  if (!category) throw new ApiError(404, 'That category was not found.')
  const all = await Category.findAll()
  if (all.some((item) => item.id !== id && item.label.toLowerCase() === name.toLowerCase())) {
    throw new ApiError(400, 'A category with that name already exists.')
  }
  category.label = name
  await category.save()
  return presentCategory(category)
}

export async function deleteCategory(id) {
  const category = await Category.findByPk(id)
  if (!category) throw new ApiError(404, 'That category was not found.')
  const used = await Product.count({ where: { categoryId: id } })
  if (used > 0) throw new ApiError(400, 'Move or delete the products in this category first.')
  await category.destroy()
}

export function imageValue(image) {
  if (image == null || String(image).trim() === '') return null
  const value = String(image).trim()
  if (value.length > IMAGE_LIMIT) throw new ApiError(400, 'That image is too large.')
  const ok = value.startsWith('/') || value.startsWith('data:image/') || /^https?:\/\//i.test(value)
  if (!ok) throw new ApiError(400, 'Use an image path starting with /, an https link, or upload a file.')
  return value
}

function priceValue(price) {
  if (price == null || price === '') return null
  const number = Number(price)
  if (!Number.isInteger(number) || number <= 0) {
    throw new ApiError(400, 'Enter a price in naira, or mark the product as price on request.')
  }
  return number
}

async function assertSlugAvailable(slug, ignoreId) {
  const taken = await Product.findOne({ where: { slug } })
  if (taken && taken.id !== ignoreId) throw new ApiError(400, 'Another product already uses that address.')
}

function productInput(input) {
  const name = String(input.name || '').trim()
  const summary = String(input.summary || '').trim()
  const slug = slugify(input.slug || name)
  const categoryId = String(input.category || '')
  const descriptionHtml = sanitizeRichText(input.descriptionHtml)
  const specificationsHtml = sanitizeRichText(input.specificationsHtml)
  if (!name) throw new ApiError(400, 'Enter a product name.')
  if (!slug) throw new ApiError(400, 'Enter a web address slug.')
  if (!summary) throw new ApiError(400, 'Enter a short summary.')
  if (summary.length > 180) throw new ApiError(400, 'Keep the summary to 180 characters.')
  if (!plainText(descriptionHtml)) throw new ApiError(400, 'Add a description.')
  return {
    name,
    summary,
    slug,
    categoryId,
    descriptionHtml,
    specificationsHtml,
    price: priceValue(input.price),
    image: imageValue(input.image),
    featured: Boolean(input.featured),
  }
}

export async function listProducts() {
  const rows = await Product.findAll({ order: [['updatedAt', 'DESC']] })
  return rows.map(presentProduct)
}

export async function listPublicProducts() {
  const rows = await Product.findAll({ order: [['updatedAt', 'DESC']] })
  return rows.map(presentPublicProduct)
}

export async function saveProduct(input, id) {
  const current = id ? await Product.findByPk(id) : null
  if (id && !current) throw new ApiError(404, 'That product was not found.')
  const next = productInput(input)
  const category = await Category.findByPk(next.categoryId)
  if (!category) throw new ApiError(400, 'Choose a category.')
  await assertSlugAvailable(next.slug, current?.id)
  const row = current ? current : Product.build()
  Object.assign(row, next)
  await row.save()
  return presentProduct(row)
}

export async function deleteProduct(id) {
  const product = await Product.findByPk(id)
  if (!product) throw new ApiError(404, 'That product was not found.')
  await product.destroy()
}
