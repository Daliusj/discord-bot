import { Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import type { Database } from '@/database'
import { jsonRoute, unsupportedRoute } from '@/utils/middleware'
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
        if (req.query.username)
          return services.getAllMessagesByUserName(
            parseName(req.query.username)
          )
        if (req.query.sprint)
          return services.getAllMessagesBySprintCode(
            parseSprintsCode(req.query.sprint)
          )
        return services.getAllMessages()
      })
    )
    .delete('/', unsupportedRoute)
    .patch('/', unsupportedRoute)
    .put('/', unsupportedRoute)

  return router
}
