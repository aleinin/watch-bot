import {Client, Message} from 'discord.js'
import {handleQuestionReactions, handleReactions} from './features/reactions'
import {idToCmd, getCommandTypeIfValid} from './commands'
import {clearBotMessages} from './features/clear'
import {help} from './features/help'

export enum ReturnReason {
    SenderIsClient,
    InvalidCommand,
    Noop,
    Success
}

export const onMessage = async (message: Message, client: Client): Promise<ReturnReason> => {
    if (message.author.id === client?.user?.id) {
        return ReturnReason.SenderIsClient
    }
    const commandType = getCommandTypeIfValid(message.content)
    if (!commandType) {
        return ReturnReason.InvalidCommand
    }
    switch (commandType) {
        case `${idToCmd.react}`:
            return await handleReactions(message)
        case `${idToCmd.reactq}`:
            return await handleQuestionReactions(message)
        case `${idToCmd.clear}`:
            return client.user != null ? await clearBotMessages(message, client.user) : ReturnReason.InvalidCommand
        case `${idToCmd.help}`:
            return await help(message)
    }
    return ReturnReason.Noop
}
