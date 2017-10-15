# `HtmlWebpackPolyfillIOPlugin`
[![Build Status](https://travis-ci.org/zperrault/html-webpack-polyfill-io-plugin.svg?branch=master)](https://travis-ci.org/zperrault/html-webpack-polyfill-io-plugin)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)


Use the Financial Times' [polyfill.io](https://polyfill.io/v2/docs/) service in your webpack builds with the help of the [`HtmlWebpackPlugin`](https://github.com/jantimon/html-webpack-plugin#html-webpack-plugin).

## Installation

Install the plugin with npm:

```shell
$ npm install --save-dev html-webpack-polyfill-io-plugin
```

Install the pluging with yarn:

```shell
yarn add --dev html-webpack-polyfill-io-plugin
```

## Usage

Add the plugin to your webpack configuration.

```js
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackPolyfillIOPlugin = require('html-webpack-polyfill-io-plugin')

module.exports = {
  /* ... */
  plugins: [
    new HtmlWebpackPlugin(),
    new HtmlWebpackPolyfillIOPlugin(),
  ]
}
```

## Configuration

The plugin's configuration mirrors that listed at [polyfill.io/v2/docs/api](https://polyfill.io/v2/docs/api) when possible. Documentation here is minimal to avoid duplicating the official documentation.

### (`minify`: `boolean`)

default: `true` when `NODE_ENV === 'production'`, `false` otherwise.

### (`features`: `string|Array<string>`)

Features to include. 

May be a string defining a comma separated list of features or an array of features.

### `excludes`

Features to exclude from output.

May be a string defining a comma separated list of features or an array of features.

### (`flags`: `'always'|'gated'`)

default: not set

If set, specifies whether features listed in `features` should be `gated` or `always` included.

### (`callback`: `string`)

A function to be called once the polyfill has been loaded successfully.

Must be a valid javascript identifier.

### (`unknown`: `'ignore'|'polyfill'`)

What to do when the user agent is not recognized.

### (`rum`: `boolean`)

Explicitly enable or diable [real user monitoring](https://en.wikipedia.org/wiki/Real_user_monitoring)

## Example

```js
new HtmlWebpackPolyfillIOPlugin({
  minify: true, // Always minify, even in dev
  features: [
    'Intl',
    'Map',
    'Set',
    'Array.isArray',
    'Array.prototype.find',
    'Array.prototype.some',
    'Object.assign',
    'Promise',
  ], // Features to include
  flags: 'always', // Include all specified features regardless of user-agent
  unknown: 'polyfill', // Polyfill all listed features if user-agent is unkown
  callback: 'polyfillHasLoaded',
  rum: true, // Allow real-user monitoring
})
```