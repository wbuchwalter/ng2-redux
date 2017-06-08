require('core-js/es7/reflect');
require('zone.js/dist/zone-node.js');
require('zone.js/dist/long-stack-trace-zone.js');
require('zone.js/dist/proxy.js');
require('zone.js/dist/sync-test.js');
require('zone.js/dist/async-test.js');
require('zone.js/dist/fake-async-test.js');
// require('./src/index');
// require('./testing/index');
var Jasmine = require('jasmine');
var runner = new Jasmine();
global.jasmine = runner.jasmine;
require('zone.js/dist/jasmine-patch.js');
var getTestBed = require('@angular/core/testing').getTestBed;
var _a = require('@angular/platform-server/testing'), ServerTestingModule = _a.ServerTestingModule, platformServerTesting = _a.platformServerTesting;
getTestBed().initTestEnvironment(ServerTestingModule, platformServerTesting());
runner.loadConfig({
    spec_dir: '.',
    spec_files: ['**/*.spec.ts']
});
runner.execute();
