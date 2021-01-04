import {validCommand} from "../commands"

const testCommandValid = (commandType, command, valid) => {
    expect(validCommand(commandType, command)).toEqual(valid)
}
describe('validCommand', () => {
    it('should return false if unknown command', () => {
        testCommandValid('unknown', '!unknown command', false)
    })

    describe('!react', () => {
        const testReactValid = (command, valid) =>
            testCommandValid('react', command, valid)

        it('should accept !react a, b, c', () => {
            testReactValid('!react a, b, c', true)
        })

        it('should accept !react a', () => {
            testReactValid('!react a', true)
        })

        it('should accept !react single choice', () => {
            testReactValid('!react a', true)
        })

        it('should accept !react multiple, choice', () => {
            testReactValid('!react a', true)
        })

        it('should reject !react', () => {
            testReactValid('!react', false)
        })

        it('should reject !react ,', () => {
            testReactValid('!react', false)
        })
    })

    describe('!reactq', () => {
        const testReactQValid = (command, valid) =>
            testCommandValid('reactq', command, valid)

        it('should accept !reactq question? a, b, c', () => {
            testReactQValid('!reactq question? a, b, c', true)
        })

        it('should accept !reactq q? a', () => {
            testReactQValid('!reactq q? a', true)
        })

        it('should reject !reactq', () => {
            testReactQValid('!reactq', false)
        })

        it('should reject !reactq q? ,', () => {
            testReactQValid('!reactq q?', false)
        })
    })

    describe('!clear', () => {
        const testClearValid = (command, valid) =>
            testCommandValid('clear', command, valid)

        it('should accept exactly !clear', () => {
            testClearValid('!clear', true)
        })

        it ('should reject !clear with any extras', () => {
            testClearValid('!clear a', false)
            testClearValid('!clear ', false)
        })
    })
})
