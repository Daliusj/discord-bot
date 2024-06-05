import { Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import type { Database } from '@/database'
import { jsonRoute } from '@/utils/middleware'
import buildRespository from './repository'
import { TemplateNotFound } from './errors'
import * as schema from './schema'

export default (db: Database) => {
  const repository = buildRespository(db)
  const router = Router()

  router
    .post(
      '/',
      jsonRoute(async (req) => {
        const body = schema.parseInsertable(req.body)
        return repository.createNew(body)
      }, StatusCodes.CREATED)
    )
    .get(
      '/',
      jsonRoute(async () => {
        const records = await repository.findAll()
        return records
      })
    )
    .patch(
      '/:id',
      jsonRoute(async (req) => {
        const id = schema.parseId(req.params.id)
        const bodyPatch = schema.parseUpdatable(req.body)
        const record = await repository.update(id, bodyPatch)
        if (!record) {
          throw new TemplateNotFound()
        }
        return record
      })
    )
    .get(
      '/:id',
      jsonRoute(async (req) => {
        const id = schema.parseId(req.params.id)
        const record = await repository.findById(id)
        if (!record) {
          throw new TemplateNotFound()
        }
        return record
      })
    )
    .delete(
      '/:id',
      jsonRoute(async (req) => {
        const id = schema.parseId(req.params.id)
        const record = await repository.delete(id)
        if (!record) {
          throw new TemplateNotFound()
        }
        return record
      })
    )

  return router
}
