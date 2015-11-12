'use strict';

var awspublish = require('gulp-awspublish');
var gulp = require('gulp');
var rename = require('gulp-rename');

module.exports = function(options) {
  gulp.task('upload', ['clean','build'], function(done) {

    var folderName = 'snapshot';
    if(process.env.BRANCH) {
      folderName = process.env.BRANCH;
    }

    if(folderName.lastIndexOf('/') >= 0) {
      folderName = folderName.slice(folderName.lastIndexOf('/') + 1);
    }

    var publisher = awspublish.create({
      params: {
        Bucket: 'bancaplus-web'
      },
      "accessKeyId": process.env.AWS_KEY,
      "secretAccessKey": process.env.AWS_SECRET
    });

    gulp.src('**/*', { cwd: 'dist' })
      .pipe(rename(function(path){
        path.dirname = folderName + '/' + path.dirname;
      }))
      .pipe(publisher.publish())
      .pipe(awspublish.reporter())
      .on('end', done);
  });
};
