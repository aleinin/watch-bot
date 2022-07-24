import { clearBotMessages } from '../clear'

describe('clear', () => {
  it('should clear the last 100 messages when called', async () => {
    const deleteFn = jest.fn().mockReturnValueOnce(Promise.resolve())
    const subDeleteFn = jest.fn()
    const fetchedMatchMessage = {
      delete: subDeleteFn,
      author: { equals: jest.fn().mockReturnValue(true) },
    }
    const fetchedUnrelatedmessage = {
      delete: subDeleteFn,
      author: { equals: jest.fn().mockReturnValue(false) },
    }
    const fetchedMessages = new Map()
    fetchedMessages.set('one', fetchedMatchMessage)
    fetchedMessages.set('two', fetchedMatchMessage)
    fetchedMessages.set('three', fetchedMatchMessage)
    fetchedMessages.set('four', fetchedMatchMessage)
    fetchedMessages.set('five', fetchedMatchMessage)
    fetchedMessages.set('six', fetchedUnrelatedmessage)
    const fetchFn = jest
      .fn()
      .mockReturnValueOnce(Promise.resolve(fetchedMessages))
    const message = {
      delete: deleteFn,
      channel: {
        messages: {
          fetch: fetchFn,
        },
      },
    }

    const author = 'user'
    await clearBotMessages(message, author)
    expect(fetchFn).toHaveBeenCalledWith({ limit: 100 })
    expect(deleteFn).toHaveBeenCalled()
    expect(subDeleteFn).toHaveBeenCalledTimes(5)
  })
})
