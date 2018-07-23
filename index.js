'use strict'

const isDefined = x => x !== undefined
const stringOrArray = x => (Array.isArray(x) ? x.join(',') : x)
const isInArray = (name, allowed, value) => {
  if (allowed.indexOf(value) === -1) {
    throw new TypeError(
      `option '${name}' must be one of [${allowed
        .map(s => `'${s}'`)
        .join(', ')}]. Received: '${value}'`
    )
  }
  return value
}
const matchesRegExp = (name, regexp, value) => {
  if (!regexp.test(value)) {
    throw new TypeError(
      `option '${name}' must match regular expression '${regexp}'. Received: '${value}'`
    )
  }
  return value
}

class HtmlWebpackPolyfillIOPlugin {
  constructor(options) {
    options = options || {}
    this.options = {}

    this.options.minify = isDefined(options.minify)
      ? options.minify
      : process.env.NODE_ENV === 'production' ? true : false

    if (isDefined(options.features))
      this.options.features = stringOrArray(options.features)

    if (isDefined(options.excludes))
      this.options.excludes = stringOrArray(options.excludes)

    if (isDefined(options.flags))
      this.options.flags = isInArray(
        'flags',
        ['always', 'gated'],
        options.flags
      )

    if (isDefined(options.callback))
      this.options.callback = matchesRegExp(
        'callback',
        /^[\w\.]+$/,
        options.callback
      )

    if (isDefined(options.unknown))
      this.options.unknown = isInArray(
        'unknown',
        ['ignore', 'polyfill'],
        options.unknown
      )

    if (isDefined(options.rum)) this.options.rum = Boolean(options.rum)
  }

  buildSrc() {
    const base = 'https://cdn.polyfill.io/v2/polyfill.'
    const postfix = this.options.minify ? 'min.js' : 'js'

    const options = []

    if (this.options.features)
      options.push(['features', this.options.features].join('='))
    if (this.options.excludes)
      options.push(['excludes', this.options.excludes].join('='))
    if (this.options.flags)
      options.push(['flags', this.options.flags].join('='))
    if (this.options.callback)
      options.push(['callback', this.options.callback].join('='))
    if (this.options.unknown)
      options.push(['unknown', this.options.unknown].join('='))
    if (this.options.rum !== undefined)
      options.push(['rum', +this.options.rum].join('='))

    return [`${base}${postfix}`, options.join('&')].filter(Boolean).join('?')
  }

  buildScriptAttrs() {
    const attrs = {}

    attrs.src = this.buildSrc()
    if (this.options.callback) attrs.async = true

    return attrs
  }

  buildScriptTag() {
    return {
      tagName: 'script',
      closeTag: true,
      attributes: this.buildScriptAttrs(),
    }
  }

  buildHintTag() {
    return {
      tagName: 'link',
      attributes: {
        href: this.buildSrc(),
        type: 'preload',
        as: 'script',
      },
    }
  }

  apply(compiler) {
    compiler.plugin('compilation', compilation => {
      compilation.plugin('html-webpack-plugin-alter-asset-tags', (data, cb) => {
        const script = this.buildScriptTag()
        if (this.options.callback) {
          const hint = this.buildHintTag()
          data.head.push(hint)
          data.body.unshift(script)
        } else {
          data.head.push(script)
        }

        if (cb && typeof cb === 'function') {
         cb(null, data)
        }
      })
    })
  }
}

module.exports = HtmlWebpackPolyfillIOPlugin
