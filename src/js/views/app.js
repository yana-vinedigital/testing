

//
//	FRONTIER / View / App
//	


'use strict';

//	App
var FRONT = require('app');
var Utils = require('utils');

//	Dependencies
var Region = require('ampersand-view-switcher');
var View = require('ampersand-view');

//	Views
var PageNavView = require('./page-nav');
var BladeView = require('./blade');
var BladeTourView = require('./blade-tour');
var FormSubscribeView = require('./form-subscribe');
var FormPartnersView = require('./form-partners');
var ContextSignupView = require('./context-signup');


//
//
//


/**
 *	View / App
 *  -------------------------------------
 */

module.exports = View.extend({
	_objectName: 'AppView',

	props: {
		$_viewport: 'element',
	},

	derived: {
		// headerTheme: {
		// 	deps: ['model._headerTheme'],
		// 	fn: function() {
		// 		if ( typeof this.model._headerTheme === 'undefined' ) return false;
		// 		return '-header-theme-' + this.model._headerTheme;
		// 	}
		// },
		waypointTheme: {
			deps: ['model._waypointTheme'],
			fn: function() {
				if ( typeof this.model._waypointTheme === 'undefined' ) return false;
				return '-waypoint-theme-' + this.model._waypointTheme;
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
		'model._isLastWaypoint': {
			type: 'booleanClass',
			name: '-is-waypoint-last'
		},
		// 'headerTheme': { type: 'class' },
		'waypointTheme': { type: 'class' }
	},

	events: {
		'click [data-hook=open-menu]': '_toggleMenuHandler',
		'click [data-hook=open-sign-up]': '_clickSignupHandler',
		'click [data-hook=page-overlay]': '_clickOverlayHandler',
		'click [data-hook=next-waypoint]': '_clickNextWaypointHandler',
		'click [data-hook=close-context]': '_clickCloseContextHandler',
		'click [data-nav-waypoint]': '_clickWaypointHandler',
		'touchstart [data-hook=page-overlay]': '_clickOverlayHandler'
	},

	initialize() {
		var _this = this;
		this._scrollFrameRequested = false;
		this._animFramePending = false;
		this._bladeCurrentIndex = 0

		this._parallaxObjects = [];

		//	Bind	 ----------------
		this._updateScroll = this._updateScroll.bind( this );
		this._viewportHandler = Utils.debounce( this._viewportHandler.bind( this ), 250 );
		this._updateViewport = this._updateViewport.bind( this );
		this._scrollHandler = this._scrollHandler.bind( this );
		this._scrollAnimationHandler = this._scrollAnimationHandler.bind( this );
		this._keyupHandler = this._keyupHandler.bind( this );
		
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
		this.$_formSubscribe = [].slice.call( this.queryAll('[data-hook=form-subscribe]') );
		this.$_formPartners = this.queryByHook('form-partners');
		this.$_intro = this.query('[data-blade=intro]');
		this.$_tour = this.query('[data-blade=tour]');

		// 	Views	 ----------------
		if ( this.$_contextRegion ) {
			this.v_contextRegion = new Region( this.$_contextRegion );
			this.registerSubview( this.v_contextRegion );
		}
		if ( this.$_pageNav ) {
			this.v_pageNav = new PageNavView({ el: this.$_pageNav, parent: this });
			this.registerSubview( this.v_pageNav );
		}
		if ( this.$_formSubscribe.length > 0 ) {
			Utils.each( this.$_formSubscribe, ( $_form ) => {
				var v_formSubscribe = new FormSubscribeView({ el: $_form, parent: this });
				this.registerSubview( v_formSubscribe );
			});
		}
		if ( this.$_formPartners ) {
			this.v_formPartners = new FormPartnersView({ el: this.$_formPartners, parent: this });
			this.registerSubview( this.v_formPartners );
		}
		
		//	Events	 ----------------
		window.addEventListener( 'scroll', this._scrollHandler, false );
		window.addEventListener( 'resize', this._viewportHandler, false );
		window.addEventListener( 'keyup', this._keyupHandler, false );
		this.listenTo( this.model, 'change:_breakpoint', this._breakpointHandler );
		this.listenTo( FRONT, 'waypoint:go', this.goToWaypoint );
		this.listenTo( FRONT, 'viewport:update', this._updateViewport );
		this.listenTo( this.model, 'change:_currentBlade', ( model, waypoint, options ) => {
			FRONT.trigger( 'blade:active', waypoint );
		});
		this.listenTo( this.model, 'change:_currentWaypoint', ( model, waypoint, options ) => {
			FRONT.trigger( 'waypoint:active', waypoint );
			this._prevWaypoint = waypoint;
		});
		
		//	Start	 ----------------
		this._setupBlades();
		this._setupScroll();
	},

	//	Event Handlers	 ----------------

	_viewportHandler( e ) {
		Utils.raf( this._updateViewport );
	},

	_breakpointHandler( model, breakpoint ) {
		FRONT.trigger( 'breakpoint', breakpoint );
	},

	_scrollHandler( e ) {
		this._updateScroll();
	},

	_keyupHandler( e ) {
		if ( e.keyCode === 27 && ( this.model._isMenuOpen || this.model._isContextOpen ) ) {
			this.closeMenu();
			this.closeContext();
		}
	},

	_toggleMenuHandler( e ) {
		e.preventDefault();
		this.model._isMenuOpen ? this.closeMenu() : this.openMenu();
	},

	_clickSignupHandler( e ) {
		e.preventDefault();
		var view = new ContextSignupView({ parent: this });
		this.openContext( view );
	},

	_clickOverlayHandler( e ) {
		e.preventDefault();
		this.closeMenu();
		this.closeContext();
	},

	_clickCloseContextHandler( e ) {
		e.preventDefault();
		this.closeContext();
	},

	_clickWaypointHandler( e ) {
		e.preventDefault();
		var el = e.delegateTarget;
		var waypointId = +el.getAttribute('data-nav-waypoint');
		FRONT.trigger( 'waypoint:go', waypointId );
	},

	_clickNextWaypointHandler( e ) {
		e.preventDefault();
		this.goToNextWaypoint();
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

	goToWaypoint( waypointId ) {
		var waypoint = Utils.find( this.model._waypoints, { id: waypointId });
		this._setScroll( waypoint.top );
	},

	goToNextWaypoint() {
		var waypoint = this.model.getNextWaypoint();
		this._setScroll( waypoint.top );
	},

	enableParallax() {
		this.disableParallax( false );
		
		this.$_parallaxElements = this.queryAll('[data-parallax]');
		this.$_main.style.height = this.$_page.offsetHeight + 'px';
		var scroll = this.model._scrollPos = this._getScroll();
		this.model._scrollOffset = scroll;
		this.$_page.style[ this.model._transformProperty ] = 'translate3d(0,' + (scroll * -1) + 'px,0)';

		this._setupParallax();
		this._isParallaxEnabled = true;
	},

	disableParallax( reset = true ) {
		if ( !this._isParallaxEnabled || !this.$_parallaxElements ) return;

		this._parallaxObjectsLength = 0;
		this._parallaxObjects.length = 0;
		
		if ( reset ) {
			this.$_page.style[ this.model._transformProperty ] = 'translate3d(0,0,0)';
			this.$_main.style.height = 'auto';
			if ( this.$_intro ) this.$_intro.style.opacity = 1;
			if ( this.$_tour ) this.$_tour.style.opacity = 1;
		}

		this.$_parallaxElements.forEach( ( el, i ) => {
			el.style[ this.model._transformProperty ] = '';
		});

		this._isParallaxEnabled = false;
	},

	//	Private Methods	 ----------------
		
	_setupBlades() {
		this.$_blades = this.$_page.querySelectorAll('[data-blade]');

		var bladeTypes = {
			default: BladeView,
			tour: BladeTourView
		};

		Utils.each( this.$_blades, ( el, i ) => {
			var bladeViewType = el.getAttribute('data-blade-type') || 'default';
			var bladeTheme = el.getAttribute('data-blade-theme') || 'dark';
			var bladeOffset = +(el.getAttribute('data-blade-offset') || 0);
			var bladeView = new bladeTypes[ bladeViewType ]({ el: el, index: i, bladeTheme: bladeTheme, bladeOffset: bladeOffset, parent: this });
			this.model._bladeObjects.push( bladeView );
		});
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
			this._parallaxObjects.push( item );
		});

		this._parallaxObjectsLength = this._parallaxObjects.length - 1;
	},

	_requestScrollAnimation() {
		if ( this._animFramePending ) return;
		this._animFramePending = true;
		Utils.raf( this._scrollAnimationHandler );
	},

	_scrollAnimationHandler( time ) {
		this._animFramePending = false;
		if ( !this.model._scrollNeedsUpdate ) return;
		this._requestScrollAnimation();
		
		this.model._scrollPos = +( this.model._scrollPos + this.model._scrollVelocity ).toFixed(2);
		this._updateParallaxPositions();
	},

	_updateParallaxPositions() {
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

		if ( this.$_tour && scrollPos > windowHeight*0.5 && scrollPos < windowHeight * 4.5 ) {
			if ( scrollPos > windowHeight*0.5 && scrollPos <= windowHeight ) {
				//	( Starting Y position ) / ( transition distance );
				var opacity = ((scrollPos - windowHeight*0.5) / (windowHeight*0.5));
			} else if ( scrollPos > windowHeight && scrollPos < windowHeight * 4.5 ) {
				var opacity = 1 - (( scrollPos - windowHeight*4 ) / (windowHeight*0.5));
			} else {
				var opacity = 0;
			}

			let opacityCurve = +(Math.pow( opacity , 2 )).toFixed(2)
			this.tourOpacity = Utils.MATH.clamp( opacityCurve, 0, 1 );
			if ( this.tourOpacity !== tourOpacityPrev ) {
				this.$_tour.style.opacity = this.tourOpacity;
			}
		}

		for (var i = this._parallaxObjectsLength; i >= 0; i--) {
			var item = this._parallaxObjects[i];
			item.el.style[ this.model._transformProperty ] = 'translate3d(0,' + (
				(scrollPos * item.parallax * -1) + (( item.offset < windowHeightHalf ? 0 : item.offset - windowHeightHalf) * item.parallax )
			) + 'px,0)';
		}
	},

	_updateViewport() {
		var scroll = this.model._scrollOffset = this._getScroll();
		this.model._windowWidth = window.innerWidth;
		this.model._windowHeight = window.innerHeight;
		this.model._breakpoint = Utils.DOM.getAfterAttr( document.body );
		this.model._scrollPos = scroll;

		if ( this.model._isDeviceBreakpoint ) {
			this.disableParallax();
		} else {
			this.enableParallax();
		}
	
		FRONT.trigger( 'window:reflow', { width: this.model._windowWidth, height: this.model._windowHeight } );
	},

	_setupScroll() {
		var logoPos = Utils.DOM.getPosition( this.$_logo, false );
		this.model._logoOffset = Math.round( logoPos.top + ( logoPos.height / 2 ) );
	},

	_updateScroll() {
		var scroll = this.model._scrollOffset = this._getScroll();

		if ( this.model._isDeviceBreakpoint ) {
			this.model._scrollPos = scroll;
		} else {
			this._requestScrollAnimation();
		}
	},

	_getScroll() {
		return window.pageYOffset || document.documentElement.scrollTop;
	},

	_setScroll( y ) {
		window.scrollTo( 0, y );
	}


});
