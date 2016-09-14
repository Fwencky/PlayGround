// Load Gulp and plugins
var gulp = require('gulp');
var ts = require('gulp-typescript');
var merge = require('merge2');
var del = require('del');
var flatten = require('gulp-flatten');

// Path variables
var SOURCE = './src';
var DESTINATION = './dist';

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
gulp.task('build', ['clean', 'scripts']);

// Watch task : watch *sass ans *ts
gulp.task('watch', function () {
  gulp.watch(SOURCE + '/assets/scripts/*.ts', ['scripts']);
});

// Default task
gulp.task('default', ['watch']);
