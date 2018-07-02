const gulp = require('gulp');
var $ = require('gulp-load-plugins')();
const fs = require('fs');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const nodemon = require('gulp-nodemon');
const pug = require('gulp-pug');
const plumber = require('gulp-plumber')
const notify = require('gulp-notify');
const beeper = require('beeper');
const watch = require('gulp-watch');
const data = require('gulp-data');

var sassPaths = [
	'node_modules/foundation-sites/scss',
	'node_modules/motion-ui/src'
];
gulp.task('sass', function() {
	return gulp
		.src('site_src/assets/scss/*.scss')
		.pipe(
			plumber({
				errorHandler: function(err) {
					notify.onError({
						title: 'Gulp error in ' + err.plugin,
						message: err.toString()
					})(err);
				}
			})
		)
		.pipe(
			$
				.sass({
					includePaths: sassPaths,
					outputStyle: 'compressed' // if css compressed **file size**
				})
				.on('error', $.sass.logError)
		)
		.pipe(
			$.autoprefixer({
				browsers: ['last 2 versions', 'ie >= 9']
			})
		)
		.pipe(gulp.dest('dist/assets/css'))
		.pipe(browserSync.reload({ stream: true }));
});

gulp.task('pug', function() {
	return gulp
		.src(['site_src/pages/*.pug', 'site_src/layouts/*.pug' ])
		.pipe(
			plumber({
				errorHandler: function(err) {
					notify.onError({
						title: 'Gulp error in ' + err.plugin,
						message: err.toString()
					})(err);
				}
			})
		)
		.pipe(
			data(function(file) {
				return JSON.parse(fs.readFileSync('site_src/data/coffee.json'));
			})
		)
		.pipe(
			data(function(file) {
				return JSON.parse(fs.readFileSync('site_src/data/gallery.json'));
			})
		)
		.pipe(pug({ pretty: true }))
		.pipe(gulp.dest('./dist'));
});

gulp.task('nodemon', [], done => {
	let running = false;
	return nodemon({
		script: './index.js'
	})
		.on('start', () => {
			if (!running) {
				done();
			}
			running = true;
		})
		.on('restart', () => {
			setTimeout(function() {
				browserSync.reload();
			}, 500);
		});
});
gulp.task('browserSync', ['nodemon'], () => {
	browserSync.init({
		proxy: 'https://localhost:5000',
		browser: 'safari',
		port: 7000
	});
});

gulp.task('serve', ['sass', 'pug', 'nodemon', 'browserSync'], function(){
		gulp.watch('site_src/assets/scss/*.scss', ['sass']);
		gulp.watch('site_src/pages/*.pug', ['pug']);
		gulp.watch('site_src/layouts/*.pug', ['pug']);
		gulp.watch('dist/*.html', browserSync.reload);
		gulp.watch('dist/css/assets/css/*.css', browserSync.reload);
});
gulp.task('default', ['serve']);
