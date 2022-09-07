import * as reactions from '../features/reactions'
import * as commands from '../commands'
import * as clear from '../features/clear'
import * as help from '../features/help'
import * as repeat from '../features/repeat'
import { onMessage } from '../on-message'
import { idToCmd } from '../commands'
const client = { user: { id: 'me' } }

const exampleValidCommands = {
  reactq: `${idToCmd.reactq} hello? yes, you`,
  react: `${idToCmd.react} Hiya!`,
  clear: idToCmd.clear,
  help: idToCmd.help,
  repeat: idToCmd.repeat,
}

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
  const sendFn = jest.fn()
  let recordSpy = jest.fn()
  const messageTemplate = {
    author: { id: 'me', bot: false },
    guildId: '123',
    content: 'hello',
    channel: { send: sendFn },
  }
  afterEach(() => {
    jest.clearAllMocks()
  })

  beforeEach(() => {
    recordSpy = jest
      .spyOn(repeat, 'recordCommand')
      .mockReturnValue(Promise.resolve())
  })

  it('meta: have an example command for every commmand', () => {
    Object.keys(idToCmd).forEach((command) => {
      expect(exampleValidCommands[command]).toBeDefined()
    })
  })

  describe('mock repeat', () => {
    it('should return if not a command', async () => {
      await onMessage(messageTemplate, client)
      verifyNoInteractions(sendFn)
    })

    it('should inform the user of unknown commands', async () => {
      const message = {
        ...messageTemplate,
        content: '!wb hiya',
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
      await onMessage(message, client)
      expect(questionSpy).toHaveBeenCalled()
    })

    it(`should call clearBotMessages if message is exactly ${idToCmd.clear}`, async () => {
      const message = { author: { id: 'someone' }, content: `${idToCmd.clear}` }
      const clearSpy = jest
        .spyOn(clear, 'clearBotMessages')
        .mockReturnValue(undefined)
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

  describe('real repeat', () => {
    beforeEach(() => {
      jest
        .spyOn(reactions, 'handleReactions')
        .mockReturnValue(Promise.resolve())
      jest
        .spyOn(reactions, 'handleQuestionReactions')
        .mockReturnValue(Promise.resolve())
      jest.spyOn(clear, 'clearBotMessages').mockReturnValue(Promise.resolve())
      jest.spyOn(help, 'help').mockReturnValue(Promise.resolve())
    })
    it('should call repeat if command is repeat', async () => {
      const repeatSpy = jest
        .spyOn(repeat, 'repeat')
        .mockReturnValue(Promise.resolve())
      const message = { ...messageTemplate, content: idToCmd.repeat }
      await onMessage(message, client)
      expect(repeatSpy).toHaveBeenCalledWith(message)
    })

    it('should call recordCommand on every command besides repeat and clear', async () => {
      const commands = Object.values(exampleValidCommands)
      const recordedCommands = commands.filter(
        (command) => command !== idToCmd.repeat && command !== idToCmd.clear
      )
      const messages = Object.values(recordedCommands).map((content) => ({
        ...messageTemplate,
        content,
      }))
      const calls = messages.map((message) => onMessage(message, client))
      await Promise.all(calls)
      expect(recordSpy.mock.calls).toEqual(messages.map((message) => [message]))
    })
  })
})
