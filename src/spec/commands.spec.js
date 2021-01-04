import {idToCmd, validCommand} from "../commands"

const testCommandValid = (commandType, command, valid) => {
    expect(validCommand(commandType, command)).toEqual(valid)
}
describe('validCommand', () => {
    it('should return false if unknown command', () => {
        testCommandValid('unknown', '!unknown command', false)
    })

    describe(`${idToCmd.react}`, () => {
        const testReactValid = (command, valid) =>
            testCommandValid(`${idToCmd.react}`, command, valid)

        it(`should accept ${idToCmd.react} a, b, c`, () => {
            testReactValid(`${idToCmd.react} a, b, c`, true)
        })

        it(`should accept ${idToCmd.react} a`, () => {
            testReactValid(`${idToCmd.react} a`, true)
        })

        it(`should accept ${idToCmd.react} single choice`, () => {
            testReactValid(`${idToCmd.react} a`, true)
        })

        it(`should accept ${idToCmd.react} multiple, choice`, () => {
            testReactValid(`${idToCmd.react} a`, true)
        })

        it(`should reject ${idToCmd.react}`, () => {
            testReactValid('${featureIdToCommand.react}', false)
        })

        it(`should reject ${idToCmd.react} ,`, () => {
            testReactValid(`${idToCmd.react}`, false)
        })
    })

    describe(`${idToCmd.reactq}`, () => {
        const testReactQValid = (command, valid) =>
            testCommandValid(`${idToCmd.reactq}`, command, valid)

        it(`should accept ${idToCmd.reactq} question? a, b, c`, () => {
            testReactQValid(`${idToCmd.reactq} question? a, b, c`, true)
        })

        it(`should accept ${idToCmd.reactq} q? a`, () => {
            testReactQValid(`${idToCmd.reactq} q? a`, true)
        })

        it(`should reject ${idToCmd.reactq}`, () => {
            testReactQValid(`${idToCmd.reactq}`, false)
        })

        it(`should reject ${idToCmd.reactq} q? ,`, () => {
            testReactQValid(`${idToCmd.reactq} q?`, false)
        })
    })

    describe(`${idToCmd.clear}`, () => {
        const testClearValid = (command, valid) =>
            testCommandValid(`${idToCmd.clear}`, command, valid)

        it(`should accept exactly ${idToCmd.clear}`, () => {
            testClearValid(`${idToCmd.clear}`, true)
        })

        it (`should reject ${idToCmd.clear} with any extras`, () => {
            testClearValid(`${idToCmd.clear} a`, false)
            testClearValid(`${idToCmd.clear} `, false)
        })
    })
})
