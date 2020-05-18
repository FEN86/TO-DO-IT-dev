let gulp = require('gulp'),
  sass = require('gulp-sass'),
  rename = require('gulp-rename'),
  browserSync = require('browser-sync'),
  autoprefixer = require('gulp-autoprefixer'),
  concat = require('gulp-concat'),
  uglifyJS = require('uglify-js'),
  iconfont = require('gulp-iconfont'),
  iconfontCss = require('gulp-iconfont-css'),
  cssmin = require('gulp-cssmin'),
  del = require("del");

// Local Server
gulp.task('browser-sync', function () {
  browserSync.init({
    server: {
      baseDir: "app/"
    },
    notify: false
  });
});

// Custom Styles
gulp.task('sass', function () {
  return gulp.src('app/scss/**/*.scss')
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(autoprefixer({
      grid: true,
      overrideBrowserslist: ["last 15 versions", "> 1%", "ie 8", "ie 7"]
    }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({ stream: true }))
});

// CSS libs
gulp.task('css-libs', function () {
  return gulp.src([
    'node_modules/reset-css/reset.css',
  ])
    .pipe(concat('_libs.scss'))
    .pipe(gulp.dest('app/scss'))
});

// HTML Live Reload
gulp.task('html', function () {
  return gulp.src('app/**/*.html')
    .pipe(browserSync.reload({ stream: true }))
});

gulp.task('js', function () {
  return gulp.src('app/js/**/*.js')
    .pipe(browserSync.reload({ stream: true }))
});

// Scripts & JS Libraries
gulp.task('script', function () {
  return //gulp.src([
  // ])
  //   .pipe(concat('libs.min.js'))
  //   .pipe(uglifyJS())
  //   .pipe(gulp.dest('app/js'))
});

// icon fonts
var fontName = 'icons';
// add svg icons to the folder "icons" and use 'iconfont' task for generating icon font
gulp.task('iconfont', async () => {
  // где лежат наши иконки
  gulp.src('app/icons/*.svg')
    .pipe(iconfontCss({
      // где будет наш scss файл
      targetPath: '../scss/_icons.scss',
      // пути подлючения шрифтов см. в _icons.scss
      fontPath: '../iconfonts/',
      fontName: fontName

    }))
    .pipe(iconfont({
      fontName: fontName,
      formats: ['svg', 'ttf', 'eot', 'woff', 'woff2'],
      normalize: true,
      fontHeight: 1001
    }))
    // куда выбрасываем нашу папку с шрифтами
    .pipe(gulp.dest('app/iconfonts'))
});

gulp.task('watch', function () {
  gulp.watch('app/scss/**/*.scss', gulp.parallel('sass'))
  gulp.watch('app/**/*.html', gulp.parallel('html'))
  gulp.watch('app/js/**/*.js', gulp.parallel('js'))
});

gulp.task("clean", async function () {
  del.sync("dist");
});

gulp.task("export", function () {
  let buildHtml = gulp.src("app/**/*.html").pipe(gulp.dest("dist"));

  let buildCss = gulp.src("app/css/**/*.css").pipe(gulp.dest("dist/css"));

  let buildJs = gulp.src("app/js/**/*.js").pipe(gulp.dest("dist/js"));

  let buildFonts = gulp.src("app/fonts/**/*.*").pipe(gulp.dest("dist/fonts"));

  let buildiconFonts = gulp.src("app/iconfonts/**/*.*").pipe(gulp.dest("dist/iconfonts"));

  let buildImg = gulp.src("app/images/**/*.*").pipe(gulp.dest("dist/images"));
});

gulp.task('default', gulp.parallel('css-libs', 'script', 'sass', 'watch', 'browser-sync'));

gulp.task("build", gulp.series("clean", "export"));