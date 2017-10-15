'use strict'

class HtmlWebpackPolyfillIOPlugin {
  constructor(options = {}) {
    this.options = {}

    this.options.minify =
      options.minify !== undefined
        ? options.minify
        : process.env.NODE_ENV === 'production' ? true : false

    if (options.features)
      this.options.features = Array.isArray(options.features)
        ? options.features.join(',')
        : options.features

    if (options.excludes)
      this.options.excludes = Array.isArray(options.excludes)
        ? options.excludes.join(',')
        : options.excludes

    if (options.flags) {
      if (!['always', 'gated'].includes(options.flags))
        throw new TypeError(
          `option 'flags' must be one of ['always', 'gated']. Received: '${options.flags}'`
        )

      this.options.flags = options.flags
    }

    if (options.callback) {
      if (!/^[\w\.]+$/.test(options.callback))
        throw new TypeError(
          `option 'callback' must match regular expression "^[\w\.]+$". Received: '${options.callback}'`
        )

      this.options.callback = options.callback
    }

    if (options.unknown) {
      if (!['ignore', 'polyfill'].includes(options.unknown))
        throw new TypeError(
          `option 'unknown' must be one of ['ignore', 'polyfill']. Received '${options.unknown}'`
        )

      this.options.unknown = options.unknown
    }

    if (options.rum !== undefined) {
      this.options.rum = Boolean(options.rum)
    }
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

  buildAttributes() {
    const attrs = {}

    attrs.src = this.buildSrc()
    if (this.options.callback) attrs.async = true

    return attrs
  }

  buildTag() {
    return {
      tagName: 'script',
      close: true,
      attributes: this.buildAttributes(),
    }
  }

  apply(compiler) {
    compiler.plugin('compilation', compilation => {
      compilation.plugin('html-webpack-plugin-alter-asset-tags', (data, cb) => {
        const tag = this.buildTag()
        data.head.push(tag)
        cb(null, data)
      })
    })
  }
}

module.exports = HtmlWebpackPolyfillIOPlugin
