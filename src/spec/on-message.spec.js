import * as reactions from '../features/reactions'
import * as util from '../util'
import * as commands from '../commands'
import * as clear from '../features/clear'
import {onMessage, ReturnReason} from "../on-message"
const client = {user: {id: 'me'}}

describe('onMessage', () => {
    it('should return if the message sender is the bot', async () => {
        const message = {author: {id: 'me'}, content: 'hello'}
        expect(await onMessage(message, client)).toEqual(ReturnReason.SenderIsClient)
    })

    it('should return if not a command (!)', async () => {
        const message = {author: {id: 'someone'}, content: 'hello'}
        jest.spyOn(util, 'safeGetFirstRegexMatch').mockReturnValue(undefined)
        expect(await onMessage(message, client)).toEqual(ReturnReason.InvalidCommand)
    })

    it('should return if an unknown command (!)', async () => {
        const message = {author: {id: 'someone'}, content: '!somecommand'}
        expect(await onMessage(message, client)).toEqual(ReturnReason.InvalidCommand)
    })

    it('should call sendChoicesWithReactions if command starts with !react', async () => {
        const message = {author: {id: 'someone'}, content: '!react a, b, c'}
        const choiceSpy = jest.spyOn(reactions, 'handleReactions').mockReturnValue(undefined)
        jest.spyOn(util, 'safeGetFirstRegexMatch').mockReturnValue('!react')
        jest.spyOn(commands, 'validCommand').mockReturnValue(true)
        await onMessage(message, client)
        expect(choiceSpy).toHaveBeenCalled()
    })

    it('should call sendQuestionAndChoicesWithReactions if command starts with !react', async () => {
        const message = {author: {id: 'someone'}, content: '!reactq q? a, b, c'}
        const questionSpy = jest.spyOn(reactions, 'handleQuestionReactions').mockReturnValue(undefined)
        jest.spyOn(util, 'safeGetFirstRegexMatch').mockReturnValue('!reactq')
        jest.spyOn(commands, 'validCommand').mockReturnValue(true)
        await onMessage(message, client)
        expect(questionSpy).toHaveBeenCalled()
    })

    it('should call clearBotMessages if message is exactly !clear', async () => {
        const message = {author: {id: 'someone'}, content: '!clear'}
        const clearSpy = jest.spyOn(clear, 'clearBotMessages').mockReturnValue(undefined)
        jest.spyOn(util, 'safeGetFirstRegexMatch').mockReturnValue('!clear')
        jest.spyOn(commands, 'validCommand').mockReturnValue(true)
        await onMessage(message, client)
        expect(clearSpy).toHaveBeenCalled()
    })

    it('should not call clearBotMessages if it starts with !clear but has other parts', async () => {
        const message = {author: {id: 'someone'}, content: '!clear and some other stuff'}
        jest.spyOn(util, 'safeGetFirstRegexMatch').mockReturnValue('!clear')
        jest.spyOn(commands, 'validCommand').mockReturnValue(false)
        expect(await onMessage(message, client)).toEqual(ReturnReason.InvalidCommand)
    })
})

