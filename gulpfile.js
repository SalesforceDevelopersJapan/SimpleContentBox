var componentName = 'SimpleContentBox';

var gulp = require("gulp");
var zip = require("gulp-zip");
var browserify = require("browserify");
var debowerify = require('debowerify');
var source = require("vinyl-source-stream");
var deamd = require('deamd');
var through2 = require("through2");
var jsforce = require("jsforce");
var notify = require('gulp-notify');
var env = require('gulp-env');
var gulpif = require('gulp-if');
var replace = require('gulp-replace');
var cssmin = require('gulp-cssmin');
var gutil = require('gulp-util');
var watchify = require('watchify');
var assign = require('lodash.assign');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var header = require('gulp-header');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var del = require('del');

var handleErrors = function(err, callback) {
  notify.onError({
    message: err.toString().split(': ').join(':\n'),
    sound: false
  }).apply(this, arguments);
  if (typeof this.emit === 'function') {
    this.emit('end');
  }
}

var forceDeploy = function(username, password) {
  return through2.obj(function(file, enc, callback) {
    var conn;
    conn = new jsforce.Connection();
    return conn.login(username, password).then(function() {
      return conn.metadata.deploy(file.contents).complete({
        details: true
      });
    })
    .then(function(res) {
      if (res.details !== null && !res.success){
        console.error(res);
        return callback(new Error('Deploy failed.'));
      }
      return callback();
    }, function(err) {
      console.error(err);
      return callback(err);
    });
  });
};

gulp.task('build', ['js', 'css', 'statics'], function() {
  return gulp.src('./build/**/*')
  .pipe(zip(componentName + '.resource'))
  .pipe(gulp.dest('./pkg/staticresources'));
});

var customOpts = {
  entries: ['./src/js/'+ componentName +'.js'],
  debug: true
};
var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts));
var pkg = require('./package.json');
var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' **/',
  ''].join('\n');

gulp.task('js', function() {
  return browserify({
    entries: ['./src/js/'+ componentName +'.js'],
    standalone: componentName
  }).transform(debowerify)
  .bundle()
  .on('error', gutil.log.bind(gutil, 'Browserify Error'))
  .pipe(source(componentName + '.js'))
  .pipe(buffer())
  .pipe(gulp.dest('./build/js'));
});

gulp.task('css', function() {
  return gulp.src('./src/css/*.css')
  .pipe(cssmin())
  .pipe(gulp.dest('./build/css'));
});

gulp.task('statics', function() {
  return gulp.src(['./src/images/**/*', './src/fonts/**/*'], {
    base: './src'
  }).pipe(gulp.dest('./build'));
});

gulp.task('deploy', function() {
  var ts = Date.now();
  return gulp.src('pkg/**/*', {
    base: '.'
  })
  .pipe(gulpif('**/*.cmp', replace(/__NOCACHE__/g, ts)))
  .pipe(zip('pkg.zip'))
  .pipe(forceDeploy(process.env.SF_USERNAME, process.env.SF_PASSWORD))
  .on('error', handleErrors);
});

gulp.task("watch", function() {
  gulp.watch("src/**/*", ["build"]);
  gulp.watch("pkg/**/*", ["deploy"]);
});

gulp.task("default", ["build", "deploy"]);
