import runFnInFiberContext from '../src/runFnInFiberContext'

beforeAll(() => {
    if (!global.browser) {
        global.browser = {}
    }
})

test('should wrap a successful running command', async () => {
    global.browser._NOT_FIBER = true
    const wrappedFn = runFnInFiberContext(function (arg) {
        return this.scopedVar + arg
    })

    expect(await wrappedFn.call({ scopedVar: 'foo' }, 'bar')).toBe('foobar')
    expect(global.browser._NOT_FIBER).toBe(undefined)
})

test('should wrap a failing running command', async () => {
    global.browser._NOT_FIBER = true
    const wrappedFn = runFnInFiberContext(function (arg) {
        throw new Error(this.scopedVar + arg)
    })

    await expect(wrappedFn.call({ scopedVar: 'foo' }, 'bar'))
        .rejects.toThrow(new Error('foobar'))
    expect(global.browser._NOT_FIBER).toBe(undefined)
})
