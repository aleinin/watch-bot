import * as reactions from '../features/reactions'
import * as commands from '../commands'
import * as clear from '../features/clear'
import {onMessage, ReturnReason} from "../on-message"
import {idToCmd} from "../commands"
const client = {user: {id: 'me'}}

describe('onMessage', () => {
    it('should return if the message sender is the bot', async () => {
        const message = {author: {id: 'me'}, content: 'hello'}
        expect(await onMessage(message, client)).toEqual(ReturnReason.SenderIsClient)
    })

    it('should return if not a command (!)', async () => {
        const message = {author: {id: 'someone'}, content: 'hello'}
        expect(await onMessage(message, client)).toEqual(ReturnReason.InvalidCommand)
    })

    it('should return if an unknown command (!)', async () => {
        const message = {author: {id: 'someone'}, content: '!somecommand'}
        expect(await onMessage(message, client)).toEqual(ReturnReason.InvalidCommand)
    })

    it(`should call handleReactions if command starts with ${idToCmd.react}`, async () => {
        const message = {author: {id: 'someone'}, content: `${idToCmd.react} a, b, c`}
        const choiceSpy = jest.spyOn(reactions, 'handleReactions').mockReturnValue(undefined)
        jest.spyOn(commands, 'getCommandTypeIfValid').mockReturnValue(`${idToCmd.react}`)
        await onMessage(message, client)
        expect(choiceSpy).toHaveBeenCalled()
    })

    it(`should call handleQuestionReactions if command starts with ${idToCmd.reactq}`, async () => {
        const message = {author: {id: 'someone'}, content: `${idToCmd.reactq} q? a, b, c`}
        const questionSpy = jest.spyOn(reactions, 'handleQuestionReactions').mockReturnValue(undefined)
        jest.spyOn(commands, 'getCommandTypeIfValid').mockReturnValue(`${idToCmd.reactq}`)
        await onMessage(message, client)
        expect(questionSpy).toHaveBeenCalled()
    })

    it(`should call clearBotMessages if message is exactly ${idToCmd.clear}`, async () => {
        const message = {author: {id: 'someone'}, content: `${idToCmd.clear}`}
        const clearSpy = jest.spyOn(clear, 'clearBotMessages').mockReturnValue(undefined)
        jest.spyOn(commands, 'getCommandTypeIfValid').mockReturnValue(`${idToCmd.clear}`)
        await onMessage(message, client)
        expect(clearSpy).toHaveBeenCalled()
    })

    it(`should not call clearBotMessages if it starts with ${idToCmd.clear} but has other parts`, async () => {
        const message = {author: {id: 'someone'}, content: `${idToCmd.clear} and some other stuff`}
        jest.spyOn(commands, 'getCommandTypeIfValid').mockReturnValue(false)
        expect(await onMessage(message, client)).toEqual(ReturnReason.InvalidCommand)
    })
})

