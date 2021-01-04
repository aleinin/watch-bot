export interface Commands {
    [commandId: string]: RegExp
}

export interface CommandDict {
    [commandId: string]: string
}

export const idToCmd: CommandDict = {
    reactq: '!reactq',
    react: '!react',
    clear: '!clear'
}

export const commands: Commands = {
    [`${idToCmd.react}`]: new RegExp(`^${idToCmd.react} (.*,)*(.*\\S+)$`),
    [`${idToCmd.reactq}`]: new RegExp(`^${idToCmd.reactq} .+\\? ([^,]+,)*(.*\\S+)`),
    [`${idToCmd.clear}`]: new RegExp(`^${idToCmd.clear}$`),
}

export const validCommand = (commandType: string, message: string): boolean => {
    const pattern = commands[commandType]
    return pattern != null && pattern.test(message)
}
