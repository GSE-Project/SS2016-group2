var path = require('path'),
  karma = require('karma').server,
  tsLint = require('gulp-tslint');

module.exports = {
  karma: function (done) {
    karma.start({
      configFile: path.resolve('test/karma.config.js'),
      singleRun: true
    }, function () {
      done();
    });
  },
  karmaDebug: function (done) {
    karma.start({
      configFile: path.resolve('test/karma.config.js'),
      singleRun: false,
      browsers: ['Chrome']
    }, function () {
      done();
    })
  },
  lint: function () {
    return gulp.src(join('**/*.ts'))
      .pipe(tslint())
      .pipe(tslint.report('verbose'));
  }
}