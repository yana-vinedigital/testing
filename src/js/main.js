

//
//	FRONTIER / Main
//	


'use strict';

//	Dev
var log = require('bows')('MAIN');

//	Modernizr Tests
require('browsernizr/lib/prefixed');
require('browsernizr/test/css/transforms3d');
require('browsernizr/test/touchevents');

//	App
var FRONT = require('app');
var Schema = require('./data/schema');
var Utils = require('utils');
// var CSSMatrix = xrequire('cssmatrix');

//	Dependencies
var Modernizr = require('browsernizr');
var State = require('ampersand-state');
var Router = require('ampersand-controller-router');
var Region = require('ampersand-view-switcher');
var View = require('ampersand-view');
var Templates = require('tpl');

//	Views
var PageNavView = require('./views/page-nav');
var BladeView = require('./views/blade');
var BladeTourView = require('./views/blade-tour');


//
//
//


// var cssMatrix = window.WebKitCSSMatrix || window.MSCSSMatrix || window.CSSMatrix || CSSMatrix;
var App = {};



/**
 *	State / App
 *  -------------------------------------
 */

App.State = State.extend({

	props: {
		//	models
		// user: 'state',
		// userSession: 'state',

		_windowWidth: ['number', true, window.innerWidth],
		_windowHeight: ['number', true, window.innerHeight],

		_transformProperty: 'string',
		_hasTransforms3d: ['boolean', true, false],
		_isTouch: ['boolean', true, false],

		_isScrollDisabled: ['boolean', false, false],
		_isScrollTopSection: ['boolean', false, true],
		_scrollFriction: ['number', true, 0.08],
		_scrollOffset: ['number', true, window.pageYOffset],
		_scrollPos: ['number', true, 0],

		_waypoints: ['array', false, function() { return []; }],
		_waypointMap: ['array', false, function() { return []; }],
		_currentWaypointTop: 'number',

		// TEMP
		_slideIndex: ['number', true, 0]
	},
	
	derived: {
		_scrollDiff: {
			deps: ['_scrollOffset', '_scrollPos'],
			fn: function() {
				return +(this._scrollOffset - this._scrollPos).toFixed(1);
			}
		},
		_scrollVelocity: {
			deps: ['_scrollDiff', '_scrollFriction'],
			fn: function() {
				// log(+(this._scrollDiff * this._scrollFriction).toFixed(1))
				return this._scrollDiff * this._scrollFriction;
			}
		},
		_scrollNeedsUpdate: {
			deps: ['_scrollDiff'],
			fn: function() {
				return true //Math.abs( this._scrollDiff ) > 1;
			}
		},
		// _scrollDirClass: {
		// 	deps: ['_scrollVelocity'],
		// 	fn: function() {
		// 		return this._scrollVelocity < 0 ? '-dir-up' : '-dir-down';
		// 	}
		// },
		_currentWaypoint: {
			deps: ['_currentWaypointTop'],
			fn: function() {
				return Utils.find( this._waypoints, { top: this._currentWaypointTop } );
			}
		}
		// viewportScrollMid: {
		// 	deps: ['_scrollPos', '_windowHeight'],
		// 	fn: function() {
		// 		return this._scrollPos + this._windowHeight * 0.5;
		// 	}
		// },

	},

	initialize: function() {
		this._transformProperty = Modernizr.prefixed('transform');
		this._hasTransforms3d = Modernizr.csstransforms3d;
		this._isTouch = Modernizr.touchevents;


		//	Models	 ----------------
		// this.user = new Schema.User.User();
		// this.userSession = new Schema.User.UserSession();
	},

	registerWaypoint: function( waypoint ) {
		var existingWaypoint = Utils.find( this._waypoints, { id: waypoint.id } );
		if ( typeof existingWaypoint !== 'undefined' ) {
			existingWaypoint = waypoint;
		} else {
			this._waypoints.push( waypoint );
		}
		


		this._waypointMap = Utils.pluck( Utils.sortBy( this._waypoints, 'top' ), 'top' ).reverse();
	}


	

});


/**
 *	Router / App
 *  -------------------------------------
 */

App.Router = Router.extend({

	controllers: {
		Index: require('./controllers/index')
	},

	routes: {
		'': 'Index.index',
	},

	initialize: function() {

	}

});

/**
 *	View / App
 *  -------------------------------------
 */

