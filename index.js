'use strict'

class HtmlWebpackPolyfillIOPlugin {
  constructor() {}

  apply(compiler) {
    compiler.plugin('compilation', compilation => {
      compilation.plugin('html-webpack-plugin-alter-asset-tags', (data, cb) => {
        const src =
          process.env.NODE_ENV === 'production'
            ? 'https://cdn.polyfill.io/v2/polyfill.min.js'
            : 'https://cdn.polyfill.io/v2/polyfill.js'
        data.head.push({
          tagName: 'script',
          closeTag: true,
          attributes: { src },
        })
        cb(null, data)
      })
    })
  }
}

module.exports = HtmlWebpackPolyfillIOPlugin
