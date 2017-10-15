'use strict'

class HtmlWebpackPolyfillIOPlugin {
  constructor() {}

  apply(compiler) {
    compiler.plugin('compilation', compilation => {
      compilation.plugin('html-webpack-plugin-alter-asset-tags', (data, cb) => {
        data.head.push({
          tagName: 'script',
          closeTag: true,
          attributes: { src: 'https://cdn.polyfill.io/v2/polyfill.min.js' },
        })
        cb(null, data)
      })
    })
  }
}

module.exports = HtmlWebpackPolyfillIOPlugin
