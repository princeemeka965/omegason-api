import pg from 'pg'
import { Sequelize } from 'sequelize'
import { config } from './config.js'

// Supabase requires SSL. Use the direct connection or the session pooler
// (port 5432). The transaction pooler on port 6543 breaks Sequelize.
export const sequelize = new Sequelize(config.databaseUrl, {
  dialect: 'postgres',
  dialectModule: pg,
  logging: false,
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false },
  },
  pool: { max: 5 },
})
