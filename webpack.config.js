const path = require('path')

module.exports = {
  mode: 'production',
  entry: './index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'SketchRefernceFiles',
    libraryTarget: 'umd',
    globalObject: '(typeof self !== "undefined" ? self : this)',
  },
}
