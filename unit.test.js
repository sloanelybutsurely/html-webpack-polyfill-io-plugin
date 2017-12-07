'use strict'

const url = require('url')
const qs = require('qs')
const HtmlWebpackPolyfillIOPlugin = require('./')

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
            const options = new HtmlWebpackPolyfillIOPlugin().options
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
            const options = new HtmlWebpackPolyfillIOPlugin().options
            expect(options.minify).toBe(false)
          })
        })
      })
      describe('set', () => {
        it('is defined as the value passed', () => {
          const t = new HtmlWebpackPolyfillIOPlugin({ minify: true }).options
          const f = new HtmlWebpackPolyfillIOPlugin({ minify: false }).options
          expect(t.minify).toBe(true)
          expect(f.minify).toBe(false)
        })
      })
    })
    describe('features', () => {
      describe('passed a string', () => {
        it('uses the passed string', () => {
          const options = new HtmlWebpackPolyfillIOPlugin({
            features: 'Array.isArray,Array.prototype.some',
          }).options
          expect(options.features).toBe('Array.isArray,Array.prototype.some')
        })
      })
      describe('passed an array', () => {
        it('joins the features with commas', () => {
          const options = new HtmlWebpackPolyfillIOPlugin({
            features: ['Array.isArray', 'Array.prototype.some'],
          }).options
          expect(options.features).toBe('Array.isArray,Array.prototype.some')
        })
      })
      describe('passed a single element array', () => {
        it('is only the single feature', () => {
          const options = new HtmlWebpackPolyfillIOPlugin({
            features: ['Array.isArray'],
          }).options
          expect(options.features).toBe('Array.isArray')
        })
      })
    })
    describe('exludes', () => {
      describe('passed a string', () => {
        it('uses the passed string', () => {
          const options = new HtmlWebpackPolyfillIOPlugin({
            excludes: 'Array.isArray,Array.prototype.some',
          }).options
          expect(options.excludes).toBe('Array.isArray,Array.prototype.some')
        })
      })
      describe('passed an array', () => {
        it('joins the excludes with commas', () => {
          const options = new HtmlWebpackPolyfillIOPlugin({
            excludes: ['Array.isArray', 'Array.prototype.some'],
          }).options
          expect(options.excludes).toBe('Array.isArray,Array.prototype.some')
        })
      })
      describe('passed a single element array', () => {
        it('is only the single feature', () => {
          const options = new HtmlWebpackPolyfillIOPlugin({
            excludes: ['Array.isArray'],
          }).options
          expect(options.excludes).toBe('Array.isArray')
        })
      })
    })
    describe('flags', () => {
      describe('always', () => {
        it('sets flags to always', () => {
          const options = new HtmlWebpackPolyfillIOPlugin({
            flags: 'always',
          }).options
          expect(options.flags).toBe('always')
        })
      })
      describe('gated', () => {
        it('sets flags to gated', () => {
          const options = new HtmlWebpackPolyfillIOPlugin({
            flags: 'gated',
          }).options
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
          const options = new HtmlWebpackPolyfillIOPlugin({
            callback: 'ready',
          }).options
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
          const options = new HtmlWebpackPolyfillIOPlugin({
            unknown: 'ignore',
          }).options
          expect(options.unknown).toBe('ignore')
        })
      })
      describe('polyfill', () => {
        it("sets to 'polyfill'", () => {
          const options = new HtmlWebpackPolyfillIOPlugin({
            unknown: 'polyfill',
          }).options
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
          const options = new HtmlWebpackPolyfillIOPlugin({ rum: true }).options
          expect(options.rum).toBe(true)
        })
      })
      describe('false', () => {
        it('sets rum false', () => {
          const options = new HtmlWebpackPolyfillIOPlugin({ rum: false })
            .options
          expect(options.rum).toBe(false)
        })
      })
    })
    describe('useBody', () => {
      describe('true', () => {
        it('sets useBody true', () => {
          const options = new HtmlWebpackPolyfillIOPlugin({ useBody: true }).options
          expect(options.useBody).toBe(true)
        })
      })
      describe('false', () => {
        it('sets useBody false', () => {
          const options = new HtmlWebpackPolyfillIOPlugin({ useBody: false })
            .options
          expect(options.useBody).toBe(false)
        })
      })
      describe('default', () => {
        it('should be false', () => {
          const options = new HtmlWebpackPolyfillIOPlugin().options
          expect(options.useBody).toBe(false)
        })
      })
    })
  })

  describe('buildSrc', () => {
    const plugin = new HtmlWebpackPolyfillIOPlugin()
    it('builds a polyfill url', () => {
      expect(plugin.buildSrc()).toBe('https://cdn.polyfill.io/v2/polyfill.js')
    })

    describe('minify', () => {
      describe('true', () => {
        beforeAll(() => (plugin.options.minify = true))
        it('targets the minified script', () => {
          expect(plugin.buildSrc()).toBe(
            'https://cdn.polyfill.io/v2/polyfill.min.js'
          )
        })
      })
      describe('false', () => {
        beforeAll(() => (plugin.options.minify = false))
        it('targets the non-minified script', () => {
          expect(plugin.buildSrc()).toBe(
            'https://cdn.polyfill.io/v2/polyfill.js'
          )
        })
      })
    })
    describe('features', () => {
      describe('not set', () => {
        beforeAll(() => {
          delete plugin.options.features
        })
        it('does not set features in the query string', () => {
          const src = url.parse(plugin.buildSrc())
          expect(qs.parse(src.query).features).not.toBeDefined()
        })
      })
      describe('set', () => {
        const features =
          'Array.prototype.find,Array.prototype.some,Array.isArray'
        beforeAll(() => {
          plugin.options.features = features
        })
        it('sets features in the query string', () => {
          const src = url.parse(plugin.buildSrc())
          expect(qs.parse(src.query).features).toBe(features)
        })
      })
    })
    describe('excludes', () => {
      describe('not set', () => {
        beforeAll(() => {
          delete plugin.options.excludes
        })
        it('does not set excludes in the query string', () => {
          const src = url.parse(plugin.buildSrc())
          expect(qs.parse(src.query).excludes).not.toBeDefined()
        })
      })
      describe('set', () => {
        const excludes =
          'Array.prototype.find,Array.prototype.some,Array.isArray'
        beforeAll(() => {
          plugin.options.excludes = excludes
        })
        it('sets excludes in the query string', () => {
          const src = url.parse(plugin.buildSrc())
          expect(qs.parse(src.query).excludes).toBe(excludes)
        })
      })
    })
    describe('flags', () => {
      describe('not set', () => {
        beforeAll(() => {
          delete plugin.options.flags
        })
        it('does not set flags in the query string', () => {
          const src = url.parse(plugin.buildSrc())
          expect(qs.parse(src.query).flags).not.toBeDefined()
        })
      })
      describe('set', () => {
        const flags = 'always'
        beforeAll(() => {
          plugin.options.flags = flags
        })
        it('sets flags in the query string', () => {
          const src = url.parse(plugin.buildSrc())
          expect(qs.parse(src.query).flags).toBe(flags)
        })
      })
    })
    describe('callback', () => {
      describe('not set', () => {
        beforeAll(() => {
          delete plugin.options.callback
        })
        it('does not set callback in the query string', () => {
          const src = url.parse(plugin.buildSrc())
          expect(qs.parse(src.query).callback).not.toBeDefined()
        })
      })
      describe('set', () => {
        const callback = 'always'
        beforeAll(() => {
          plugin.options.callback = callback
        })
        it('sets callback in the query string', () => {
          const src = url.parse(plugin.buildSrc())
          expect(qs.parse(src.query).callback).toBe(callback)
        })
      })
    })
    describe('unknown', () => {
      describe('not set', () => {
        beforeAll(() => {
          delete plugin.options.unknown
        })
        it('does not set unknown in the query string', () => {
          const src = url.parse(plugin.buildSrc())
          expect(qs.parse(src.query).unknown).not.toBeDefined()
        })
      })
      describe('set', () => {
        const unknown = 'polyfill'
        beforeAll(() => {
          plugin.options.unknown = unknown
        })
        it('sets unknown in the query string', () => {
          const src = url.parse(plugin.buildSrc())
          expect(qs.parse(src.query).unknown).toBe(unknown)
        })
      })
    })
    describe('rum', () => {
      describe('not set', () => {
        beforeAll(() => {
          delete plugin.options.rum
        })
        it('does not set rum in the query string', () => {
          const src = url.parse(plugin.buildSrc())
          expect(qs.parse(src.query).rum).not.toBeDefined()
        })
      })
      describe('true', () => {
        const rum = true
        beforeAll(() => {
          plugin.options.rum = rum
        })
        it('sets rum in the query', () => {
          const src = url.parse(plugin.buildSrc())
          expect(qs.parse(src.query).rum).toBe('1')
        })
      })
      describe('false', () => {
        const rum = false
        beforeAll(() => {
          plugin.options.rum = rum
        })
        it('sets rum in the query', () => {
          const src = url.parse(plugin.buildSrc())
          expect(qs.parse(src.query).rum).toBe('0')
        })
      })
    })
  })
  describe('buildScriptAttrs', () => {
    const plugin = new HtmlWebpackPolyfillIOPlugin()
    describe('src', () => {
      beforeEach(() => {
        jest
          .spyOn(plugin, 'buildSrc')
          .mockReturnValueOnce('https://cdn.polyfill.io/v2/polyfill.min.js')
      })
      it('calls buildSrc and uses the returned value', () => {
        const attrs = plugin.buildScriptAttrs()
        expect(plugin.buildSrc).toHaveBeenCalledTimes(1)
        expect(attrs.src).toBe('https://cdn.polyfill.io/v2/polyfill.min.js')
      })
    })
    describe('async', () => {
      describe('callback not set', () => {
        it('is not defined', () => {
          expect(plugin.buildScriptAttrs().async).not.toBeDefined()
        })
      })
      describe('callback set', () => {
        beforeAll(() => {
          plugin.options.callback = 'foobar'
        })
        afterAll(() => {
          delete plugin.options.callback
        })
        it('is true', () => {
          expect(plugin.buildScriptAttrs().async).toBe(true)
        })
      })
    })
  })
  describe('buildScriptTag', () => {
    const plugin = new HtmlWebpackPolyfillIOPlugin()
    describe('tagName', () => {
      it("is 'script'", () => {
        expect(plugin.buildScriptTag().tagName).toBe('script')
      })
    })
    describe('closeTag', () => {
      it('is true', () => {
        expect(plugin.buildScriptTag().closeTag).toBe(true)
      })
    })
    describe('attributes', () => {
      const attributes = { src: 'https://cdn.polyfill.io/v2/polyfill.min.js' }
      beforeEach(() => {
        jest.spyOn(plugin, 'buildScriptAttrs').mockReturnValueOnce(attributes)
      })
      it("calls 'buildScriptAttrs' and uses the returned value", () => {
        const tag = plugin.buildScriptTag()
        expect(tag.attributes).toBe(attributes)
        expect(plugin.buildScriptAttrs).toHaveBeenCalledTimes(1)
      })
    })
  })
})
