import Discord, { ActivityType, GatewayIntentBits } from 'discord.js'
import { onMessage } from './on-message'
import dotenv from 'dotenv'

dotenv.config()
const client = new Discord.Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
})
client.login(process.env.WATCH_BOT_TOKEN)
client.once('ready', () => {
  client.user?.setPresence({
    status: 'online',
    activities: [
      {
        name: '!wb help',
        type: ActivityType.Playing,
      },
    ],
  })
  console.log(`Logged in as ${client?.user?.tag}!`)
})
client.on('messageCreate', (message) => {
  onMessage(message, client)
})
