import { Snowflake } from 'discord-api-types/globals'
import fs from 'fs'
import cloneDeep from 'lodash.clonedeep'

export interface GlobalState {
  [guildId: Snowflake]: GuildState
}

export interface GuildState {
  lastUserCommands?: UsersLastCommand
}

export interface UsersLastCommand {
  [userId: Snowflake]: string
}

class State {
  private _state: GlobalState
  private readonly path = './state.json'
  private readonly initialGlobalState = {}
  private get state() {
    return cloneDeep(this._state)
  }
  private set state(newState: GlobalState) {
    this._state = cloneDeep(newState)
  }
  constructor() {
    this._state = {}
    if (fs.existsSync(this.path)) {
      this.state = this.readState()
    } else {
      this.writeState(this.initialGlobalState)
    }
  }

  getState() {
    return this.state
  }

  writeState(state: GlobalState) {
    if (this.isGlobalState(state)) {
      fs.writeFileSync(this.path, JSON.stringify(state))
      this.state = state
    } else {
      console.error('Bad State, ignoring')
      console.error(JSON.stringify(state))
    }
  }

  private isGlobalState(file: object) {
    if (Object.keys(file).length === 0) {
      return true
    }
    return Object.entries(file).every(
      ([key, value]) => typeof key === 'string' && typeof value === 'object'
    )
  }

  private readState(): GlobalState {
    try {
      const readState = JSON.parse(fs.readFileSync(this.path).toString())
      if (!this.isGlobalState(readState)) {
        throw new Error()
      }
      return readState
    } catch (e) {
      throw new Error(`${this.path} exists, but is malformed.`)
    }
  }
}

let appState: State

const checkState = () => {
  if (appState == null) {
    throw new Error('State not initialized')
  }
}

export const initState = () => {
  appState = new State()
}

export const getState = () => {
  checkState()
  return appState.getState()
}

export const getUsersLastCommand = (
  guildId: string,
  authorId: string
): string | undefined => {
  checkState()
  const guildUserCommands = appState.getState()[guildId]?.lastUserCommands
  if (guildUserCommands == null) {
    return undefined
  }
  return guildUserCommands[authorId]
}
export const writeUsersLastCommand = (
  guildId: string,
  authorId: string,
  content: string
) => {
  checkState()
  const state = appState.getState()

  appState.writeState({
    ...state,
    [guildId]: {
      ...state[guildId],
      lastUserCommands: {
        ...state[guildId]?.lastUserCommands,
        [authorId]: content,
      },
    },
  })
}
