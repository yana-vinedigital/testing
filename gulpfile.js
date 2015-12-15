

//
//	Gulp Config
//


//	Gulp
var gulp = require('gulp');
var gutil = require('gulp-util');

//	Gulp Modules
var $ = require("gulp-load-plugins")({
	pattern: ['gulp-*', '*'],
	scope: ['devDependencies']
});

//	Gulp Config
var env = {
	namespace: 'FRONTIER',
	isProd: $.yargs.argv._.length ? $.yargs.argv._[0] === 'prod' : false,
	isSPA: true
};

//	Gulp Paths
var basePaths = {
	src: './src/',
	dist: './dist/'
};

var paths = {
	src: {
		root: 	basePaths.src,
		img: 	basePaths.src + 'img/',
		js: 	basePaths.src + 'js/',
		font: 	basePaths.src + 'font/',
		tpl: 	basePaths.src + 'tpl/',
		scss: 	basePaths.src + 'scss/'
	},
	dist: {
		root: 	basePaths.dist,
		img: 	basePaths.dist + 'assets/img/',
		js: 	basePaths.dist + 'assets/js/',
		font: 	basePaths.dist + 'assets/font/',
		css: 	basePaths.dist + 'assets/css/'
	} 	
};


/*
 *  Task: Copy Files
 *  --------------------------------------------------
 */

gulp.task('clean', function() {
	// clean dist, maybe use gulp-newer?
	return $.del( paths.dist.root + '**/*', {
        force: true
    });
});

gulp.task('assets', gulp.parallel(

	//	HTML	---------------
	function assets_html() { 
		return gulp.src([
			paths.src.root + '*.{html,txt}'
		], { base: paths.src.root, dot: true })
			.pipe( gulp.dest( paths.dist.root ) );
	},

	//	Images	---------------
	function assets_images() { 
		return gulp.src([
			paths.src.img + '**/*.{jpg,png}'
		], { dot: true })
			.pipe( $.if( env.isProd, $.imagemin({
				progressive: true,
				optimizationLevel: 3
			})))
			.pipe( gulp.dest( paths.dist.img ) );
	},

	//	Fonts	---------------
	function assets_fonts() { 
		return gulp.src([
			paths.src.font + '*.{eot,woff,ttf,svg}'
		], { dot: true })
			.pipe( gulp.dest( paths.dist.font ) );
	}

));



/*
 *  Task: JS / Browserify Compilation
 *  --------------------------------------------------
 */

gulp.task('js', function() {
	var browserify = $.browserify({
		entries: paths.src.js + 'main.js',
		transform: $.stringify({
			extensions: ['.html'], 
			minify: true
		}),
		debug: !env.isProd
	});

	env.isProd && gulp.src([ paths.src.js + '**/*.js' ])
		.pipe( $.jshint() )
		.pipe( $.jshint.reporter('jshint-stylish') );

	return browserify.bundle()
		.pipe( $.vinylSourceStream( 'main.js' ) )
		.pipe( $.vinylBuffer() )
		.pipe( $.sourcemaps.init({ loadMaps: true }) )
		.pipe( $.if( env.isProd, $.uglify() ))
		.on( 'error', gutil.log )
		.pipe( $.sourcemaps.write('./') )
		.pipe( gulp.dest( paths.dist.js ) );
});

//	Helpers		---------------

gulp.task('titles', function() {
	//	Task: 	Update code comment titles
	return gulp.src( paths.src.js + '**/*.js' )
		.pipe( $.replace( /((\/{2})\n\2\s)(\w+)(.*\n\2)/, '$1' + env.namespace + '$4' ))
		.pipe( gulp.dest( paths.src.js ) );
});


/*
 *  Task: SASS / CSS Compilation
 *  --------------------------------------------------
 */

gulp.task('scss-env', function() {
	return gulp.src( paths.src.scss + 'main.scss' )
		.pipe( $.replace( /\$ENV\:\s?\"(dev|prod)\"\;/, '$ENV: "' + env.is + '";' ) )
		.pipe( gulp.dest( paths.src.scss ) );
});

gulp.task('css', function() {
	return gulp.src( paths.src.scss + 'main.scss' )
		.pipe( $.if( !env.isProd, $.sourcemaps.init() ))
		.pipe( $.sass({
			errLogToConsole: true,
			precision: 12
		}))
		.pipe( $.autoprefixer( "last 2 versions", "> 1%", "ie 9" ) )
		.pipe( $.if( !env.isProd, $.sourcemaps.write() ))
		.pipe( $.filter('*.css') )
		.pipe( $.if( env.isProd, $.cssmin() ))
		.pipe( gulp.dest( paths.dist.css ))
		.pipe( $.browserSync.reload({ 
			stream: true 
		}));
});


/*
 *  Task: SVG Sprites
 *  --------------------------------------------------
 */

gulp.task('svg', function() {
	return gulp.src( paths.src.img + '**/*.svg' )
		.pipe( $.svgSprite({
			mode: {
				symbol: {
					dest: paths.src.tpl + 'svg/',
					inline: true,
					example: true
				}
			}
		}))
		.pipe( gulp.dest( '.' ) );
});


/*
 *  Task: Development Server
 *  --------------------------------------------------
 */

gulp.task('server', function() {
	return $.browserSync({
		server: {
			baseDir: paths.dist.root
		},
		files: [
			paths.dist.root + '**/*.html',
			paths.dist.js + '*.js'
		],
		notify: false,
		ghostMode: false
	});
});


/*
 *  Task Definitions
 *  --------------------------------------------------
 */

//	Build	--------------------

gulp.task('build', gulp.series(
	gulp.parallel( 'clean', 'scss-env' ),
	gulp.parallel( 'assets', 'js', 'css', 'svg' )
));

//	Watch	--------------------

gulp.task('watch', function() {
	gulp.watch([ paths.src.root + '*.html' ], gulp.series('assets') );
	gulp.watch([ paths.src.img + '**/*.{jpg,gif,png}' ], gulp.series('assets') );
	gulp.watch([ paths.src.img + '**/*.svg' ], gulp.series('svg') );
	gulp.watch([ paths.src.js + '**/*.js', paths.src.tpl + '**/*.html' ], gulp.series('js') );
	gulp.watch([ paths.src.scss + '**/*.scss' ], gulp.series('css') );
});

//	Prod	--------------------

gulp.task('prod', gulp.series('build'));

//	Default		----------------

gulp.task('default',
	gulp.series(
		'build',
		gulp.parallel( 'server', 'watch' )
	)
);