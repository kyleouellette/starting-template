var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var minify_css = require('gulp-minify-css');
var rename = require('gulp-rename');
var concat = require('gulp-concat-util');
var imagemin = require('gulp-imagemin');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');

var pkg = require('./package.json');

var config = {
   css_name: 'style.css',
   source: 'src',
   dist: 'dist',
   mode: 'dev'
};

/************************************************************
 * CSS AND SASSS STUFF 
 ***********************************************************/

/**
 * Setup for using scss.
 * This yask will not do compression. 
 * Seek other task to do this for you. 
 */
gulp.task('sass', function(){
   return sass(config.source + '/scss/**/*.scss')
      .on('error', sass.logError)
      .pipe(gulp.dest(config.dist + '/css/'));
});

/**
 * concat all CSS files into style.css
 * this should be changed in the future to be config.css_name
 */
gulp.task('concat', ['sass'], function(){
   var now = new Date();
   var timeString = now.getHours() + ':' + now.getMinutes();

   return gulp.src(config.dist + '/css/[^style]*.css')
      .pipe(concat(config.css_name))
      .pipe(concat.header('/**\n' + pkg.name + ' - v' + pkg.version + '\nLast compiled: ' +now.toDateString() + ' ' + timeString+ '\n **/\n'))
      .pipe(gulp.dest(config.dist + '/css/'));
});

/**
 * Minify the main file
 */
gulp.task('minify-css', ['concat'], function(){
   return gulp.src(config.dist + '/css/' + config.css_name)
      .pipe(minify_css())
      .pipe(rename({
         suffix: '-min'
      }))
      .pipe(gulp.dest(config.dist + '/css/'));
});


/************************************************************
 * IMAGE STUFF 
 ***********************************************************/

/**
 * Optimize images
 */
gulp.task('images', function(){
   return gulp.src(config.source + '/img/*')
      .pipe(imagemin())
      .pipe(gulp.dest(config.dist + '/img/'));
});


/************************************************************
 * JAVASCRIPT STUFF 
 ***********************************************************/

 /**
  * Run JSHint on existing JS and move it to dist folder
  */
gulp.task('copy-js', function(){
   gulp.src(config.source + '/js/**/*.js')
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
      .pipe(jshint.reporter('fail'))
      .pipe(gulp.dest(config.dist + '/js/'));

});

/**
 * Depending on config.mode, either compress and append -min
 * or just append min. While debugging, you wouldnt want to be reading compressed code. 
 *
 * ALWAYS TEST AFTER MIN AS WELL
 */
gulp.task('minify-js', ['copy-js'], function(){
   if(config.mode !== 'deploy'){
      return gulp.src([config.dist + '/js/main.js'])
         .pipe(rename({
            suffix: '-min'
         }))
         .pipe(gulp.dest(config.dist + '/js'));      
   }

   return gulp.src([config.dist + '/js/main.js'])
      .pipe(uglify())
      .pipe(rename({
         suffix: '-min'
      }))
      .pipe(gulp.dest(config.dist + '/js'));
});

/************************************************************
 * DEFAULT AND GENERAL HELPERS
 ***********************************************************/

/**
 * Default tasks to run.
 * This is mostly used here for listing task that will run when gulp is called
 */
gulp.task('default', ['minify-css', 'images', 'minify-js'], function(){
   // You could do stuff here, but I dont have anything in mind right now
});

/**
 * Watching for file changes
 */
gulp.task('watch', [], function(){
   gulp.watch(config.source + '/scss/**/*.scss', ['minify-css']);
   gulp.watch(config.source + '/js/*.js', ['minify-js']);
});