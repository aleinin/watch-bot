import { Message } from 'discord.js'

const helpMessage = `\`\`\`
Commands

!wb react
!wb reactq
!wb clear
!wb help

react:
    example usage: !wb react Monday, Tuesday, Wednesday
    WatchBot will post the above comma delimited with reactions
reactq
    example usage: !wb when is everyone available? Monday, Tuesday, Wednesday
    WatchBot will post the question indicated by a ? then post the choices with reactions
clear
    usage: !wb clear
    Deletes the last 100 messages from WatchBot
help
    usage: !wb help
    Posts this message
repeat
    usage: !wb repeat
    Repeats your last recorded command. clear & repeat are not recorded
\`\`\``

export const help = async (message: Message) =>
  message.delete().then(() => message.channel.send(helpMessage))
