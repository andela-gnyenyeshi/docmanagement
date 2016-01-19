var gulp = require('gulp'),
	LiveServer = require('gulp-live-server'),
	// BrowserSync = require('browser-sync'),
	lint = require('gulp-eslint');

gulp.task('lint', function() {
	return gulp.src(['./routes/*.js', './server/schema/*.js', 'document-manager.js', 'document-manager.spec.js'])
		.pipe(lint())
		.pipe(lint.format());
});

// gulp.task('browser', function() {});

gulp.task('watch', function() {

});

gulp.task('server', function() {
	var server = new LiveServer('document-manager.js');
	server.start();
});

gulp.watch();

gulp.task('default', ['lint', 'server']);
