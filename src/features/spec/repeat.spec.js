import { NO_LAST_COMMAND, recordCommand, repeat } from '../repeat'
import * as state from '../../state'
import { idToCmd } from '../../commands'
describe('repeat', () => {
  let sendFn = jest.fn()
  let deleteFn = jest.fn()
  const messageTemplate = {
    author: { id: 'me', tag: '@me' },
    guildId: '123',
    delete: deleteFn,
    channel: { send: sendFn },
  }
  afterEach(() => {
    jest.clearAllMocks()
  })
  describe('recordCommand', () => {
    it('should throw an error if guildid is null', () => {
      let message = { ...messageTemplate }
      delete message.guildId
      expect(() => recordCommand(message)).toThrow()
    })

    it('should call writeUsersLastCommand if recordCommand is called', () => {
      const stateSpy = jest
        .spyOn(state, 'writeUsersLastCommand')
        .mockReturnValue(undefined)
      recordCommand(messageTemplate)
      expect(stateSpy).toHaveBeenCalledWith(
        messageTemplate.guildId,
        messageTemplate.author.id,
        messageTemplate.content
      )
    })
  })

  describe('repeat', () => {
    it('should throw an error if guildId is null', () => {
      let message = { ...messageTemplate }
      delete message.guildId
      expect(() => repeat(message)).toThrow()
    })

    it('should get the users last command if present', async () => {
      jest.spyOn(state, 'getUsersLastCommand').mockReturnValue(idToCmd.help)
      deleteFn.mockReturnValue(Promise.resolve())
      await repeat(messageTemplate)
      expect(deleteFn).toHaveBeenCalled()
      expect(sendFn).toHaveBeenCalledWith(idToCmd.help)
    })

    it('should inform the user if theyve not sent a last command', () => {
      jest.spyOn(state, 'getUsersLastCommand').mockReturnValue(null)
      repeat(messageTemplate)
      expect(sendFn.mock.calls[0][0]).toContain('no recorded history')
    })
  })
})