App.View = View.extend({
	_objectName: 'AppView',

	props: {
		$_viewport: 'element',
	},

	bindings: {
		// '_isScrollDisabled': {
		// 	type: 'booleanClass',
		// 	name: '-is-scroll-disabled'
		// },
		'model._isScrollTopSection': {
			type: 'booleanClass',
			name: '-is-scroll-top'
		},
		// 'model._slideIndex': {
		// 	hook: 'position'
		// },
		// 'model._scrollDirClass': {
		// 	type: 'class'
		// },
		// '_slidePositionClass': {
		// 	hook: 'tour',
		// 	type: 'class'
		// }
	},

	initialize: function() {
		var _this = this;
		this._scrollFrameRequested = false;
		this._animFramePending = false;
		
		this.$_parallaxObjects = [];
		this.bladeObjects = [];
		

		// this._pageScrollProp = this.$page.style[ this._transformProperty ];

		this._updateScroll = this._updateScroll.bind( this );
		this._viewportHandler = Utils.debounce( this._viewportHandler.bind( this ), 250 );
		this._updateViewport = this._updateViewport.bind( this );
		this._scrollHandler = this._scrollHandler.bind( this );
		this._scrollAnimationHandler = this._scrollAnimationHandler.bind( this );
		// this._mouseWheelHandler = this._mouseWheelHandler.bind( this );
		// this._setSlideIndex = Utils.debounce( this._setSlideIndex.bind( this ), 100, { leading: true, trailing: false } );


		this._bladeCurrentIndex = 0;
		

		

		// 	DOM	 --------------------
		this.$_viewport = this.queryByHook('app');
		// this.$mainRegion = this.query('[data-region=main]');
		this.$_pageNav = this.queryByHook('page-nav');
		this.$_page = this.queryByHook('page');

		this.$_intro = this.query('[data-blade=intro]');
		this.$_tour = this.query('[data-blade=tour]');

		// 	Views	 ----------------
		if ( this.$_pageNav ) this.v_pageNav = new PageNavView({ el: this.$_pageNav, parent: this });
		// this.mainRegion = new Region( this.$mainRegion, {

		// });

		//	Router	 ----------------
		// this.router = new App.Router({ 
		// 	app: this,
		// 	actionCallback: this._routeComplete.bind(this),
		// 	controllerOptions: {
		// 		app: this
		// 	}
		// });

		//	Events	 ----------------
		window.addEventListener( 'scroll', this._scrollHandler, false );
		window.addEventListener( 'resize', this._viewportHandler, false );

		this.model.on( 'change:_currentWaypoint', function( model, waypoint, options ) {
			// var dir = typeof _this._prevWaypoint === 'undefined' ? 0 : _this._prevWaypoint.top > waypoint.top ? 1 : -1;  
			if ( typeof _this._prevWaypoint !== 'undefined' ) waypoint.prev = _this._prevWaypoint;
			FRONT.trigger( 'waypoint:active', waypoint );
			_this._prevWaypoint = waypoint;
		});
		this.listenTo( FRONT, 'waypoint:go', this.goToWaypoint );
		

		this._setupBlades();
		this._setupScroll(); // !this._isTouch && 
	},

	//	Event Handlers	 ----------------

	_viewportHandler: function( e ) {
		Utils.raf( this._updateViewport );
	},

	_scrollHandler: function( e ) {
		if ( this._scrollFrameRequested || this.model._isScrollDisabled ) return;
		this._scrollFrameRequested = true;
		Utils.raf( this._updateScroll );
	},

	_scrollAnimationHandler: function( time ) {
		Utils.raf( this._scrollAnimationHandler );
		if ( !this.model._scrollNeedsUpdate || this._animFramePending ) return;
		this._animFramePending = true;

		var _this = this;
		var windowHeight = this.model._windowHeight;
		var windowHeightHalf = windowHeight/2;
		var scrollPos = this.model._scrollPos = this.model._isTouch ? this.model._scrollOffset : +( this.model._scrollPos + this.model._scrollVelocity ).toFixed(2);

		this.$_page.style[ this.model._transformProperty ] = 'translate3d(0,' + (scrollPos * -1) + 'px,0)';
		// new cssMatrix().translate(0,+(scrollPos * -1).toFixed(1),0);
		
		this.model._currentWaypointTop = this.getCurrentWaypoint( scrollPos );

		var introOpacityPrev = this.introOpacity || 1;
		var tourOpacityPrev = this.tourOpacity || 0;

		if ( this.$_intro && scrollPos < windowHeight ) {
			this.introOpacity = Utils.MATH.clamp( 1 - ( scrollPos / ( windowHeight * 0.5 )), 0, 1 );
			if ( this.introOpacity !== introOpacityPrev ) {
				this.$_intro.style.opacity = this.introOpacity;
			}
		}

		if ( this.$_tour && scrollPos > windowHeight*0.2 && scrollPos < windowHeight * 4 ) {
			var opacityOffset = +( Math.pow( scrollPos < windowHeight ? (scrollPos - windowHeight*0.2) / (windowHeight*0.75) : 1 - (( scrollPos - windowHeight*3.25 ) / (windowHeightHalf*0.75) ) , 3 )).toFixed(2);
			this.tourOpacity = Utils.MATH.clamp( opacityOffset, 0, 1 );
			if ( this.tourOpacity !== tourOpacityPrev ) {
				this.$_tour.style.opacity = this.tourOpacity;
			}
		}

		for (var i = this.parallaxObjectsLength; i >= 0; i--) {
			var item = this.$_parallaxObjects[i];
			item.el.style[ this.model._transformProperty ] = 'translate3d(0,' + ((scrollPos * item.parallax * -1) + ((item.offset - windowHeightHalf ) * item.parallax )) + 'px,0)';
			// new cssMatrix().translate(0,+((scrollPos * item.parallax * -1) + ((item.offset - windowHeight / 2 ) * item.parallax )).toFixed(1),0);
		}

		this._animFramePending = false;
		
	},

	// _mouseWheelHandler: function( e ) {
		
	// 	e.preventDefault();
	// 	if ( Math.abs( e.wheelDelta ) < 10 ) return;

	// 	var wheelDir = e.wheelDelta < 0 ? 1 : -1;
	
	// 	// if ( this._wheelDelay ) {
	// 	// 	clearTimeout( this._wheelDelay );

	// 	// 	this._wheelDelay = setTimeout(function() {
	// 	// 		_this._wheelDelay = null;
	// 	// 	}, 100 );

	// 	// 	return;
	// 	// }

	// 	this._setSlideIndex( wheelDir );
		
	// 	return false;
	// },

	_routeComplete: function() {

	},

	//	Public Methods	 ----------------
	
	getCurrentWaypoint: Utils.throttle( function( scrollPos ) {
		var _this = this;
		return Utils.find( this.model._waypointMap, function( top ) {
			return top <= scrollPos + _this.model._windowHeight * 0.5;
		});
	}, 50),

	goToWaypoint: function( waypointId ) {
		var waypoint = Utils.find( this.model._waypoints, { id: waypointId });
		this._setScroll( waypoint.top );
	},

	//	Private Methods	 ----------------
		
	_setupBlades: function() {
		var _this = this;
		var $blades = this.$_page.querySelectorAll('[data-blade]');
		var bladeTypes = {
			default: BladeView,
			tour: BladeTourView
		};
		
		Utils.each( $blades, function( el, i ) {
			var bladeViewType = el.getAttribute('data-blade-type') || 'default';
			var bladeView = new bladeTypes[ bladeViewType ]({ el: el, index: i });
			_this.bladeObjects.push( bladeView );
		});
	},

	_setupScroll: function() {
		var _this = this;
		
		this._updateViewport();
		!this.model._isTouch && this._setupParallax();
		// this.$_tour && this._setupSlides();

		!this.model._isTouch && this._scrollAnimationHandler();
	},

	_setupParallax: function() {
		var _this = this;
		var $_parallaxObjects = this.queryAll('[data-parallax]');
		
		$_parallaxObjects.forEach( function( el, i ) {
			var rect = el.getBoundingClientRect();
			var item = {
				el: el,
				offset: rect.top + rect.height / 2,
				parallax: el.getAttribute('data-parallax') || 1
			};
			el.style[ _this.model._transformProperty ] = 'translate3d(0,' + ((_this.model._scrollPos * item.parallax * -1) + ((item.offset - _this.model._windowHeight / 2) * item.parallax )) + 'px,0)';
			// new cssMatrix().translate(0,((_this._scrollPos * item.parallax * -1) + ((item.offset - _this._windowHeight / 2 ) * item.parallax )),0);// = 
			_this.$_parallaxObjects.push( item );
		});

		this.parallaxObjectsLength = this.$_parallaxObjects.length - 1;
	},

	_updateViewport: function() {
		this.model._windowWidth = window.innerWidth;
		this.model._windowHeight = window.innerHeight;

		FRONT.trigger( 'window:reflow', { width: this.model._windowWidth, height: this.model._windowHeight } );
	},

	_updateScroll: function() {
		// debugger;
		var scrollLast = this.model._scrollOffset;
		var scroll = window.pageYOffset;
		// var scrollDelta = scrollLast - scroll;
		// var scrollDir = scrollDelta > 0 ? 1 : -1;
		// var scrollDirDown = scrollDelta < 0;
		// var scrollDirUp = scrollDelta > 0;

		// Temp scroll func

		// var bladeHeight = this._windowHeight;
		// var bladePrevIndex = this._bladeCurrentIndex;

		// if ( scroll >= 0 ) this._bladeCurrentIndex = 0;
		// if ( scroll >= bladeHeight - ( bladeHeight/2 ) ) this._bladeCurrentIndex = 1;
		// if ( scroll >= bladeHeight*2 - ( bladeHeight/2 ) ) this._bladeCurrentIndex = 2;
		// if ( scroll >= bladeHeight*3 - ( bladeHeight/2 ) ) this._bladeCurrentIndex = 3;
		// if ( scroll >= bladeHeight*4 - ( bladeHeight/2 ) ) this._bladeCurrentIndex = 4;
		// if ( scroll >= bladeHeight*5 - ( bladeHeight/2 ) ) this._bladeCurrentIndex = 5;

		// if ( !this._isScrollDisabled && scrollDirDown && scroll > bladeHeight && bladePrevIndex < 1 ) {
			// this._disableScroll();
			// scroll = bladeHeight;
			// this._setScroll( scroll );
			
		// } else if ( !this._isScrollDisabled && scrollDirUp && scroll <= bladeHeight && bladePrevIndex >= 1 ) {
		// 	// this._disableScroll();
		// 	// scroll = bladeHeight;
		// 	// this._setScroll( scroll );
		// }

		// var prevActiveSlide = this._activeSlide || 0;
		// this._activeSlide = Utils.MATH.clamp( this._bladeCurrentIndex - 1, 0, 2 );
		// if ( prevActiveSlide !== this._activeSlide ) {
		// 	if ( this.slideObjects[ prevActiveSlide ] ) this.slideObjects[ prevActiveSlide ]._isActive = false;
		// }
		// if ( this.slideObjects[ this._activeSlide ] ) this.slideObjects[ this._activeSlide ]._isActive = true;

		// -----------

		this.model._isScrollTopSection = ( scroll < this.model._windowHeight * 0.25 );
		this.model._scrollOffset = scroll;
		this._scrollFrameRequested = false;
	},

	// _setSlideIndex: function( dir ) {
	// 	if ( Math.abs( this._scrollDiff ) > this._windowHeight*0.1 ) return;
	// 	var slideCurrent = this._slideIndex;
	// 	var slideNext = slideCurrent + dir;

	// 	if ( slideNext > 2 || slideNext < 0 ) {
	// 		// this._setScroll( this._windowHeight + 1 );
	// 		this._enableScroll();
	// 		return;
	// 	}

	// 	// this.slideObjects[ slideCurrent ]._isActive = false;
	// 	// this.slideObjects[ slideNext ]._isActive = true;

	// 	this._slideIndex = slideNext;// || slideCurrent;
		
		
	// },

	_setScroll: function( y ) {
		window.scrollTo( 0, y );
	},

	

	// _disableScroll: function() {
	// 	log('disable scroll');
	// 	var _this = this;
	// 	this._isScrollDisabled = true;
	// 	window.addEventListener( 'mousewheel', _this._mouseWheelHandler );
	// 	// window.addEventListener( 'touchmove', _this._mouseWheelHandler );

	// },

	// _enableScroll: function() {
	// 	log('enable scroll');
	// 	window.removeEventListener( 'mousewheel', this._mouseWheelHandler );
	// 	// window.removeEventListener( 'touchmove', _this._mouseWheelHandler );
	// 	this._isScrollDisabled = false;
	// }


});










/**
 *	App Initialization
 *  -------------------------------------
 */

FRONT.on('dom:ready', function() {
	FRONT.app = new App.State();
	FRONT.appView = new App.View({ el: document.body, model: FRONT.app });

	// FRONT.app.router.start();
});