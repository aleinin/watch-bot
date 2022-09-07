import { help } from '../help'

describe('help', () => {
  it('should send a help message when called', async () => {
    const deleteFn = jest.fn().mockReturnValue(Promise.resolve())
    const sendFn = jest.fn()
    const message = {
      delete: deleteFn,
      channel: {
        send: sendFn,
      },
    }
    await help(message)
    expect(deleteFn).toHaveBeenCalled()
    expect(sendFn).toHaveBeenCalled()
  })
})
