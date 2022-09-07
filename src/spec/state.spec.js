import fs from 'fs'
import {
  getState,
  getUsersLastCommand,
  initState,
  writeUsersLastCommand,
} from '../state'
const path = './state.json'
jest.mock('fs')
const exampleState = {
  123: {
    lastUserCommands: {
      987: 'hello world',
      1012: 'hiya',
    },
  },
  456: {},
  789: {
    lastUserCommands: {
      420: 'bye',
    },
  },
}
describe('state', () => {
  beforeEach(() => {
    fs.writeFileSync.mockClear()
    fs.existsSync.mockClear()
    fs.readFileSync.mockClear()
    fs.existsSync.mockReturnValue(true)
    fs.readFileSync.mockReturnValue(JSON.stringify(exampleState))
  })
  describe('initState', () => {
    describe('state file exists', () => {
      describe('state file is malformed', () => {
        it('should throw an error if json is malformed', () => {
          fs.existsSync.mockReturnValue(true)
          fs.readFileSync.mockReturnValue(JSON.stringify({ hello: 'world' }))
          expect(() => {
            initState()
          }).toThrow()
        })

        it('should throw an error if file isnt json', () => {
          fs.existsSync.mockReturnValue(true)
          fs.readFileSync.mockReturnValue('something random')
          expect(() => {
            initState()
          }).toThrow()
        })
      })
      describe('state file is proper', () => {
        it('should not rewrite on initial load', () => {
          fs.existsSync.mockReturnValue(true)
          fs.readFileSync.mockReturnValue(JSON.stringify({ 123: {} }))
          initState()
          expect(fs.readFileSync).toHaveBeenCalledTimes(1)
          expect(fs.writeFileSync).toHaveBeenCalledTimes(0)
        })

        it('should read in data', () => {
          fs.existsSync.mockReturnValue(true)
          fs.readFileSync.mockReturnValue(JSON.stringify(exampleState))
          initState()
          expect(getState()).toEqual(exampleState)
        })
      })
    })
    describe('state file does not exist', () => {
      it('should initialize state.json to {}', () => {
        fs.existsSync.mockReturnValue(false)
        initState()
        expect(fs.writeFileSync).toHaveBeenCalledWith(path, '{}')
        expect(fs.writeFileSync).toHaveBeenCalledTimes(1)
      })
    })
  })
  describe('state already initialized', () => {
    beforeEach(() => {
      initState()
    })
    describe('getUsersLastCommand', () => {
      it('should return the users last command', () => {
        expect(getUsersLastCommand('123', '987')).toEqual('hello world')
        expect(getUsersLastCommand('123', '1012')).toEqual('hiya')
        expect(getUsersLastCommand('789', '420')).toEqual('bye')
      })

      it('should return undefined if guild or author not present', () => {
        expect(getUsersLastCommand('not real', '123')).toBeUndefined()
        expect(getUsersLastCommand('123', 'not real')).toBeUndefined()
      })
    })

    describe('writeUsersLastCommand', () => {
      it('should update state if guildId is new', () => {
        writeUsersLastCommand('new', '123', 'hello')
        const expectedState = {
          ...exampleState,
          new: { lastUserCommands: { 123: 'hello' } },
        }
        expect(fs.writeFileSync).toHaveBeenCalledWith(
          path,
          JSON.stringify(expectedState)
        )
        expect(fs.writeFileSync).toHaveBeenCalledTimes(1)
        expect(getState()).toEqual(expectedState)
      })

      it('should update state if authorId is new but guild isnt', () => {
        writeUsersLastCommand('123', 'new', 'hello')
        const expectedState = {
          ...exampleState,
          123: {
            lastUserCommands: {
              ...exampleState[123].lastUserCommands,
              new: 'hello',
            },
          },
        }
        expect(fs.writeFileSync).toHaveBeenCalledWith(
          path,
          JSON.stringify(expectedState)
        )
        expect(fs.writeFileSync).toHaveBeenCalledTimes(1)
        expect(getState()).toEqual(expectedState)
      })

      it('should update the users last command', () => {
        writeUsersLastCommand('123', '987', 'hello')
        const expectedState = {
          ...exampleState,
          123: {
            lastUserCommands: {
              ...exampleState[123].lastUserCommands,
              987: 'hello',
            },
          },
        }
        expect(fs.writeFileSync).toHaveBeenCalledWith(
          path,
          JSON.stringify(expectedState)
        )
        expect(fs.writeFileSync).toHaveBeenCalledTimes(1)
        expect(getState()).toEqual(expectedState)
      })
    })
  })
})
