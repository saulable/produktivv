const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const nodemon = require('gulp-nodemon');
const pug = require('gulp-pug');
const plumber = require('gulp-plumber')
const notify = require('gulp-notify');
const beeper = require('beeper');

gulp.task('sass', function() {
	return gulp
		.src('./server/view/src/sass/*.scss')
		.pipe(plumber({ errorHandler: function(err) {
            notify.onError({
                title: "Gulp error in " + err.plugin,
                message:  err.toString()
            })(err);
					 }}))
		.pipe(sass())
		.pipe(gulp.dest('./server/view/build/css'))
		.pipe(browserSync.reload({
			stream: true
		}))
});
gulp.task('pug', function() {
 return	gulp
		.src('./server/view/src/*.pug')
		.pipe(plumber({ errorHandler: function(err) {
            notify.onError({
                title: "Gulp error in " + err.plugin,
                message:  err.toString()
            })(err);
						 }}))
		.pipe(pug({pretty: true }))
		.pipe(gulp.dest('./server/view/build'));
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
		port: 7000,
		serveStatic: [{
			dir: './server/view/build'
		}]
	});
});

gulp.task('serve', ['sass', 'pug', 'nodemon', 'browserSync'], function(){
		gulp.watch('./server/view/src/sass/*.scss', ['sass']);
		gulp.watch('./server/view/src/*.pug', ['pug']);
		gulp.watch('./server/view/build/*.html',  browserSync.reload);
});

gulp.task('default', ['serve']);
