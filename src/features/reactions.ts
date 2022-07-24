import { Message } from 'discord.js'
import { idToCmd } from '../commands'

export const handleQuestionReactions = (message: Message) =>
  message
    .delete()
    .then(() => sendQuestionAndReturnChoices(message))
    .then((choices) => sendChoicesWithReactions(choices, message))

export const handleReactions = (message: Message) =>
  message
    .delete()
    .then(() =>
      sendChoicesWithReactions(
        message.content.replace(`${idToCmd.react} `, ''),
        message
      )
    )

const sendQuestionAndReturnChoices = ({ channel, content }: Message) =>
  channel
    .send(`${content.replace(`${idToCmd.reactq} `, '').split('? ')[0]}?`)
    .then((sent) => content.replace(`${idToCmd.reactq} ${sent.content} `, ''))

const sendChoiceAndReact = (message: Message, choice: string) =>
  message.channel.send(choice).then((sent) => reactInOrder(sent))

const reactInOrder = (message: Message) =>
  Promise.all([message.react('✅'), message.react('❌'), message.react('❓')])

const sendChoicesWithReactions = (choices: string, message: Message) =>
  choices
    .replace(/, /g, ',')
    .split(',')
    .forEach((choice) => sendChoiceAndReact(message, choice))
