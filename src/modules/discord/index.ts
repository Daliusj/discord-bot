import { Client, GatewayIntentBits, EmbedBuilder } from 'discord.js'

type SendMessage = (text: string, gifUrl: string) => Promise<void>

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

  const sendMessage: SendMessage = async (text, gifUrl) => {
    try {
      const channel = await client.channels.fetch(CHANNEL_ID)
      if (channel?.isTextBased()) {
        const embed = new EmbedBuilder().setDescription(text).setImage(gifUrl)

        await channel.send({ embeds: [embed] })
        console.log('Message sent successfully!')
      } else {
        throw new Error('The specified discord channel is not a text channel.')
      }
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
