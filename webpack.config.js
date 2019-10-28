const path = require('path')

module.exports = {
  mode: 'production',
  entry: './index.ts',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'SketchReferenceFiles',
    libraryTarget: 'umd',
    globalObject: '(typeof self !== "undefined" ? self : this)',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts'],
  },
  stats: {
    warnings: false,
  },
}
