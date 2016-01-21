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
    source = require('vinyl-source-stream'),
    browserify = require('browserify'),
    tsify = require('tsify');

///////////////////////////////////////////////////
/// Constants
///////////////////////////////////////////////////
var src = {
        ts: 'src/ts',
        sass: 'src/scss/style.scss',
        index: 'src/index.html'
    },
    dest = {
        js: 'build/js',
        css: 'build/css',
        index: 'build'
    };

///////////////////////////////////////////////////
/// TypeScript
///////////////////////////////////////////////////
gulp.task('ts', function () {
    var bundler = browserify()
        .add(src.ts + '/main.ts')
        .plugin(tsify);
        
    return bundler.bundle()
        .pipe(source('app.js'))
        .pipe(gulp.dest(dest.js));
});

gulp.task('ts-watch', ['ts'], function () {
    browserSync.reload();    
});

///////////////////////////////////////////////////
/// Test
///////////////////////////////////////////////////
gulp.task('test', ['ts'], function (done) {
	new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();
});

///////////////////////////////////////////////////
/// Sass
///////////////////////////////////////////////////
gulp.task('sass', function () {
    return gulp.src(src.sass)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(prefix('last 2 versions', '> 1%', 'ie 8', 'Android 2', 'Firefox ESR'))
        .pipe(minify())
        .pipe(rename('style.min.css'))
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest(dest.css))
        .pipe(browserSync.stream());
});

///////////////////////////////////////////////////
/// HTML
///////////////////////////////////////////////////
gulp.task('html', function () {
    return gulp.src(src.index)
        .pipe(plumber())
        .pipe(gulp.dest(dest.index));
});

///////////////////////////////////////////////////
/// Watch and live reload
///////////////////////////////////////////////////
gulp.task('browser-sync', ['sass', 'test', 'html'], function () {
    browserSync.init({
        server: './build',
        port: 8087
    });

    gulp.watch(['src/ts/**/*.ts', 'spec/**/*'], ['test']);
    gulp.watch('src/scss/*.scss', ['sass']);
    gulp.watch('src/index.html', ['html']).on('change', browserSync.reload);
});

gulp.task('default', ['browser-sync']);
