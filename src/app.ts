import express from 'express'
import jsonErrorHandler from './middleware/jsonErrors'
import { type Database } from './database'
import sprints from '@/modules/sprints/controller'
import templates from '@/modules/templates/controller'
import users from '@/modules/users/controller'
import gifs from '@/modules/gifs/controller'
import { Discord } from './modules/discord'
import { Giphy } from './modules/giphyApi'
import messages from '@/modules/messages/controller'

export default function createApp(
  db: Database,
  discord: Discord,
  giphy: Giphy
) {
  const app = express()

  app.use(express.json())

  app.use('/sprints', sprints(db))
  app.use('/templates', templates(db))
  app.use('/messages', messages(db, discord, giphy))
  app.use('/users', users())
  app.use('/gifs', gifs())

  app.use(jsonErrorHandler)

  return app
}
