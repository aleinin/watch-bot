export interface Commands {
  [commandId: string]: RegExp
}

export interface CommandDict {
  [commandId: string]: string
}

export const idToCmd: CommandDict = {
  reactq: '!wb reactq',
  react: '!wb react',
  clear: '!wb clear',
  help: '!wb help',
}

export const botPrefix = '!wb'
export const UNKNOWN_COMMAND = `Unknown Command. Try ${botPrefix} help.`

export const commands: Commands = {
  [`${idToCmd.react}`]: new RegExp(`^${idToCmd.react} (.*,)*(.*\\S+)$`),
  [`${idToCmd.reactq}`]: new RegExp(
    `^${idToCmd.reactq} .+\\? ([^,]+,)*(.*\\S+)`
  ),
  [`${idToCmd.clear}`]: new RegExp(`^${idToCmd.clear}$`),
  [`${idToCmd.help}`]: new RegExp(`^${idToCmd.help}$`),
}

export const getCommandTypeIfValid = (input: string): false | string => {
  const matchingCommands = Object.keys(commands).filter((id) =>
    input.startsWith(id)
  )
  if (matchingCommands.length === 0) {
    return false
  }
  const command = getLongestMatchingCommand(matchingCommands)
  return commands[command].test(input) ? command : false
}

export const isBeingHailed = (input: string): boolean => {
  return input.startsWith(`${botPrefix} `)
}

const getLongestMatchingCommand = (matches: string[]) =>
  matches.sort((a, b) => b.length - a.length)[0]
