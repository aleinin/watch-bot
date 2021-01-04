export const safeGetFirstRegexMatch = (testee: string, regex: RegExp): string | null => {
    const result = testee.match(regex)
    return result != null && result.length > 0 ? result[0] : null
}
