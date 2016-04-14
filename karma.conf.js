module.exports = function(config) {
  config.set({
    
    frameworks: ['jasmine'],
    
    files: ['./src/tests.entry.ts'],

    preprocessors: {
      './src/**/*.ts': ['webpack'],
      
    },

    webpack: {
      entry: './src/tests.entry.ts',
      verbose: true,
      resolve: {
        extensions: ['', '.ts', '.js', '.css'],
      },
      module: {
        loaders: [
          { test: /\.ts$/, loader: 'ts', exclude: /node_modules/}
        ]
      },
      stats: { colors: true, reasons: true },
      debug: true
    },

    webpackServer: {
      noInfo: true
    },

    reporters: ['spec'],
    
    port: 9999,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    captureTimeout: 6000,
    singleRun: true
  })
}