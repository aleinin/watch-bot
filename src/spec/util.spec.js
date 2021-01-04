import {safeGetFirstRegexMatch} from "../util"

describe('safeGetFirstRegexMatch', () => {
    it('should return null if there is no match', () => {
        expect(safeGetFirstRegexMatch('this', /that/)).toBeNull()
    })

    it ('should return the match if there is one result', () => {
        expect(safeGetFirstRegexMatch('this', /this/)).toEqual('this')
    })
})
