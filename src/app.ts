import express from 'express'
import jsonErrorHandler from './middleware/jsonErrors'
import { type Database } from './database'
import sprints from '@/modules/sprints/controller'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function createApp(db: Database) {
  const app = express()

  app.use(express.json())

  app.use(sprints)

  app.use(jsonErrorHandler)

  return app
}
