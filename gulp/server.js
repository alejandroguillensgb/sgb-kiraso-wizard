'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var browserSyncSpa = require('browser-sync-spa');

var util = require('util');

var middleware = require('./proxy');

module.exports = function(options) {

  function browserSyncInit(baseDir, browser) {
    browser = browser === undefined ? 'default' : browser;

    var routes = {
      '/bower_components': 'bower_components',
      '/server': 'server',
      '/app/i18n': 'static/i18n',
      '/app/img': 'static/img'
    };

    var server = {
      baseDir: baseDir,
      routes: routes
    };

    if(middleware.length > 0) {
      server.middleware = middleware;
    }

    browserSync.instance = browserSync.init({
      startPath: '/',
      server: server,
      browser: browser
    });
  }

  browserSync.use(browserSyncSpa({
    selector: '[ng-app]'// Only needed for angular apps
  }));

  gulp.task('serve', ['default', 'watch'], function () {
    browserSyncInit('dist');
  });

  gulp.task('serve:dist', ['build'], function () {
    browserSyncInit(options.dist);
  });
};
