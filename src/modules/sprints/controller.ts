import { Router } from 'express'
import type { Database } from '@/database'
import { jsonRoute } from '@/utils/middleware'
import buildRespository from './repository'
import * as schema from './schema'

export default (db: Database) => {
  const messages = buildRespository(db)
  const router = Router()

  router.post(
    '/',
    jsonRoute(async (req, res) => {
      const body = schema.parseInsertables(req.body)
      const sprints = await messages.insertNew(body)
      res.status(200)
      res.json(sprints)
    })
  )

  return router
}
