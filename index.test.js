'use strict'
const HtmlWebpackPolyfillIOPlugin = require('./index')

describe('HtmlWebpackPolyfillIOPlugin', () => {
  describe('configuration', () => {
    describe('minify', () => {
      describe('not set', () => {
        describe('process.env.NODE_ENV === "production"', () => {
          let env
          beforeAll(() => {
            env = process.env.NODE_ENV
            process.env.NODE_ENV = 'production'
          })
          afterAll(() => {
            process.env.NODE_ENV = env
          })

          it('defaults to true', () => {
            const { options } = new HtmlWebpackPolyfillIOPlugin()
            expect(options.minify).toBe(true)
          })
        })
        describe('process.env.NODE_ENV !== "production"', () => {
          let env
          beforeAll(() => {
            env = process.env.NODE_ENV
            process.env.NODE_ENV = 'development'
          })
          afterAll(() => {
            process.env.NODE_ENV = env
          })
          it('defaults to false', () => {
            const { options } = new HtmlWebpackPolyfillIOPlugin()
            expect(options.minify).toBe(false)
          })
        })
      })
      describe('set', () => {
        it('is defined as the value passed', () => {
          const { options: t } = new HtmlWebpackPolyfillIOPlugin({
            minify: true,
          })
          const { options: f } = new HtmlWebpackPolyfillIOPlugin({
            minify: false,
          })
          expect(t.minify).toBe(true)
          expect(f.minify).toBe(false)
        })
      })
    })
    describe('features', () => {
      describe('passed a string', () => {
        it('uses the passed string', () => {
          const { options } = new HtmlWebpackPolyfillIOPlugin({
            features: 'Array.isArray,Array.prototype.some',
          })
          expect(options.features).toBe('Array.isArray,Array.prototype.some')
        })
      })
      describe('passed an array', () => {
        it('joins the features with commas', () => {
          const { options } = new HtmlWebpackPolyfillIOPlugin({
            features: ['Array.isArray', 'Array.prototype.some'],
          })
          expect(options.features).toBe('Array.isArray,Array.prototype.some')
        })
      })
      describe('passed a single element array', () => {
        it('is only the single feature', () => {
          const { options } = new HtmlWebpackPolyfillIOPlugin({
            features: ['Array.isArray'],
          })
          expect(options.features).toBe('Array.isArray')
        })
      })
    })
    describe('exludes', () => {
      describe('passed a string', () => {
        it('uses the passed string', () => {
          const { options } = new HtmlWebpackPolyfillIOPlugin({
            excludes: 'Array.isArray,Array.prototype.some',
          })
          expect(options.excludes).toBe('Array.isArray,Array.prototype.some')
        })
      })
      describe('passed an array', () => {
        it('joins the excludes with commas', () => {
          const { options } = new HtmlWebpackPolyfillIOPlugin({
            excludes: ['Array.isArray', 'Array.prototype.some'],
          })
          expect(options.excludes).toBe('Array.isArray,Array.prototype.some')
        })
      })
      describe('passed a single element array', () => {
        it('is only the single feature', () => {
          const { options } = new HtmlWebpackPolyfillIOPlugin({
            excludes: ['Array.isArray'],
          })
          expect(options.excludes).toBe('Array.isArray')
        })
      })
    })
    describe('flags', () => {
      describe('always', () => {
        it('sets flags to always', () => {
          const { options } = new HtmlWebpackPolyfillIOPlugin({
            flags: 'always',
          })
          expect(options.flags).toBe('always')
        })
      })
      describe('gated', () => {
        it('sets flags to gated', () => {
          const { options } = new HtmlWebpackPolyfillIOPlugin({
            flags: 'gated',
          })
          expect(options.flags).toBe('gated')
        })
      })
      describe('other', () => {
        it('throws an error describing the misconfiguration', () => {
          expect(() => {
            new HtmlWebpackPolyfillIOPlugin({
              flags: 'other',
            })
          }).toThrowErrorMatchingSnapshot()
        })
      })
    })
    describe('callback', () => {
      describe('valid callback name', () => {
        it('sets the value', () => {
          const { options } = new HtmlWebpackPolyfillIOPlugin({
            callback: 'ready',
          })
          expect(options.callback).toBe('ready')
        })
      })
      describe('invalid callback name', () => {
        it('throws an error describing the misconfiguration', () => {
          expect(() => {
            new HtmlWebpackPolyfillIOPlugin({
              callback: 'invalid callback name',
            })
          }).toThrowErrorMatchingSnapshot()
        })
      })
    })
    describe('unknown', () => {
      describe('ignore', () => {
        it("sets to 'ignore'", () => {
          const { options } = new HtmlWebpackPolyfillIOPlugin({
            unknown: 'ignore',
          })
          expect(options.unknown).toBe('ignore')
        })
      })
      describe('polyfill', () => {
        it("sets to 'polyfill'", () => {
          const { options } = new HtmlWebpackPolyfillIOPlugin({
            unknown: 'polyfill',
          })
          expect(options.unknown).toBe('polyfill')
        })
      })
      describe('other', () => {
        it('throws an error describing the misconfiguration', () => {
          expect(() => {
            new HtmlWebpackPolyfillIOPlugin({ unknown: 'other' })
          }).toThrowErrorMatchingSnapshot()
        })
      })
    })
    describe('rum', () => {
      describe('true', () => {
        it('sets rum true', () => {
          const { options } = new HtmlWebpackPolyfillIOPlugin({ rum: true })
          expect(options.rum).toBe(true)
        })
      })
      describe('false', () => {
        it('sets rum false', () => {
          const { options } = new HtmlWebpackPolyfillIOPlugin({ rum: false })
          expect(options.rum).toBe(false)
        })
      })
    })
  })
})
