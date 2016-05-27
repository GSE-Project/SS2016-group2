var path = require('path'),
  karma = require('karma').server,
  tsLint = require('gulp-tslint');

module.exports = {
  karma: function (done) {
    karma.start({
      configFile: path.resolve('test/karma.config.js'),
      singleRun: true
    }, function (exitCode) {
      done(exitCode);
    });
  },
  karmaDebug: function (done) {
    karma.start({
      configFile: path.resolve('test/karma.config.js'),
      singleRun: false,
      browsers: ['Chrome']
    }, function (exitCode) {
      done(exitCode);
    })
  }
}