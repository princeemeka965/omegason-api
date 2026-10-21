import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { config } from './config.js'
import { errorHandler, notFound } from './middleware/errors.js'
import { api } from './routes/api.js'

export function createApp() {
  const app = express()
  app.disable('x-powered-by')
  app.set('trust proxy', 1)
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
  app.use(cors({ origin: config.clientOrigins, credentials: true }))
  app.use(express.json({ limit: '2mb' }))
  app.use(cookieParser())
  app.use('/api', api)
  app.use(notFound)
  app.use(errorHandler)
  return app
}
