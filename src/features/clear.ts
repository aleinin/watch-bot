import { ClientUser, Message } from 'discord.js'

export const clearBotMessages = async (message: Message, author: ClientUser) =>
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
