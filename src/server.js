import { createApp } from './app.js'
import { config } from './config.js'
import { sequelize } from './db.js'
import './models.js'
import { seed } from './seed.js'

await sequelize.sync()
await sequelize.query(`ALTER TABLE admins ADD COLUMN IF NOT EXISTS name VARCHAR(120) NOT NULL DEFAULT ''`)
await sequelize.query(`ALTER TABLE account_changes ADD COLUMN IF NOT EXISTS "quotesEmail" VARCHAR(160)`)
await sequelize.query(`ALTER TABLE quotes ADD COLUMN IF NOT EXISTS phone VARCHAR(40) NOT NULL DEFAULT ''`)
await sequelize.query(`ALTER TABLE quotes ADD COLUMN IF NOT EXISTS state VARCHAR(80) NOT NULL DEFAULT ''`)
await sequelize.query(`ALTER TABLE quotes ADD COLUMN IF NOT EXISTS kind VARCHAR(20) NOT NULL DEFAULT 'general'`)
await sequelize.query(`ALTER TABLE quotes ADD COLUMN IF NOT EXISTS reply TEXT`)
await sequelize.query(`ALTER TABLE quotes ADD COLUMN IF NOT EXISTS "repliedAt" TIMESTAMPTZ`)
await sequelize.query(`ALTER TABLE quotes ADD COLUMN IF NOT EXISTS "productImage" TEXT`)
await sequelize.query(`UPDATE quotes SET kind = 'product' WHERE kind = 'general' AND "productSlug" <> ''`)
await sequelize.query(`UPDATE quotes SET kind = 'sizing' WHERE "productName" = 'Home solar sizing' OR subject LIKE 'Solar sizing:%'`)
await seed()

const app = createApp()
app.listen(config.port, '0.0.0.0', () => {
  console.log(`Omegason API listening on http://localhost:${config.port}`)
})
