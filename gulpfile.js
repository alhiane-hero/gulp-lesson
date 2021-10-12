const gulp = require('gulp');
const gulpConcat = require('gulp-concat');
const autoPrefixer = require('gulp-autoprefixer');
var gulpSass = require('gulp-sass')(require('sass'));
const gulpPug = require('gulp-pug');
const livereload = require('gulp-livereload');
const sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var notify = require("gulp-notify");
const GulpZip = require('gulp-zip');
var ftp = require('vinyl-ftp');
const babel = require('gulp-babel');

// html task:
gulp.task('structure', async function () {
    /// require('./server.js'); // run server when this task run;
    return gulp.src('project/index.pug')
    .pipe(notify("Html Task Finished!"))
    .pipe(gulpPug({pretty: true})) // by default will be compresed!
    .pipe(gulp.dest('dist'))
    .pipe(livereload());
})

// css task:
gulp.task('styles', async function () {
    return gulp.src('project/css/main.scss')
    .pipe(notify("Css Task Finished!"))
    .pipe(sourcemaps.init()) // initialisation => اكتشاف الطريق;
    .pipe(gulpSass({outputStyle: 'compressed'}))
    .pipe(autoPrefixer('last 2 versions'))
    .pipe(sourcemaps.write('.')) 
    // create source map;
    .pipe(gulp.dest('dist/css'))
    .pipe(livereload());
});

// js task:
gulp.task('scripts', async function () {
    return gulp.src(['project/js/*.js', '!project/js/undefined.js'])
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(notify("JavaScript Task Finished!"))
    .pipe(gulpConcat('all.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(livereload());
});

// zip all files:
gulp.task('zipFiles', function () {
    gulp.src('dist/**/*.*')
    .pipe(GulpZip('gulpWebsite.zip'))
    .pipe(gulp.dest('.')) // (.) => zip and put it next to 'dist' folder;
    .pipe(notify("Project Files Is Compressed!"));
});

// uploading task:
gulp.task('deploy', function () {
    var conn = ftp.create({
        host: 'alhiane.com',
        // user name and password of hossting:
        user: 'alhiane999',
        password: 'lahcen@199',
        parallel: 10,
    });
    // using base = '.' will transfer everything to /public_html correctly
    // turn off buffering in gulp.src for best performance
    return gulp.src(['dist/**/*.*'], {base: '.', buffer: false})
        .pipe(conn.newer('/public_html')) // only upload newer files
        .pipe(conn.dest('/public_html' ))
        .pipe(livereload());
});

// watch task:
gulp.task('watch', async function () {
    require('./server.js');
    livereload.listen();
    gulp.watch('project/**/*.pug', gulp.series('structure'));
    gulp.watch('project/css/**/*.scss', gulp.series('styles'));
    // (project/css/**/*.scss) => all files / folders inside css folder;
    gulp.watch('project/js/**/*.js', gulp.series('scripts'));
    gulp.watch('dist/**/*.*', gulp.series('zipFiles'));
    // gulp.watch('dist/**/*.*', gulp.series('deploy'));
});

// default task:
gulp.task('default', gulp.parallel('watch'));

// all html files:
/*
gulp.task('elzero', async function () {
    return gulp.src('project/*.*')
    .pipe(elzeroCopy()) // get a copy from index.html file;
    .pipe(elzeroMinify()) // Minify index.html file;
    .pipe(elzeroRename()) // rename minified copy (index.html) => (index.min.html);
    .pipe(gulp.dest('dist')) // (dist) آخذ الملف للمكان السليم;
});
*/

// all files by any extention:
/*
gulp.task('elzero', async function () {
    return gulp.src('project/*.*')
    .pipe(elzeroCopy()) // get a copy from index.html file;
    .pipe(elzeroMinify()) // Minify index.html file;
    .pipe(elzeroRename()) // rename minified copy (index.html) => (index.min.html);
    .pipe(gulp.dest('dist')) // (dist) آخذ الملف للمكان السليم;
});
*/

// get object of files:
/*
gulp.task('elzero', async function () {
    return gulp.src('['project/index.html', 'project/index.html']')
    .pipe(elzeroCopy()) // get a copy from index.html file;
    .pipe(elzeroMinify()) // Minify index.html file;
    .pipe(elzeroRename()) // rename minified copy (index.html) => (index.min.html);
    .pipe(gulp.dest('dist')) // (dist) آخذ الملف للمكان السليم;
});
*/

// add files on target foldder inside 'dist':
/*
gulp.task('elzero', async function () {
    return gulp.src(['project/index.css', 'project/home.css'])
    .pipe(gulp.dest('dist/css'))
});
*/