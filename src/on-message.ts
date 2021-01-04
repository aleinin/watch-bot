import {Client, Message} from "discord.js"
import {safeGetFirstRegexMatch} from "./util"
import {handleQuestionReactions, handleReactions} from "./features/reactions"
import {validCommand} from "./commands"
import {clearBotMessages} from "./features/clear"

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
    const startsWith = safeGetFirstRegexMatch(message.content, /^![a-z]+/)
    if (startsWith == null || !validCommand(startsWith.replace('!', ''), message.content)) {
        return ReturnReason.InvalidCommand
    }
    switch (startsWith) {
        case '!react':
            return await handleReactions(message)
        case '!reactq':
            return await handleQuestionReactions(message)
        case '!clear':
            return client.user != null ? await clearBotMessages(message, client.user) : ReturnReason.InvalidCommand
    }
    return ReturnReason.Noop
}
