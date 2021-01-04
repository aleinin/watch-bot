import {handleQuestionReactions, handleReactions} from "../reactions"
import {idToCmd} from "../../commands"

const reactNTimes = (n) =>
    Array.from(Array(n))
        .reduce((accumulator) =>
            [...accumulator, nestArray('✅', '❌', '❓')]
            , [])
        .flat(1)

const nestArray = (...args) =>
    args.map((arg) => [arg])

describe('Reactions', () => {
    let mockDelete = jest.fn()
    let mockReact = jest.fn()
    let mockSend = jest.fn()
    const setupCommandMessage = (content) => ({
        content,
        delete: mockDelete,
        channel: {
            send: mockSend
        }
    })
    const sentMessage = (content) => ({
        react: mockReact,
        content
    })
    beforeEach(() => {
        mockDelete.mockClear()
        mockReact.mockClear()
        mockSend.mockClear()
        mockDelete.mockImplementation(() => Promise.resolve())
        mockReact.mockImplementation(() => Promise.resolve())
        mockSend.mockImplementation((message) => Promise.resolve(sentMessage(message)))
    })

    describe('handleQuestionReactions', () => {
        it('send question, then choices and react to them', async () => {
            const commandMessage = setupCommandMessage(
                `${idToCmd.reactq} question? choice! one!,choice two, !@#$, d`
            )
            await handleQuestionReactions(commandMessage)
            expect(mockDelete).toHaveBeenCalledTimes(1)
            expect(mockSend).toHaveBeenCalledTimes(5)
            expect(mockReact).toHaveBeenCalledTimes(12)
            expect(mockSend.mock.calls).toEqual(nestArray('question?', 'choice! one!', 'choice two', '!@#$', 'd'))
            expect(mockReact.mock.calls).toEqual(reactNTimes(4))
        })
    })

    describe('handleReactions', () => {
        it('should send choices and react to them', async () => {
            const commandMessage = setupCommandMessage(`${idToCmd.react} a, b, c`)
            await handleReactions(commandMessage)
            expect(mockDelete).toHaveBeenCalledTimes(1)
            expect(mockSend).toHaveBeenCalledTimes(3)
            expect(mockSend.mock.calls).toEqual(nestArray('a', 'b', 'c'))
            expect(mockReact).toHaveBeenCalledTimes(9)
            expect(mockReact.mock.calls).toEqual(reactNTimes(3))
        })
    })
})
