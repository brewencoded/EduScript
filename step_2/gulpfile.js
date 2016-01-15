///////////////////////////////////////////////////
/// Module declaration
///////////////////////////////////////////////////
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
    yargs = require('yargs').argv,
    ts = require('gulp-typescript');

///////////////////////////////////////////////////
/// Constants
///////////////////////////////////////////////////
var src = {
        ts: '',
        sass: '',
        index: ''
    },
    dest = {
        js: '',
        css: '',
        index: ''
    };
    
///////////////////////////////////////////////////
/// TypeScript
///////////////////////////////////////////////////
gulp.task('ts', function() {
    gulp.src(['src/ts/**/*.ts'])
        .pipe(plumber())
        .pipe(ts({
			noImplicitAny: true,
			out: 'app.js',
            target: 'es5',
            removeComments: true
		}))
        .pipe(gulp.dest('build/js'));
});

gulp.task('ts-watch', ['ts'], browserSync.reload);

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
        .pipe(gulp.dest('build/css'))
        .pipe(browserSync.stream());
});

///////////////////////////////////////////////////
/// HTML
///////////////////////////////////////////////////
gulp.task('html', function() {
    return gulp.src('src/index.html')
        .pipe(plumber())
        .pipe(gulp.dest('build/'));
});

///////////////////////////////////////////////////
/// Watch and live reload
///////////////////////////////////////////////////
gulp.task('browser-sync', ['sass', 'ts', 'html'], function () {
	browserSync.init({
        server: './build',
        port: 8087
    });

    gulp.watch('src/ts/**/*.ts', ['ts-watch']);
    gulp.watch('src/scss/*.scss', ['sass']);
    gulp.watch('src/index.html', ['html']).on('change', browserSync.reload);
});

gulp.task('default', ['browser-sync']);