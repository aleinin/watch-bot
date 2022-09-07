import { Client, Message } from 'discord.js'
import { handleQuestionReactions, handleReactions } from './features/reactions'
import {
  idToCmd,
  getCommandTypeIfValid,
  isBeingHailed,
  UNKNOWN_COMMAND,
  shouldRecord,
} from './commands'
import { clearBotMessages } from './features/clear'
import { help } from './features/help'
import { repeat, recordCommand } from './features/repeat'

export const onMessage = async (message: Message, client: Client) => {
  if (!isBeingHailed(message.content)) {
    return
  }
  const commandType = getCommandTypeIfValid(message.content)
  if (!commandType) {
    message.channel.send(UNKNOWN_COMMAND)
    return
  }
  if (shouldRecord(commandType)) {
    recordCommand(message)
    switch (commandType) {
      case `${idToCmd.react}`:
        await handleReactions(message)
        break
      case `${idToCmd.reactq}`:
        await handleQuestionReactions(message)
        break
      case `${idToCmd.clear}`:
        if (client.user == null) {
          throw new Error('Internal Error: client.user was null')
        } else {
          await clearBotMessages(message, client.user)
        }
        break
      case `${idToCmd.help}`:
        await help(message)
        break
    }
  } else {
    switch (commandType) {
      case `${idToCmd.repeat}`:
        await repeat(message)
        break
      case `${idToCmd.clear}`:
        if (client.user == null) {
          throw new Error('Internal Error: client.user was null')
        } else {
          await clearBotMessages(message, client.user)
        }
        break
    }
  }
}
