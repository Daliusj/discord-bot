import { Router } from 'express'
import type { Database } from '@/database'
import { jsonRoute } from '@/utils/middleware'
import buildRespository from './repository'
// import * as schema from './schema'

export default (db: Database) => {
  const repository = buildRespository(db)
  const router = Router()

  router
    .post(
      '/',
      jsonRoute(async (req, res) => {
        // const body = schema.parseInsertables(req.body)
        const record = await repository.insertNew(req.body)
        res.status(200)
        res.json(record)
      })
    )
    .get(
      '/',
      jsonRoute(async (req, res) => {
        const records = await repository.findAll()
        res.status(200)
        res.json(records)
      })
    )
    .patch(
      '/:id',
      jsonRoute(async (req, res) => {
        const record = await repository.update(Number(req.params.id), req.body)
        res.status(200)
        res.json(record)
      })
    )
    .get(
      '/:id',
      jsonRoute(async (req, res) => {
        const record = await repository.findById(Number(req.params.id))
        res.status(200)
        res.json(record)
      })
    )
    .delete(
      '/:id',
      jsonRoute(async (req, res) => {
        const record = await repository.delete(Number(req.params.id))
        res.status(200)
        res.json(record)
      })
    )

  return router
}
