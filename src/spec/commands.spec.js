import {idToCmd, getCommandTypeIfValid} from "../commands"

const testCommandValid = (command, valid) => {
    expect(getCommandTypeIfValid(command)).toEqual(valid)
}
describe('getCommandTypeIfValid', () => {
    it('should return false if unknown command', () => {
        testCommandValid('!unknown command', false)
    })

    describe(`${idToCmd.react}`, () => {
        it(`should accept ${idToCmd.react} a, b, c`, () => {
            testCommandValid(`${idToCmd.react} a, b, c`, `${idToCmd.react}`)
        })

        it(`should accept ${idToCmd.react} a`, () => {
            testCommandValid(`${idToCmd.react} a`, `${idToCmd.react}`)
        })

        it(`should accept ${idToCmd.react} single choice`, () => {
            testCommandValid(`${idToCmd.react} a`, `${idToCmd.react}`)
        })

        it(`should accept ${idToCmd.react} multiple, choice`, () => {
            testCommandValid(`${idToCmd.react} a`, `${idToCmd.react}`)
        })

        it(`should reject ${idToCmd.react}`, () => {
            testCommandValid('${featureIdToCommand.react}', false)
        })

        it(`should reject ${idToCmd.react} ,`, () => {
            testCommandValid(`${idToCmd.react}`, false)
        })
    })

    describe(`${idToCmd.reactq}`, () => {
        it(`should accept ${idToCmd.reactq} question? a, b, c`, () => {
            testCommandValid(`${idToCmd.reactq} question? a, b, c`, `${idToCmd.reactq}`)
        })

        it(`should accept ${idToCmd.reactq} q? a`, () => {
            testCommandValid(`${idToCmd.reactq} q? a`, `${idToCmd.reactq}`)
        })

        it(`should reject ${idToCmd.reactq}`, () => {
            testCommandValid(`${idToCmd.reactq}`, false)
        })

        it(`should reject ${idToCmd.reactq} q? ,`, () => {
            testCommandValid(`${idToCmd.reactq} q?`, false)
        })
    })

    describe(`${idToCmd.clear}`, () => {
        it(`should accept exactly ${idToCmd.clear}`, () => {
            testCommandValid(`${idToCmd.clear}`, `${idToCmd.clear}`)
        })

        it (`should reject ${idToCmd.clear} with any extras`, () => {
            testCommandValid(`${idToCmd.clear} a`, false)
            testCommandValid(`${idToCmd.clear} `, false)
        })
    })
})
