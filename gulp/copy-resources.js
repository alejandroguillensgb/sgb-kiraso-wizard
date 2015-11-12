'use strict';

var gulp = require('gulp');
var path = require('path');

module.exports = function (options) {

  gulp.task('copyResources', function (done) {
    gulp.src('static/i18n/**')
      .pipe(gulp.dest(path.join(options.dist, 'app', 'i18n')))
      .on('end', function () {
        gulp.src('static/img/**')
          .pipe(gulp.dest(path.join(options.dist, 'app', 'img')))
          .on('end', function () {
            gulp.src('server/**')
              .pipe(gulp.dest(path.join(options.dist, 'server')))
              .on('end', done);
          });
      });
  });
};
