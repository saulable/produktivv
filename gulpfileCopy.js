const gulp = require('gulp');
const pug = require('gulp-pug');
const browserSync = require('browser-sync');
const sass = require('gulp-sass');
const nodemon = require('gulp-nodemon');

// compile sass
gulp.task('sass', () => {
	return gulp
		.src(['./server/view/src/scss/*.scss'])
		.pipe(sass())
		.pipe(gulp.dest('./server/view/build/css'))
		.pipe(browserSync.stream());
});
// compile pug
gulp.task('pug', function() {
 return	gulp
		.src('./server/view/src/*.pug')
		.pipe(
			pug({
				pretty: true
			})
		)
		.pipe(gulp.dest('./server/view/build'));
});
// watch and server
gulp.task('serve', ['browserSync'], () => {
	gulp.watch(['./server/view/src/sccs/*.scss'], ['sass']);
	gulp.watch(['./server/view/build/*html']).on('change', browserSync.reload);
});

// browserSync
gulp.task('browserSync', ['nodemon'], () => {
	browserSync.init(null, {
		proxy: 'https://localhost:5000',
		browser: 'google-chrome',
		port: 50001
	});
});
gulp.task('nodemon', [], done => {
	let running = false;
	return nodemon({
		script: 'index.js'
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
// default tasks

//
gulp.task('default', ['pug', 'watch']);
