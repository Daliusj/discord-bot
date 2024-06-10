import { Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import type { Database } from '@/database'
import { jsonRoute } from '@/utils/middleware'
import { MessageNotFound } from './errors'
import * as schema from './schema'
import buildServices from './services'
import { Discord } from '../discord'
import { Giphy } from '../giphyApi'
import { parseName } from '../users/schema'
import { parseSprintsCode } from '../sprints/schema'

export default (db: Database, discord: Discord, giphy: Giphy) => {
  const services = buildServices(db, discord, giphy)
  const router = Router()

  router
    .post(
      '/',
      jsonRoute(async (req) => {
        const name = parseName(req.body.name)
        const sprintsCode = parseSprintsCode(req.body.sprintsCode)
        return services.createMessage(name, sprintsCode)
      }, StatusCodes.CREATED)
    )
    .get(
      '/',
      jsonRoute(async (req) => {
        console.log(req.query)
        const name = parseName(req.query.name)
        if (name) return services.getAllMessagesByUserName(name)
        const sprintsCode = parseSprintsCode(req.query.sprint)
        if (sprintsCode) return services.getAllMessagesBySprintCode(sprintsCode)
        return services.getAllMessages()
      })
    )
  return router
}
