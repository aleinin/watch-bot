import {ClientUser, Message} from "discord.js"
import {ReturnReason} from "../on-message"

export const clearBotMessages = async (message: Message, author: ClientUser): Promise<ReturnReason> =>
    message.delete()
        .then(() => message.channel.messages
            .fetch({limit: 100})
            .then((fetchedMessages) =>
                fetchedMessages.array().filter(fetchMsg => fetchMsg.author.equals(author))
            )
        )
        .then((messagesToDelete) => messagesToDelete.forEach((message) => message.delete()))
        .then(() => ReturnReason.Success)
