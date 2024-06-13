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
        const { username, sprint } = req.query

        if (username && sprint) {
          const userMessages = await services.getAllMessagesByUserName(
            parseName(username)
          )
          const sprintMessages = await services.getAllMessagesBySprintCode(
            parseSprintsCode(sprint)
          )
          const combinedMessages = userMessages.filter((message) =>
            sprintMessages.some(
              (sprintMessage) =>
                sprintMessage.sprintsCode === message.sprintsCode
            )
          )
          return combinedMessages
        }

        if (username) {
          return services.getAllMessagesByUserName(parseName(username))
        }

        if (sprint) {
          return services.getAllMessagesBySprintCode(parseSprintsCode(sprint))
        }

        return services.getAllMessages()
      })
    )
    .delete('/', unsupportedRoute)
    .patch('/', unsupportedRoute)
    .put('/', unsupportedRoute)

  return router
}
