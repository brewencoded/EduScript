'use strict';

function NoMatchingOptionException(message) {
    this.message = message;
    this.name = 'NoMatchingOptionException';
}

function getSource(source) {
	switch (source) {
        case 'ajax':
            return 'src/js/ajax.js';
        case 'selection':
            source = 'src/js/select.js';
            break;
        default:
            throw new NoMatchingOptionException('There is no matching option for that arg.');

    }
}

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    prefix = require('gulp-autoprefixer'),
    browserSync = require('browser-sync').create(),
    plumber = require('gulp-plumber'),
    sourcemaps = require('gulp-sourcemaps'),
    concatenate = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    minify = require('gulp-cssnano'),
    Server = require('karma').Server,
    stripCode = require('gulp-strip-code'),
    rename = require('gulp-rename'),
    yargs = require('yargs').argv;

///////////////////////////////////////////////////
/// Test
///////////////////////////////////////////////////

gulp.task('test', function (done) {
	new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();
});

///////////////////////////////////////////////////
/// Sass
///////////////////////////////////////////////////
gulp.task('sass', function() {
    return gulp.src('src/scss/style.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(prefix('last 2 versions', '> 1%', 'ie 8', 'Android 2', 'Firefox ESR'))
        .pipe(minify())
        .pipe(rename('style.min.css'))
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream());
});

///////////////////////////////////////////////////
/// HTML
///////////////////////////////////////////////////
gulp.task('html', function() {
    return gulp.src('src/index.html')
        .pipe(plumber())
        .pipe(gulp.dest('dist/'));
});

///////////////////////////////////////////////////
/// Library includes
///////////////////////////////////////////////////
gulp.task('js', ['test'], function() {
    var args = yargs.libs;
    var i;
    var source;
    if (args === undefined || args.length === 0 || typeof args === 'string') {
        source = 'src/js/**/*.js';
    } else {
    	source = [];
        for (i in args) {
        	var src = getSource(args[i]);
        	if (typeof source === 'string') {
        		source.push(src);
        	} else {
        		source.concat(src);
        	}
        }
    }
    return gulp.src(source)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(stripCode({
    		start_comment: 'start-test',
    		end_comment: 'end-test'
    	}))
        .pipe(concatenate('mimic.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('js-watch', ['js'], function () {
	browserSync.reload();
});

///////////////////////////////////////////////////
/// Browser-sync
///////////////////////////////////////////////////
gulp.task('browser-sync', ['sass', 'js', 'html'], function () {
	browserSync.init({
        server: './dist',
        port: 8087
    });

    gulp.watch('src/js/**/*.js', ['js-watch']);
    gulp.watch('src/scss/*.scss', ['sass']);
    gulp.watch('src/index.html', ['html']).on('change', browserSync.reload);
    gulp.watch('tests/**/*.js', ['test']);
});

// You can have selection or ajax by itself. Manipulation depends on selection.
gulp.task('default', ['browser-sync']);
