import { help } from '../help'
/*
export const help = async (message: Message) =>
  message.delete().then(() => message.channel.send(helpMessage))

*/
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
