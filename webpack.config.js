module.exports = {
  entry: {
    index: './src/index.ts'
  },
  output: {
    path: __dirname + '/lib/',
    filename: '[name].js'
  },
  
  resolve: {
    extensions: ['', '.ts', '.js']
  },
  
  module: {
    loaders: [
      { test: /\.ts$/, loader: 'ts-loader', exclude: [/node_modules/, /\.test\.ts$/, /examples/,/test/] }
    ]
  }
  
};