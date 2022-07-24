import * as reactions from '../features/reactions'
import * as commands from '../commands'
import * as clear from '../features/clear'
import * as help from '../features/help'
import { onMessage } from '../on-message'
import { idToCmd } from '../commands'
const client = { user: { id: 'me' } }

const verifyNoInteractions = (sendFn) => {
  const reactSpy = jest.spyOn(reactions, 'handleReactions')
  const questionSpy = jest.spyOn(reactions, 'handleQuestionReactions')
  const clearSpy = jest.spyOn(clear, 'clearBotMessages')
  const helpSpy = jest.spyOn(help, 'help')
  expect(sendFn).not.toHaveBeenCalled()
  expect(reactSpy).not.toHaveBeenCalled()
  expect(questionSpy).not.toHaveBeenCalled()
  expect(clearSpy).not.toHaveBeenCalled()
  expect(helpSpy).not.toHaveBeenCalled()
}

describe('onMessage', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })
  it('should return if the message sender is a bot', async () => {
    const sendFn = jest.fn()
    const message = {
      author: { id: 'me', bot: true },
      content: 'hello',
      channel: { send: sendFn },
    }
    await onMessage(message, client)
    verifyNoInteractions(sendFn)
  })

  it('should return if not a bot command', async () => {
    const sendFn = jest.fn()
    const message = {
      author: { id: 'me', bot: true },
      content: 'hello',
      channel: { send: sendFn },
    }
    await onMessage(message, client)
    verifyNoInteractions(sendFn)
  })

  it('should inform the user of unknown commands', async () => {
    const sendFn = jest.fn()
    const message = {
      author: { id: 'someone' },
      content: '!wb hiya',
      channel: { send: sendFn },
    }
    await onMessage(message, client)
    expect(sendFn).toHaveBeenCalledWith(commands.UNKNOWN_COMMAND)
  })

  it(`should call handleReactions if command starts with ${idToCmd.react}`, async () => {
    const message = {
      author: { id: 'someone' },
      content: `${idToCmd.react} a, b, c`,
    }
    const choiceSpy = jest
      .spyOn(reactions, 'handleReactions')
      .mockReturnValue(undefined)
    jest
      .spyOn(commands, 'getCommandTypeIfValid')
      .mockReturnValue(`${idToCmd.react}`)
    await onMessage(message, client)
    expect(choiceSpy).toHaveBeenCalled()
  })

  it(`should call handleQuestionReactions if command starts with ${idToCmd.reactq}`, async () => {
    const message = {
      author: { id: 'someone' },
      content: `${idToCmd.reactq} q? a, b, c`,
    }
    const questionSpy = jest
      .spyOn(reactions, 'handleQuestionReactions')
      .mockReturnValue(undefined)
    jest
      .spyOn(commands, 'getCommandTypeIfValid')
      .mockReturnValue(`${idToCmd.reactq}`)
    await onMessage(message, client)
    expect(questionSpy).toHaveBeenCalled()
  })

  it(`should call clearBotMessages if message is exactly ${idToCmd.clear}`, async () => {
    const message = { author: { id: 'someone' }, content: `${idToCmd.clear}` }
    const clearSpy = jest
      .spyOn(clear, 'clearBotMessages')
      .mockReturnValue(undefined)
    jest
      .spyOn(commands, 'getCommandTypeIfValid')
      .mockReturnValue(`${idToCmd.clear}`)
    await onMessage(message, client)
    expect(clearSpy).toHaveBeenCalled()
  })

  it(`should not call clearBotMessages if it starts with ${idToCmd.clear} but has other parts`, async () => {
    const sendFn = jest.fn()
    const message = {
      author: { id: 'someone' },
      content: `${idToCmd.clear} and some other stuff`,
      channel: { send: sendFn },
    }
    await onMessage(message, client)
    expect(sendFn).toHaveBeenCalledWith(commands.UNKNOWN_COMMAND)
  })
})
