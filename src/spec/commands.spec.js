import { idToCmd, getCommandTypeIfValid } from '../commands'

const expectFalse = (command) =>
  expect(getCommandTypeIfValid(command)).toBeFalsy()
const expectValid = (command, expected) =>
  expect(getCommandTypeIfValid(command)).toEqual(expected)

describe('getCommandTypeIfValid', () => {
  const simpleCommandTests = (command) =>
    describe(command, () => {
      it(`should accept exactly ${command}`, () => {
        expectValid(command, command)
      })

      it(`should reject ${idToCmd.clear} with any extras`, () => {
        expectFalse(`${command} a`)
        expectFalse(`${command} `)
      })
    })

  it('should return false if unknown command', () => {
    expectFalse('!unknown command')
  })

  describe(idToCmd.react, () => {
    it(`should accept ${idToCmd.react} a, b, c`, () => {
      expectValid(`${idToCmd.react} a, b, c`, idToCmd.react)
    })

    it(`should accept ${idToCmd.react} a`, () => {
      expectValid(`${idToCmd.react} a`, idToCmd.react)
    })

    it(`should accept ${idToCmd.react} single choice`, () => {
      expectValid(`${idToCmd.react} a`, idToCmd.react)
    })

    it(`should accept ${idToCmd.react} multiple, choice`, () => {
      expectValid(`${idToCmd.react} a`, idToCmd.react)
    })

    it(`should reject ${idToCmd.react}`, () => {
      expectValid('${featureIdToCommand.react}', false)
    })

    it(`should reject ${idToCmd.react} ,`, () => {
      expectValid(idToCmd.react, false)
    })
  })

  describe(idToCmd.reactq, () => {
    it(`should accept ${idToCmd.reactq} question? a, b, c`, () => {
      expectValid(`${idToCmd.reactq} question? a, b, c`, idToCmd.reactq)
    })

    it(`should accept ${idToCmd.reactq} q? a`, () => {
      expectValid(`${idToCmd.reactq} q? a`, idToCmd.reactq)
    })

    it(`should reject ${idToCmd.reactq}`, () => {
      expectFalse(idToCmd.reactq)
    })

    it(`should reject ${idToCmd.reactq} q? ,`, () => {
      expectFalse(`${idToCmd.reactq} q?`)
    })
  })
  simpleCommandTests(idToCmd.clear)
  simpleCommandTests(idToCmd.help)
})
