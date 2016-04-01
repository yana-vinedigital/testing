

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
var Templates = require('./base/templates');
// var CSSMatrix = require('cssmatrix');

//	Dependencies
var Modernizr = require('browsernizr');
var State = require('ampersand-state');
var Region = require('ampersand-view-switcher');
var View = require('ampersand-view');
var FormView = require('ampersand-form-view');

//	Views
var PageNavView = require('./views/page-nav');
var BladeView = require('./views/blade');
var BladeTourView = require('./views/blade-tour');


//
//
//


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
		_logoOffset: ['number', true, 0],

		_transformProperty: 'string',
		_hasTransforms3d: ['boolean', true, false],
		_isTouch: ['boolean', true, false],

		_isMenuOpen: ['boolean', false, false],
		_isContextOpen: ['boolean', true, false],
		_isScrollDisabled: ['boolean', false, false],
		_isScrollTopSection: ['boolean', false, true],
		_scrollFriction: ['number', true, 0.25],
		_scrollOffset: ['number', true, window.pageYOffset],
		_scrollPos: ['number', true, window.pageYOffset],

		_waypoints: ['array', false, () => []],
		_isWaypointsReady: ['boolean', false, false],
		_waypointMap: ['array', false, () => []],
		_bladeMap: ['array', false, () => []],
		_currentWaypointTop: ['number', true, 0],
		_currentBladeTop: ['number', true, 0],

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
				return this._scrollDiff * this._scrollFriction;
			}
		},
		_scrollNeedsUpdate: {
			deps: ['_scrollDiff'],
			fn: function() {
				return Math.abs( this._scrollDiff ) > 1;
			}
		},
		_currentBlade: {
			deps: ['_isWaypointsReady', '_currentBladeTop'],
			fn: function() {
				if ( typeof this._currentBladeTop === 'undefined' || !this._isWaypointsReady ) return;
				let blade = Utils.find( this._waypoints, { bladeTop: this._currentBladeTop, type: 'blade' } );
				return blade; //typeof blade === 'undefined' ? undefined : blade;
			}
		},
		_bladeTheme: {
			deps: ['_isWaypointsReady', '_currentBlade'],
			fn: function() {
				if ( !this._isWaypointsReady || typeof this._currentBlade === 'undefined' ) return;
				if ( typeof this._currentBlade.instance.bladeTheme === 'undefined' ) return 'dark';
				return this._currentBlade.instance.bladeTheme;
			}
		},
		_currentWaypoint: {
			deps: ['_isWaypointsReady', '_currentWaypointTop'],
			fn: function() {
				if ( !this._isWaypointsReady ) return;
				return Utils.find( this._waypoints, { top: this._currentWaypointTop } );
			}
		}
	},

	initialize() {

		this._transformProperty = Modernizr.prefixed('transform');
		this._hasTransforms3d = Modernizr.csstransforms3d;
		this._isTouch = Modernizr.touchevents;
	},

	registerWaypoint( waypoint ) {
		var existingWaypoint = Utils.find( this._waypoints, { id: waypoint.id } );

		waypoint.bladeTop = typeof waypoint.offset !== 'undefined' ? Math.round( waypoint.top + ( this._windowHeight * waypoint.offset )) : waypoint.top;
		
		if ( typeof existingWaypoint !== 'undefined' ) {
			let index = Utils.indexOf( this._waypoints, existingWaypoint );
			this._waypoints.splice( index, 1, waypoint );
		} else {
			this._waypoints.push( waypoint );
		}

		let waypoints = Utils.sortBy( this._waypoints, 'top' );
		let blades = Utils.filter( waypoints, { type: 'blade' } );
	
		this._waypointMap = Utils.map( waypoints, 'top' ).reverse();
		this._bladeMap = Utils.map( blades, 'bladeTop' ).reverse();
		log( 'waypoints', this._waypointMap, waypoints );
		log( 'blades', this._bladeMap, blades );

		this._isWaypointsReady = true;
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

	derived: {
		bladeTheme: {
			deps: ['model._bladeTheme'],
			fn: function() {
				return '-blade-theme-' + this.model._bladeTheme;
			}
		}
	},

	bindings: {
		'model._isMenuOpen': {
			type: 'booleanClass',
			name: '-is-menu-open'
		},
		'model._isContextOpen': {
			type: 'booleanClass',
			name: '-is-context-open'
		},
		'model._isScrollTopSection': {
			type: 'booleanClass',
			name: '-is-scroll-top'
		},
		'bladeTheme': {
			type: 'class'
		}
	},

	events: {
		'click [data-hook=open-menu]': '_toggleMenuHandler',
		'click [data-hook=open-sign-up]': '_clickSignupHandler',
		'click [data-hook=page-overlay]': '_clickOverlayHandler',
		'touchstart [data-hook=page-overlay]': '_clickOverlayHandler'
	},

	initialize() {
		var _this = this;
		this._scrollFrameRequested = false;
		this._animFramePending = false;
		this._bladeCurrentIndex = 0

		this.$_parallaxObjects = [];
		this.bladeObjects = [];

		//	Bind	 ----------------
		this._updateScroll = this._updateScroll.bind( this );
		this._viewportHandler = Utils.debounce( this._viewportHandler.bind( this ), 250 );
		this._updateViewport = this._updateViewport.bind( this );
		this._scrollHandler = this._scrollHandler.bind( this );
		this._scrollAnimationHandler = this._scrollAnimationHandler.bind( this );
		
		// 	DOM	 --------------------
		this.$_viewport = this.queryByHook('app');
		this.$_main = this.queryByHook('main');
		this.$_pageNav = this.queryByHook('page-nav');
		this.$_headerMenu = this.queryByHook('header-menu');
		this.$_headerMenuBg = this.queryByHook('header-menu-bg');
		this.$_pageOverlay = this.queryByHook('page-overlay');
		this.$_page = this.queryByHook('page');
		this.$_parallaxElements;
		this.$_logo = this.queryByHook('logo');
		this.$_contextRegion = this.queryByHook('page-context');

		this.$_intro = this.query('[data-blade=intro]');
		this.$_tour = this.query('[data-blade=tour]');

		// 	Views	 ----------------
		if ( this.$_pageNav ) this.v_pageNav = new PageNavView({ el: this.$_pageNav, parent: this });
		if ( this.$_contextRegion ) this.v_contextRegion = new Region( this.$_contextRegion );

		//	Events	 ----------------
		window.addEventListener( 'scroll', this._scrollHandler, false );
		window.addEventListener( 'resize', this._viewportHandler, false );
		this.listenTo( this.model, 'change:_currentBlade', ( model, waypoint, options ) => {
			FRONT.trigger( 'blade:active', waypoint );
		});
		this.listenTo( this.model, 'change:_currentWaypoint', ( model, waypoint, options ) => { 
			// if ( typeof _this._prevWaypoint !== 'undefined' ) waypoint.prev = _this._prevWaypoint;
			FRONT.trigger( 'waypoint:active', waypoint );
			this._prevWaypoint = waypoint;
		});
		this.listenTo( FRONT, 'waypoint:go', this.goToWaypoint );
		
		this._setupBlades();
		this._setupScroll();
	},

	//	Event Handlers	 ----------------

	_viewportHandler( e ) {
		Utils.raf( this._updateViewport );
	},

	_scrollHandler( e ) {
		log('_scrollHandler')
		if ( this._scrollFrameRequested || this.model._isScrollDisabled ) return;
		this._scrollFrameRequested = true;
		Utils.raf( this._updateScroll );
	},

	_scrollAnimationHandler( time ) {
		Utils.raf( this._scrollAnimationHandler );
		if ( !this.model._scrollNeedsUpdate || this._animFramePending ) return;
		this._animFramePending = true;

		var scrollPos = this.model._scrollPos = +( this.model._scrollPos + this.model._scrollVelocity ).toFixed(2);
		!this.model._isTouch && this._parallaxAnimationHandler();

		this.model._currentBladeTop = this.getCurrentWaypointLogo( scrollPos );
		this.model._currentWaypointTop = this.getCurrentWaypointBlade( scrollPos );

		this._animFramePending = false;
	},

	_parallaxAnimationHandler() {
		var windowHeight = this.model._windowHeight;
		var windowHeightHalf = windowHeight/2;
		var scrollPos = this.model._scrollPos;
		var introOpacityPrev = this.introOpacity || 1;
		var tourOpacityPrev = this.tourOpacity || 0;

		this.$_page.style[ this.model._transformProperty ] = 'translate3d(0,' + (scrollPos * -1) + 'px,0)';

		if ( this.$_intro && scrollPos < windowHeight ) {
			this.introOpacity = Utils.MATH.clamp( 1 - ( scrollPos / ( windowHeight * 0.75 )), 0, 1 );
			if ( this.introOpacity !== introOpacityPrev ) {
				this.$_intro.style.opacity = this.introOpacity;
			}
		}

		if ( this.$_tour && scrollPos > windowHeight*0.5 && scrollPos < windowHeight * 4 ) {
			if ( scrollPos > windowHeightHalf && scrollPos < windowHeight ) {
				//	( Starting Y position ) / ( transition distance );
				var opacity = ((scrollPos - windowHeight*0.5) / (windowHeight*0.25));
			} else if ( scrollPos > windowHeight && scrollPos < windowHeight * 3.5 ) {
				var opacity = 1 - (( scrollPos - windowHeight*3 ) / (windowHeight*0.55));
			} else {
				var opacity = 0;
			}

			let opacityCurve = +(Math.pow( opacity , 2 )).toFixed(2)
			this.tourOpacity = Utils.MATH.clamp( opacityCurve, 0, 1 );
			if ( this.tourOpacity !== tourOpacityPrev ) {
				this.$_tour.style.opacity = this.tourOpacity;
			}
		}

		for (var i = this.parallaxObjectsLength; i >= 0; i--) {
			var item = this.$_parallaxObjects[i];
			item.el.style[ this.model._transformProperty ] = 'translate3d(0,' + (
				(scrollPos * item.parallax * -1) + (( item.offset < windowHeightHalf ? 0 : item.offset - windowHeightHalf) * item.parallax )
			) + 'px,0)';
		}
	},

	_toggleMenuHandler( e ) {
		e.preventDefault();
		this.model._isMenuOpen ? this.closeMenu() : this.openMenu();
	},

	_clickSignupHandler( e ) {
		e.preventDefault();
		var view = new App.SignupView({ parent: this });
		this.openContext( view );
	},

	_clickOverlayHandler( e ) {
		e.preventDefault();
		this.closeMenu();
		this.closeContext();
	},

	//	Public Methods	 ----------------
	
	openMenu() {
		this.model._isMenuOpen = true;
		this.closeContext();
	},

	closeMenu() {
		this.model._isMenuOpen = false;
	},

	openContext( view ) {
		if ( !view ) throw new Error('view required to render in Context region');
		this.model._isContextOpen = true;
		this.closeMenu();
		this.v_contextRegion.set( view );
	},

	closeContext() {
		this.model._isContextOpen = false;
		this.v_contextRegion.clear();
	},

	getCurrentWaypointLogo: Utils.throttle( function( scrollPos ) {
		var waypoint = Utils.find( this.model._bladeMap, ( top ) => {
			return top <= ( scrollPos + this.model._logoOffset );
		});
		return typeof waypoint === 'undefined' ? 0 : waypoint;
	}, 50, { leading: true, trailing: false }),

	getCurrentWaypointBlade: Utils.throttle( function( scrollPos ) {
		var waypoint = Utils.find( this.model._waypointMap, ( top ) => {
			return top <= ( scrollPos + this.model._windowHeight * 0.5 );
		});
		return typeof waypoint === 'undefined' ? 0 : waypoint;
	}, 50, { leading: true, trailing: false }),

	goToWaypoint( waypointId ) {
		var waypoint = Utils.find( this.model._waypoints, { id: waypointId });
		this._setScroll( waypoint.top );
	},

	//	Private Methods	 ----------------
		
	_setupBlades() {
		var $_blades = this.$_page.querySelectorAll('[data-blade]');
		var bladeTypes = {
			default: BladeView,
			tour: BladeTourView
		};
		
		Utils.each( $_blades, ( el, i ) => {
			var bladeViewType = el.getAttribute('data-blade-type') || 'default';
			var bladeTheme = el.getAttribute('data-blade-theme') || 'dark';
			var bladeOffset = +(el.getAttribute('data-blade-offset') || 0);
			var bladeView = new bladeTypes[ bladeViewType ]({ el: el, index: i, bladeTheme: bladeTheme, bladeOffset: bladeOffset });
			this.bladeObjects.push( bladeView );
		});

		this.model._currentBladeTop = 0;
	},

	_setupScroll() {
		var _this = this;
		
		this._updateViewport();
		this._scrollAnimationHandler();
	},

	_setupParallax() {
		var windowHeightHalf = this.model._windowHeight / 2;

		this.$_parallaxElements.forEach(( el, i ) => {
			var pos = Utils.DOM.getPosition( el, true );
			var item = {
				el: el,
				offset: pos.top + ( pos.height / 2 ),
				parallax: el.getAttribute('data-parallax') || 1
			};
			el.style[ this.model._transformProperty ] = 'translate3d(0,' + (
				(this.model._scrollPos * item.parallax * -1) + (( item.offset < windowHeightHalf ? 0 : item.offset - windowHeightHalf) * item.parallax )
			) + 'px,0)';
			this.$_parallaxObjects.push( item );
		});

		this.parallaxObjectsLength = this.$_parallaxObjects.length - 1;

	},

	_updateParallax() {
		var _this = this;
		this.$_parallaxElements = this.queryAll('[data-parallax]');
		this.$_parallaxObjects = [];
		this.parallaxObjectsLength = 0;

		this.$_main.style.height = this.$_page.offsetHeight + 'px';


		this.model._scrollPos = this._getScroll();
		this.model._scrollOffset = this.model._scrollPos;

		this.$_page.style[ this.model._transformProperty ] = 'translate3d(0,' + (this.model._scrollPos * -1) + 'px,0)';

		var logoPos = Utils.DOM.getPosition( this.$_logo, true );
		this.model._logoOffset = Math.round( logoPos.top + ( logoPos.height / 2 ) );

		this.$_parallaxElements.forEach( function( el, i ) {
			el.style[ _this.model._transformProperty ] = '';
		});

		this._setupParallax();
		// Utils.raf(function() {
		// 	_this._setupParallax();
		// });
	},

	_updateViewport() {
		log( '_updateViewport' );
		log( 'scrollPos', this.model._scrollPos, this._getScroll() );
		this.model._windowWidth = window.innerWidth;
		this.model._windowHeight = window.innerHeight;
		var logoPos = Utils.DOM.getPosition( this.$_logo, true );
		this.model._logoOffset = Math.round( logoPos.top + ( logoPos.height / 2 ) );
		this.model._scrollPos = this._getScroll();
		!this.model._isTouch && this._updateParallax();

		FRONT.trigger( 'window:reflow', { width: this.model._windowWidth, height: this.model._windowHeight } );
	},

	_updateScroll() {
		
		var scroll = document.defaultView.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
		log('_updateScroll', scroll)
		this.model._isScrollTopSection = ( scroll < this.model._windowHeight * 0.25 );
		this.model._scrollOffset = scroll;
		this._scrollFrameRequested = false;
	},

	_getScroll() {
		return document.defaultView.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
	},

	_setScroll( y ) {
		window.scrollTo( 0, y );
	}


});


