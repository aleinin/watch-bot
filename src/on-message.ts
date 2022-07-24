import { Client, Message } from 'discord.js'
import { handleQuestionReactions, handleReactions } from './features/reactions'
import {
  idToCmd,
  getCommandTypeIfValid,
  isBeingHailed,
  UNKNOWN_COMMAND,
} from './commands'
import { clearBotMessages } from './features/clear'
import { help } from './features/help'

export const onMessage = async (message: Message, client: Client) => {
  if (message.author.bot || !isBeingHailed(message.content)) {
    return
  }
  const commandType = getCommandTypeIfValid(message.content)
  if (!commandType) {
    message.channel.send(UNKNOWN_COMMAND)
    return
  }
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
}
