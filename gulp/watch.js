'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');

function isOnlyChange(event) {
  return event.type === 'changed';
}

module.exports = function (options) {
  gulp.task('watch', /*['inject'],*/ function () {

    gulp.watch([
      'sass/**/*.css',
      'sass/**/*.scss'
    ], function(event) {
      if(isOnlyChange(event)) {
        gulp.start('styles');
      }
    });

    gulp.watch('js/**/*.js', function (event) {
      gulp.start('scripts:app');
      browserSync.reload(event.path);
    });

    gulp.watch('jade/**/*.jade', function (event) {
      gulp.start('templates:index');
      gulp.start('templates:views');
      browserSync.reload(event.path);
    });

    gulp.watch('static/**/*.*', function (event) {
      gulp.start('static:copy');
      browserSync.reload(event.path);
    });

    gulp.watch('server/**/*.*', function (event) {
      gulp.start('server:copy');
      browserSync.reload(event.path);
    });

  });
};
