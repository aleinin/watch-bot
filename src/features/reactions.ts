import {Message} from "discord.js"
import {ReturnReason} from "../on-message"

export const handleQuestionReactions = async (message: Message): Promise<ReturnReason> =>
    message.delete()
        .then(() => sendQuestionAndReturnChoices(message))
        .then((choices) => sendChoicesWithReactions(choices, message))
        .then(() => ReturnReason.Success)

export const handleReactions = (message: Message): Promise<ReturnReason> =>
    message.delete()
        .then(() =>
            sendChoicesWithReactions(message.content.replace("!react ", ""),
                message))
        .then(() => ReturnReason.Success)

const sendQuestionAndReturnChoices = ({channel, content}: Message) =>
    channel.send(`${content
        .replace("!reactq ", "")
        .split("? ")[0]}?`)
        .then((sent) =>
            content.replace(`!reactq ${sent.content} `, ''))

const sendChoiceAndReact = (message: Message, choice: string) =>
    message.channel.send(choice)
        .then((sent) => reactInOrder(sent))

const reactInOrder = (message: Message) =>
    Promise.all([
        message.react("✅"),
        message.react('❌'),
        message.react('❓')
    ])

const sendChoicesWithReactions = (choices: string, message: Message) =>
    choices.replace(/, /g, ",")
        .split(",")
        .forEach((choice) =>
            sendChoiceAndReact(message, choice))
