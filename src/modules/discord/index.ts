import { Client, GatewayIntentBits, Message } from 'discord.js'

type SendMessage = (
  template: string,
  userName: string,
  title: string,
  gifUrl: string
) => Promise<Message<true> | Message<false>>

export type Discord = {
  sendMessage: SendMessage
}

const TOKEN = process.env.DISCORD_BOT_TOKEN
if (!TOKEN) {
  throw new Error('Discord Token is not defined in the environment variables.')
}

const CHANNEL_ID = process.env.DISCORD_CHANNEL_ID
if (!CHANNEL_ID) {
  throw new Error(
    'Discord channel id is not defined in the environment variables.'
  )
}

export default async (): Promise<Discord> => {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  })

  const sendMessage: SendMessage = async (
    template,
    userName,
    title,
    gifUrl
  ) => {
    const getMessage = () =>
      `${userName} has just completed ${title}!\n${template} \n${gifUrl}`

    try {
      const channel = await client.channels.fetch(CHANNEL_ID)
      if (channel?.isTextBased()) {
        const message = await channel.send({
          content: getMessage(),
        })
        console.log('Messege sent')
        return message
      }
      throw new Error('The specified discord channel is not a text channel.')
    } catch (err) {
      throw new Error(
        `Failed to send message:, ${err instanceof Error ? err.message : 'An unknow error occured'}`
      )
    }
  }

  await client.login(TOKEN)
  client.once('ready', () => {
    console.log(`Logged in as ${client.user?.tag}!`)
  })

  return { sendMessage }
}
