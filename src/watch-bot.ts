import Discord, { ActivityType, GatewayIntentBits } from 'discord.js'
import { onMessage } from './on-message'
import dotenv from 'dotenv'
import { initState } from './state'

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
  try {
    initState()
  } catch (e) {
    console.error(
      'FATAL ERROR: Uncaught exception while initializing state. Quitting!'
    )
    console.error(e)
    process.exit(1)
  }
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
  onMessage(message, client).catch((reason) => {
    console.error('Uncaught error while processing message:')
    console.error(reason)
  })
})