/**
 *	View / Signup
 *  -------------------------------------
 */

App.SignupThanksView = View.extend({
	template: Templates.Global.ContextSignupThanks,

	events: {
		'click [data-hook=context-action-submit]': '_submitHandler'
	},

	//	Event Handlers	 ----------------

	_submitHandler: function( e ) {
		e.preventDefault();
		this.parent.closeContext();
	}

});

App.SignupAirlineView = View.extend({
	template: Templates.Global.ContextSignupAirline,

	events: {
		'click [data-hook=context-action-submit]': '_submitHandler'
	},

	//	Event Handlers	 ----------------

	_submitHandler( e ) {
		e.preventDefault();
		this.showThanks();
	},

	//	Public Methods	 ----------------

	showThanks() {
		var view = new App.SignupThanksView({ parent: this.parent });
		this.parent.openContext( view );
	},

});

App.SignupView = View.extend({
	template: Templates.Global.ContextSignup,
	
	events: {
		'click [data-hook=context-action-submit]': '_submitHandler'
	},

	render() {
		var _this = this;
		this.renderWithTemplate( this );

		// this.submitForm = new FormView({
		// 	el: this.queryByHook('submit-form'),
		// 	// autoAppend: false,
		// 	submitCallback: this._submitData.bind( this ),
		// 	regions: {
		// 		main: '[data-form-region=main]'
		// 	},
		// 	fields: {
		// 		main: [
		// 			Fields.base.text( 'name', 'Your name', 'Your name', '', 'field--full' ),
		// 			Fields.base.email( 'contact_email', 'Your email address', 'your@email.com', '', 'field--half' ),
		// 			Fields.base.phone( 'contact_phone', 'Your phone number', '040 123 4567', '', 'field--half' ),
		// 			Fields.base.textarea( 'message', 'Your message', 'I\'m interested in working with you...', '', 'field--full' ),
		// 		]
		// 	}
		// });

		// this.registerSubview( this.submitForm );

		return this;
	},

	//	Event Handlers	 ----------------

	_submitHandler( e ) {
		if ( e ) e.preventDefault();
		// this.submitForm.handleSubmit( e );
		this.showAirline();
	},

	//	Public Methods	 ----------------

	showAirline() {
		var view = new App.SignupAirlineView({ parent: this.parent });
		this.parent.openContext( view );
	},

	//	Private Methods	 ----------------

	// _submitData( data ) {
	// 	var _this = this;
	// 	this.model.save( data, { 
	// 		success: function() {
	// 			_this.showThanks();
	// 		},
	// 		error: function() {

	// 		}
	// 	});
		
	// }
});









/**
 *	App Initialization
 *  -------------------------------------
 */

FRONT.on('dom:ready', () => {
	FRONT.app = new App.State();
	FRONT.appView = new App.View({ el: document.body, model: FRONT.app });
});