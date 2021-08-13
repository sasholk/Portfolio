//npm i - запуск
const { src, dest, watch, parallel, series } = require('gulp'); 

const scss          = require('gulp-sass')(require('sass')); 
const concat        = require('gulp-concat');
const browserSync   = require('browser-sync').create();
const uglify        = require('gulp-uglify-es').default;
const autoprefixer  = require('gulp-autoprefixer');
const imagemin      = require('gulp-imagemin');
const del           = require('del');

function browsersync() {
    browserSync.init({
        server: {
            baseDir: 'src/'
        }
    });
}

function cleanDist() {
    return del('dist')
}

function images() {
    return src('src/img/**/*')
        .pipe(imagemin(
            [
                imagemin.gifsicle({interlaced: true}),
                imagemin.mozjpeg({quality: 75, progressive: true}),
                imagemin.optipng({optimizationLevel: 5}),
                imagemin.svgo({
                    plugins: [
                        {removeViewBox: true},
                        {cleanupIDs: false}
                    ]
                })
            ]
        ))
        .pipe(dest('dist/img'))
}

function scripts() {
    return src([
        'node_modules/jquery/dist/jquery.js',
        'src/js/script.js'
    ]) // когда нужно вписать путь к нескольким файлам то ставятся квадратные скобки
        .pipe(concat('script.min.js'))
        .pipe(uglify())
        .pipe(dest('src/js'))
        .pipe(browserSync.stream())
}


function styles() { 
    return src('src/sass/style.scss')
        .pipe(scss({outputStyle: 'compressed'})) // компрессия для css файла (для красоты кода есть 'expanded)
        .pipe(concat('style.min.css')) // переименование в min.css
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 10 version'],
            grid: true
        }))
        .pipe(dest('src/css'))
        .pipe(browserSync.stream())
} // конвертация стилей из пред. проц. scss в css

function build() {
    return src([
        'src/css/style.min.css',
        'src/fonts/**/*',
        'src/icons/**/*',
        'src/js/script.min.js',
        'src/*.html'
    ], {base: 'src'})
        .pipe(dest('dist'))
}

function watching() {
    watch(['src/sass/**/*.scss'], styles); // автоматическое обновление (если есть измения - запускается gulp styles)
    watch(['src/js/**/*.js', '!src/js/script.min.js'], scripts); // восклицательный знак обозначает исключение (здесь watch не будет следить за min.js)
    watch(['src/*.html']).on('change', browserSync.reload);
} 

exports.styles = styles;
exports.watching = watching;
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.images = images;
exports.cleanDist = cleanDist;

exports.build = series(cleanDist, images, build);
exports.default = parallel(styles, scripts, browsersync, watching);