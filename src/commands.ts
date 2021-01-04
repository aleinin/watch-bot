export interface Commands {
    [command: string]: RegExp
}

export const commands: Commands = {
    react: /^!react (.*,)*(.*\S+)$/,
    reactq: /^!reactq .+\? ([^,]+,)*(.*\S+)/,
    clear: /^!clear$/,
}

export const validCommand = (commandType: string, message: string): boolean => {
    const pattern = commands[commandType]
    return pattern != null && pattern.test(message)
}
