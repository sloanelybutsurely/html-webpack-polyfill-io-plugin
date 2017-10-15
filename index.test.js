'use strict'
const fs = require('fs')
const path = require('path')
const rimraf = require('rimraf')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackPolyfillIOPlugin = require('./index')

const OUTPUT_DIR = path.join(__dirname, 'dist')

describe('HtmlWebpackPolyfillIOPlugin', () => {
  beforeEach(done => {
    rimraf(OUTPUT_DIR, done)
  })
  it('adds the polyfill.io script to the html page', done => {
    const compiler = webpack(
      {
        entry: path.join(__dirname, 'fixtures', 'index.js'),
        output: { path: OUTPUT_DIR },
        plugins: [new HtmlWebpackPlugin(), new HtmlWebpackPolyfillIOPlugin()],
      },
      err => {
        expect(err).toBeFalsy()
        const html = fs
          .readFileSync(path.join(OUTPUT_DIR, 'index.html'))
          .toString()
        expect(html).toMatchSnapshot()
        done()
      }
    )
  })
})
