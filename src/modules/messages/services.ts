import type { Database } from '@/database'
import type { Discord } from '../discord'
import type { Giphy } from '../giphyApi'
import messagesRepository from './repository'
import sprintsRepository from '../sprints/repository'
import templatesRepository from '../templates/repository'
import gifsRepository from '../gifs/repository'
import usersRepository from '../users/repository'
import { searchExpressionFactory as usersSearchExpressionFactory } from '../users/utils'
import { searchExpressionFactory as sprintsSearchExpressionFactory } from '../sprints/utils'
import NotFound from '@/utils/errors/NotFound'
import ExternalApiError from '@/utils/errors/ExternalApiError'
import joinedRepositories from '@/joinedRepositories'

export default async (db: Database, discord: Discord, giphy: Giphy) => {
  const messages = messagesRepository(db)
  const sprints = sprintsRepository(db)
  const templates = templatesRepository(db)
  const gifs = gifsRepository(db)
  const users = usersRepository(db)
  const allRepositories = joinedRepositories(db)

  const createMessage = async (name: string, sprintsCode: string) => {
    const getUser = async () => {
      const findUserExpression = usersSearchExpressionFactory()
      const [user] = await users.find(findUserExpression.findByName(name))
      return user || (await users.createNew({ name }))
    }

    const getSprint = async () => {
      const findSprintExpression = sprintsSearchExpressionFactory()
      const [sprint] = await sprints.find(
        findSprintExpression.findBySprintCode(sprintsCode)
      )
      if (!sprint) throw new NotFound('Sprint not found')
      return sprint
    }

    const getRandomTemplate = async () => {
      const allTemplates = await templates.findAll()
      if (!allTemplates.length) throw new NotFound('No templates found')
      return allTemplates[Math.floor(Math.random() * allTemplates.length)]
    }

    const createDbRecord = async (
      sprintId: number,
      templateId: number,
      userId: number,
      url: string
    ) => {
      const gifRecord = await gifs.createNew({ url })
      if (!gifRecord) {
        throw new Error('Failed to create Gif record')
      }
      const messagesRecord = await messages.createNew({
        gifId: gifRecord?.id!,
        sprintId,
        templateId,
        userId,
      })
      if (!messagesRecord) {
        throw new Error('Failed to create message record')
      }
      return messagesRecord
    }

    const getGifUrl = async () => {
      try {
        const gifUrl = await giphy.getGifUrl()
        return gifUrl
      } catch (err) {
        throw new ExternalApiError(
          `Error fetching From Giphy, ${err instanceof Error ? err.message : 'Unknown error'}`
        )
      }
    }

    const sendDiscordMessage = async (text: string, gifUrl: string) => {
      try {
        await discord.sendMessage(text, gifUrl)
      } catch (err) {
        throw new ExternalApiError(
          `Error sending Discrod message , ${err instanceof Error ? err.message : 'Unknown error'}`
        )
      }
    }

    try {
      const url = await getGifUrl()
      const user = await getUser()
      const sprint = await getSprint()
      const template = await getRandomTemplate()
      await createDbRecord(sprint.id, template.id, user.id, url)
      await sendDiscordMessage(template.text, url)

      return {
        name: user.name,
        sprintsCode: sprint.sprintsCode,
        title: sprint.title,
        text: template.text,
        url,
      }
    } catch (err) {
      throw new Error(
        `Error creating message: ${err instanceof Error ? err.message : 'Unknown error'}`
      )
    }
  }

  const getAllMessages = async () => {
    const records = await allRepositories.findAll()
    return records
  }

  const getAllMessagesByUserName = async (name: string) => {
    const records = await allRepositories.findByUserName(name)
    return records
  }

  const getAllMessagesBySprintCode = async (sprintsCode: string) => {
    const records = await allRepositories.findBySprintCode(sprintsCode)
    return records
  }

  return {
    createMessage,
    getAllMessages,
    getAllMessagesBySprintCode,
    getAllMessagesByUserName,
  }
}
