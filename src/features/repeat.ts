import { Message } from 'discord.js'
import { getUsersLastCommand, writeUsersLastCommand } from '../state'

export const NO_LAST_COMMAND =
  'I have no recorded history of you sending me anything'

const handleNoGuildId = (guildId: string | null): string => {
  if (guildId == null) {
    throw new Error('Discord Error: guildId is undefined')
  }
  return guildId
}

export const recordCommand = (message: Message) => {
  const guildId = handleNoGuildId(message.guildId)
  writeUsersLastCommand(guildId, message.author.id, message.content)
}

export const repeat = (message: Message) => {
  const guildId = handleNoGuildId(message.guildId)
  const content = getUsersLastCommand(guildId, message.author.id)
  if (content == null) {
    message.channel.send(`${message.author.toString()}, ${NO_LAST_COMMAND}`)
  } else {
    message.delete().then(() => {
      message.channel.send(content)
    })
  }
}
