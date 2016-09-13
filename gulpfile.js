// Load Gulp and plugins
var gulp = require('gulp');
var less = require('gulp-less');
var cssComb = require('gulp-csscomb');
var cssBeautify = require('gulp-cssbeautify');
var autoPrefixer = require('gulp-autoprefixer');
var ccsO = require('gulp-csso');
var rename = require('gulp-rename');
var ts = require('gulp-typescript');
var merge = require('merge2');
var del = require('del');
var flatten = require('gulp-flatten');

// Path variables
var SOURCE = './src';
var DESTINATION = './dist';

//  Styles task : LESS + autoprefixer + CSScomb + beautify (source -> destination)
gulp.task('styles', function () {
  return gulp.src(SOURCE + '/assets/styles/styles.less')
    .pipe(less())
    .pipe(cssComb())
    .pipe(cssBeautify({indent: '  '}))
    .pipe(autoPrefixer())
    .pipe(gulp.dest(DESTINATION + '/assets/css/'));
});

// Minify task : CSS minification (destination -> destination)
gulp.task('minify', function () {
  return gulp.src(DESTINATION + '/assets/css/*.css')
    .pipe(cssO())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(DESTINATION + '/assets/css/'));
});
// Scripts task : Generate both JavaScript and TypeScript definition files
gulp.task('scripts', function() {
    var tsResult = gulp.src(SOURCE  + '/**/*.ts')
        .pipe(ts({
            declaration: true,
            noExternalResolve: true
        }));

    return merge([
        tsResult.dts.pipe(flatten())
        .pipe(gulp.dest(DESTINATION + '/assets/definitions')),
        tsResult.js.pipe(flatten())
        .pipe(gulp.dest(DESTINATION + '/assets/js'))
    ]);
});

gulp.task('clean', function () {
  return del([
    DESTINATION
  ]);
});

// Build task
gulp.task('build', ['clean', 'styles', 'scripts']);

// Prod task : Build + Minify
gulp.task('prod', ['build',  'minify']);

// Watch task : watch *less ans *ts
gulp.task('watch', function () {
  gulp.watch(SOURCE + '/assets/styles/*.less', ['styles']);
  gulp.watch(SOURCE + '/assets/scripts/*.ts', ['scripts']);
});

// Default task
gulp.task('default', ['build']);
