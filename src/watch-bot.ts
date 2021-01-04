import Discord from 'discord.js'
import {onMessage} from './on-message'

const client = new Discord.Client()
client.login(process.env.WATCH_BOT_TOKEN)
client.on('ready', () => {
    console.log(`Logged in as ${client?.user?.tag}!`)
})
client.on('message', (message) =>
    onMessage(message, client))
