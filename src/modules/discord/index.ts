import { Client, GatewayIntentBits, EmbedBuilder } from 'discord.js'

type SendMessage = (
  channelId: string,
  text: string,
  gifUrl: string
) => Promise<void>

export default async (token: string): Promise<{ sendMessage: SendMessage }> => {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  })

  const initializeBot = () => {
    client.login(token)
    client.once('ready', () => {
      console.log(`Logged in as ${client.user?.tag}!`)
    })
  }

  initializeBot()

  const sendMessage: SendMessage = async (channelId, text, gifUrl) => {
    try {
      const channel = await client.channels.fetch(channelId)
      if (channel?.isTextBased()) {
        const embed = new EmbedBuilder().setDescription(text).setImage(gifUrl)

        await channel.send({ embeds: [embed] })
        console.log('Message sent successfully!')
      } else {
        throw new Error('The specified discord channel is not a text channel.')
      }
    } catch (err) {
      throw new Error(`Failed to send message:, ${err}`)
    }
  }

  return { sendMessage }
}
