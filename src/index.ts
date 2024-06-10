import 'dotenv/config'
import createApp from './app'
import createDatabase from './database'
import buildGiphy from './modules/giphyApi'
import buildDiscord from './modules/discord'

const { DATABASE_URL } = process.env
const PORT = 3000

if (!DATABASE_URL) {
  throw new Error('Provide DATABASE_URL in your environment variables.')
}

const database = createDatabase(DATABASE_URL)
const giphy = await buildGiphy('accomplishment')
const discord = await buildDiscord()
const app = createApp(database, discord, giphy)

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running at http://localhost:${PORT}`)
})
