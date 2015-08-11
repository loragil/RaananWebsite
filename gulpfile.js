/*!
 * gulp
 * $ npm install gulp-ruby-sass gulp-autoprefixer gulp-minify-css gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-notify gulp-rename gulp-livereload gulp-cache gulp-sourcemaps gulp-connect del --save-dev
 */
 
// Load plugins
var gulp = require('gulp'),
sass = require('gulp-ruby-sass'),
sourcemaps = require('gulp-sourcemaps'),
autoprefixer = require('gulp-autoprefixer'),
minifycss = require('gulp-minify-css'),
jshint = require('gulp-jshint'),
uglify = require('gulp-uglify'),
imagemin = require('gulp-imagemin'),
rename = require('gulp-rename'),
concat = require('gulp-concat'),
notify = require('gulp-notify'),
cache = require('gulp-cache'),
livereload = require('gulp-livereload'),
del = require('del'),
connect = require('gulp-connect');

// Styles
gulp.task('styles', function() {
  return sass('src/css/main.scss', 
  { 
    style: 'expanded', 
    compass: true, 
        sourcemap: true/*, 
        sourcemapPath: 'css' */
    }).on('error', handleError)
  .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
  .pipe(gulp.dest('dist/styles'))
  .pipe(gulp.dest('src/css'))
  .pipe(sourcemaps.write('maps', {
    includeContent: false,
    sourceRoot: '/source'
}))
  .pipe(rename({ suffix: '.min' }))
  .pipe(minifycss().on('error', handleError))
  .pipe(gulp.dest('dist/styles'))
  .pipe(notify({ message: 'Styles task complete' }));
});

// Scripts
gulp.task('scripts', function() {
  return gulp.src('src/js/**/*.js')
  .pipe(jshint())
  .pipe(jshint.reporter('default'))
  .pipe(concat('src/main.js'))
  .pipe(gulp.dest('dist/js'))
  .pipe(rename({ suffix: '.min' }))
  .pipe(uglify().on('error', handleError))
  .pipe(gulp.dest('dist/js'))
  .pipe(notify({ message: 'Scripts task complete' }))
  .on('error', handleError);
});

// Images
gulp.task('images', function() {
  return gulp.src('src/assets/images/**/*')
  .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
  .pipe(gulp.dest('dist/assets/images'))
  .pipe(notify({ message: 'Images task complete' }))
  .on('error', handleError);
});

// Clean
gulp.task('clean', function(cb) {
    del(['dist/styles', 'dist/js', 'dist/img'], cb)
});

gulp.task('webserver', function() {
    connect.server({
        //root: ['.'],
        livereload: true,
        port: 8000
    });
});

// Default task
gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'scripts', 'images', 'webserver');
});

// Watch
gulp.task('watch', function() {

  // Watch .scss files
  gulp.watch('src/css/**/*.scss', ['styles']);
  
  // Watch .js files
  gulp.watch('src/js/**/*.js', ['scripts']);
  
  // Watch image files
  gulp.watch('src/assets/images/**/*', ['images']);
  
  // Create LiveReload server
  livereload.listen();
  
  // Watch any files in dist/, reload on change
  gulp.watch(['dist/**']).on('change', livereload.changed)
  .on('error', handleError);
});


function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}