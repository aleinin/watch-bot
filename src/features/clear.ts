import { ClientUser, Message } from 'discord.js'
import { ReturnReason } from '../on-message'

export const clearBotMessages = async (
  message: Message,
  author: ClientUser
): Promise<ReturnReason> =>
  message
    .delete()
    .then(() =>
      message.channel.messages
        .fetch({ limit: 100 })
        .then((fetchedCollection) =>
          Array.from(fetchedCollection.values()).filter((fetchedMessage) =>
            fetchedMessage.author.equals(author)
          )
        )
    )
    .then((messagesToDelete) =>
      messagesToDelete.forEach((message) => message.delete())
    )
    .then(() => ReturnReason.Success)
