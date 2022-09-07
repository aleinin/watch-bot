import {
  idToCmd,
  getCommandTypeIfValid,
  isBeingHailed,
  shouldRecord,
} from '../commands'

const expectFalse = (command) =>
  expect(getCommandTypeIfValid(command)).toBeFalsy()
const expectValid = (command, expected) =>
  expect(getCommandTypeIfValid(command)).toEqual(expected)

describe('commands', () => {
  const simpleCommandTests = (command) =>
    describe(command, () => {
      it(`should accept exactly ${command}`, () => {
        expectValid(command, command)
      })

      it(`should reject ${command} with any extras`, () => {
        expectFalse(`${command} a`)
        expectFalse(`${command} `)
      })
    })

  describe('getCommandTypeIfValid', () => {
    it('should return false if unknown command', () => {
      expectFalse('!unknown command')
    })
  })

  describe('isBeingHailed', () => {
    it('should know if the bot is being hailed', () => {
      expect(isBeingHailed('!wb something')).toBeTruthy()
      expect(isBeingHailed('!other hello')).toBeFalsy()
      expect(isBeingHailed('random message')).toBeFalsy()
    })
  })

  describe('shouldRecord', () => {
    it('should record all commands besides repeat and clear', () => {
      const commands = Object.values(idToCmd)
      const recordedCommands = commands.filter(
        (command) => command !== idToCmd.repeat && command !== idToCmd.clear
      )
      const unrecordedCommands = commands.filter(
        (command) => command === idToCmd.repeat || command === idToCmd.clear
      )
      recordedCommands.forEach((command) => {
        expect(shouldRecord(command)).toBeTruthy()
      })
      unrecordedCommands.forEach((command) => {
        expect(shouldRecord(command)).toBeFalsy()
      })
    })
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
  simpleCommandTests(idToCmd.repeat)
})
