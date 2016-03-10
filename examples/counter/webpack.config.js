var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: [
    './vendor.ts',
    './index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.NoErrorsPlugin()
  ],
  resolve: {
    extensions: ['', '.js', '.ts'],
    fallback: __dirname + '/../../node_modules',
    alias: {
      angular2$: __dirname + '/../../node_modules/angular2'
    }
  },
  module: {
    loaders: [
      { test: /\.ts$/,  loader: 'ts-loader', exclude: /node_modules/ },
      { test: /\.js$/,  loader: 'babel', exclude: /node_modules/ }
    ]
  },
  noParse: [
    /rtts_assert\/src\/rtts_assert/
  ]
};
