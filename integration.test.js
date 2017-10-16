'use strict'

const fs = require('fs')
const path = require('path')
const rimraf = require('rimraf')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackPolyfillIOPlugin = require('./')

const OUTPUT_DIR = path.join(__dirname, 'dist')

const compile = (config, cb) =>
  webpack(
    {
      entry: path.join(__dirname, 'fixtures', 'index.js'),
      output: {
        path: OUTPUT_DIR,
      },
      plugins: [
        new HtmlWebpackPlugin(),
        new HtmlWebpackPolyfillIOPlugin(config),
      ],
    },
    err => {
      expect(err).toBeFalsy()
      const html = fs
        .readFileSync(path.join(OUTPUT_DIR, 'index.html'))
        .toString()
      cb(html)
    }
  )

describe('HtmlWebpackPolyfillIOPlugin', () => {
  beforeEach(done => {
    rimraf(OUTPUT_DIR, done)
  })
  describe('simple', () => {
    it('adds the polyfill script to the head', done => {
      compile(undefined, html => {
        expect(html).toMatchSnapshot()
        done()
      })
    })
  })
  describe('with configuration', () => {
    it('adds the polyfill script to the head with the configuration', done => {
      compile(
        {
          minify: true,
          features: ['default-3.6'],
          flags: 'gated',
          rum: true,
        },
        html => {
          expect(html).toMatchSnapshot()
          done()
        }
      )
    })
  })
  describe('with callback', () => {
    it('adds the polyfill script to the body and a resource hint to the head', done => {
      compile(
        {
          callback: 'ready',
          minify: true,
          features: ['default-3.6'],
          flags: 'gated',
          rum: true,
        },
        html => {
          expect(html).toMatchSnapshot()
          done()
        }
      )
    })
  })
})
