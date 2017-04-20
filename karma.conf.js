module.exports = function(config) {
  config.set({
    frameworks: ['jasmine', 'karma-typescript'],
    files: [
      { pattern: 'src/base.spec.ts' },
      { pattern: 'src/**/*.ts' },
    ],
    preprocessors: {
      '**/*.ts': ['karma-typescript'],
    },
    karmaTypescriptConfig: {
      bundlerOptions: {
        entrypoints: /\.spec\.ts$/,
        transforms: [
          require('karma-typescript-angular2-transform'),
        ],
      },
      compilerOptions: {
        lib: ['ES2015', 'DOM'],
      },
      coverageOptions: {
        instrumentation: true
      }
    },
    reporters: ['progress', 'karma-typescript'],
    browsers: ['Chrome'],
  });
};
