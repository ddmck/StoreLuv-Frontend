var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var rev = require('gulp-rev');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var autoprefixer = require('gulp-autoprefixer');
var stdlib = require('./stdlib');
var packaged = require('./build/js/packaged');
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');
var s3 = require("gulp-s3");
var fs = require('fs');
var aws = JSON.parse(fs.readFileSync('./aws.json'));
var mocha = require('gulp-mocha');
var rename = require("gulp-rename");


var onError = function (err) {
  gutil.beep();
  console.log(err);
};

gulp.task('sass', function() {
  gulp.src('src/scss/app.scss')
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(sass())
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 9', 'opera 12.1'))
    .pipe(gulp.dest('./build/css'))
    .pipe(connect.reload());
});

gulp.task('scripts', function() {
    // Single entry point to browserify
    gulp.src('src/js/app.js')
      .pipe(plumber({
        errorHandler: onError
      }))
      // .pipe(browserify({
      //   transform: [browserifyHandlebars],
      //   insertGlobals : true,
      //   debug : !gulp.env.production
      // }))
      // .pipe(uglify())
      .pipe(gulp.dest('./build/js'))
      .pipe(connect.reload());
});

gulp.task('lib', function(){
  return gulp.src(stdlib.files)
    .pipe(concat('lib.js'))
    .pipe(gulp.dest('./build/js/'));
});

gulp.task('rev', ['sass', 'scripts'], function() {
  return gulp.src(['build/**/*.css', 'build/min/**/*.js'])
    .pipe(rev())
    .pipe(gulp.dest('dist'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('dist'));
});

gulp.task('min', function(){
  return gulp.src(packaged.files)
    .pipe(concat('packaged-app.js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify({mangle: false}))
    .pipe(gulp.dest('build/min/'));
});

gulp.task('site', function(){
  gulp.src('src/index.html').pipe(gulp.dest('build/'));
  gulp.src('src/partials/*').pipe(gulp.dest('build/partials/'));
});

gulp.task('watch', ['sass', 'scripts', 'lib', 'min'], function() {
  gulp.watch('src/scss/**/*.scss', ['sass']);
  gulp.watch('src/js/**/*.*', ['scripts', 'min']);
  gulp.watch(['src/index.html', 'src/partials/*'], ['site']);
  gulp.watch('./stdlib.js', ['lib', 'min']);
  // gulp.watch()
});

gulp.task('connect', function() {
  connect.server({
    root: 'build',
    livereload: {
      enabled: true,
      port: 35727
    },
    port: 8000
  });
});

gulp.task('deploy', function(){
  gulp.src('./build/**')
    .pipe(s3(aws, {headers: {'Cache-Control': 'max-age=315360000, no-transform, public'}}));
});

gulp.task('test', function () {
    return gulp.src('test/spec.js', {read: false})
        .pipe(mocha({reporter: 'nyan'}));
});

gulp.task('default', ['connect', 'watch']);