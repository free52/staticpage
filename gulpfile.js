var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var reload = browserSync.reload;
var fileinclude = require('gulp-file-include');
var clean = require('gulp-clean');
var uglify = require('gulp-uglify')
var minifyCSS = require('gulp-minify-css')
var imagemin = require('gulp-imagemin')
const autoprefixer = require('gulp-autoprefixer');

var src = {
    html: 'src/*.html',
    scss: 'src/scss/*.scss',
    js: "src/js/*.js",
    images: "src/images/*.*"
};
var dist = {
    html: "./dist/*.html",
    css: "./dist/css",
    js: "./dist/js",
    images: "dist/images"
}

// 编译html 删除html
gulp.task('html', function () {

    gulp.src(src.html)
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('./dist'));
});


// sass不压缩
gulp.task('sass', function () {

    gulp.src(src.scss)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest(dist.css))
});
// sass压缩
gulp.task('sass-minify', function () {

    gulp
        .src(src.scss)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(minifyCSS())
        .pipe(gulp.dest(dist.css))
});


// 删除js 编译js
gulp.task('js', function () {
    gulp.src(src.js)
        .pipe(gulp.dest(dist.js));
});

// 删除js 压缩js
gulp.task('js-uglify', function () {
    gulp.src(src.js)
        .pipe(uglify())
        .pipe(gulp.dest(dist.js));
});


// 图片
gulp.task('images', function () {

    gulp.src(src.images)
        .pipe(gulp.dest(dist.images))
});

// 压缩图片
gulp.task('images-imagemin', function () {

    gulp.src(src.images)
        .pipe(imagemin([
            imagemin.gifsicle({ interlaced: true }),
            imagemin.jpegtran({ progressive: true }),
            imagemin.optipng({ optimizationLevel: 5 }),
            imagemin.svgo({
                plugins: [
                    { removeViewBox: true },
                    { cleanupIDs: false }
                ]
            })
        ], {
                progressive: true
            }))
        .pipe(gulp.dest(dist.images))
});


// 监控
gulp.task('watch', ['html', 'js', 'sass', 'images'], function () {
    browserSync.init({
        server: './dist'
    });
    gulp.watch(src.scss, ['sass']).on('change', reload);;
    gulp.watch(src.js, ['js']).on('change', reload);;
    gulp.watch(src.html, ['html']).on('change', reload);
    gulp.watch(src.images, ['images']).on('change', reload);
});

// 清除
gulp.task("clean", function () {
    return gulp.src("./dist")
        .pipe(clean());
})


// 编译
gulp.task('build', ['html', 'sass-minify', 'js-uglify', 'images-imagemin']);

// 默认
gulp.task('default', ['html', 'sass', 'js', 'images', 'images-imagemin']);


