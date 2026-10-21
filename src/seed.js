import bcrypt from 'bcryptjs'
import { config } from './config.js'
import { starterCategories } from './data/catalogue.js'
import { sampleProducts } from './data/sampleProducts.js'
import { isEmail } from './lib/text.js'
import { seedStarterPhases } from './services/phases.js'
import { Admin, Category, Phase, Product, Setting } from './models.js'

export async function seed() {
  if ((await Admin.count()) === 0) {
    if (!isEmail(config.adminEmail) || config.adminPassword.length < 8) {
      throw new Error('Set ADMIN_EMAIL and a password of at least 8 characters in C:\\omegason-api\\.env before the first boot.')
    }
    await Admin.create({
      name: 'Omegason Admin',
      email: config.adminEmail,
      passwordHash: await bcrypt.hash(config.adminPassword, 10),
    })
    console.log(`Created admin ${config.adminEmail}`)
  }

  if ((await Category.count()) === 0) {
    await Category.bulkCreate(
      starterCategories.map((category, position) => ({
        id: category.id,
        label: category.label,
        position,
      })),
    )
  }

  const phasesSeeded = await Setting.findByPk('phasesSeeded')
  if (!phasesSeeded) {
    if ((await Phase.count()) === 0) await seedStarterPhases()
    await Setting.create({ key: 'phasesSeeded', value: '1' })
  }

  // Runs once. A sample the admin deletes later stays deleted, and an existing
  // product with the same address is never overwritten.
  const productsSeeded = await Setting.findByPk('productsSeeded')
  if (!productsSeeded) {
    const created = await seedSampleProducts()
    await Setting.create({ key: 'productsSeeded', value: '1' })
    if (created) console.log(`Seeded ${created} starter products`)
  }
}

async function seedSampleProducts() {
  const needed = [...new Set(sampleProducts.map((product) => product.categoryId))]
  const existing = new Set((await Category.findAll({ attributes: ['id'] })).map((category) => category.id))
  let position = Number.isFinite(await Category.max('position')) ? (await Category.max('position')) + 1 : 0
  for (const id of needed) {
    if (existing.has(id)) continue
    const starter = starterCategories.find((category) => category.id === id)
    await Category.create({ id, label: starter?.label || id, position: position++ })
  }

  const taken = new Set((await Product.findAll({ attributes: ['slug'] })).map((product) => product.slug))
  let created = 0
  // Oldest first, so the newest-first catalogue keeps the original order.
  for (const product of [...sampleProducts].reverse()) {
    if (taken.has(product.slug)) continue
    await Product.create(product)
    created += 1
  }
  return created
}
