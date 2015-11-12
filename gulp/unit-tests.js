'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep');
var karma = require('karma');
var concat = require('concat-stream');
var _ = require('lodash');
var path = require('path');

module.exports = function(options) {
  function listFiles(callback) {
    var wiredepOptions = _.extend({}, options.wiredep, {
      dependencies: true,
      devDependencies: true
    });
    var bowerDeps = wiredep(wiredepOptions);

    var specFiles = [
      'js/**/*.spec.js',
      'js/**/*.mock.js'
    ];

    var htmlFiles = [
      'dist/**/*.html'
    ];

    var srcFiles = [
      'js/**/*.js'
    ].concat(specFiles.map(function(file) {
      return '!' + file;
    }));

    gulp.src(srcFiles)
      .pipe(concat(function (files) {
        callback([]
          .concat(bowerDeps.js)
          .concat(_.pluck(files, 'path'))
          .concat(htmlFiles)
          .concat(specFiles)
          .concat(['js/custom/custom.module.js']));
      }));
  }

  function runTests (singleRun, done) {
    listFiles(function(files) {
      console.log(files);
      karma.server.start({
        configFile: __dirname + '/../karma.conf.js',
        files: files,
        singleRun: singleRun,
        autoWatch: !singleRun
      }, done);
    });
  }

  gulp.task('test', ['templates:index', 'templates:views'], function(done) {
    runTests(true, done);
  });
  gulp.task('test:auto', ['watch'], function(done) {
    runTests(false, done);
  });
};
