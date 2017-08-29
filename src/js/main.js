

//
//	FRONTIER / Main
//	


'use strict';

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
var Browser = require('detect-browser');
var MobileDetect = require('mobile-detect');
var State = require('ampersand-state');

//	Views
var AppView = require('./views/app');

var MD = new MobileDetect( window.navigator.userAgent );


//
//
//


/**
 *	State / App
 *  -------------------------------------
 */

var AppState = State.extend({

	props: {
		_browser: 'object',
		_os: 'string',

		_windowWidth: ['number', true, window.innerWidth],
		_windowHeight: ['number', true, window.innerHeight],
		_headerHeight: ['number', true, 0],
		_breakpoint: ['string', true, 'default'],
		_logoOffset: ['number', true, 0],

		_transformProperty: 'string',
		_hasTransforms3d: ['boolean', true, false],
		_isTouch: ['boolean', true, false],
		_isParallaxEnabled: ['boolean', true, false],

		_isMenuOpen: ['boolean', false, false],
		_isContextOpen: ['boolean', true, false],
		_scrollFriction: ['number', true, 0.15],
		_scrollOffset: ['number', true, window.pageYOffset],
		_scrollPos: ['number', true, window.pageYOffset],

		_waypoints: ['array', false, () => []],
		_isWaypointsReady: ['boolean', false, false],
		_waypointMap: ['array', false, () => []],
		_bladeObjects: ['array', false, () => []],
		_bladeMap: ['array', false, () => []]
	},

	session: {
		_currentWaypointTop: 'number',
		_currentBladeTop: ['number', true, 0],
		_isScrollTopSection: ['boolean', false, true],
	},
	
	derived: {
		_isBrowserIE: {
			deps: ['_browser'],
			fn() {
				return this._browser.name == 'ie';
			}
		},
		_isDeviceBreakpoint: {
			deps: ['_breakpoint'],
			fn: function() {
				return Utils.MQ['max']('tablet-wide', this._breakpoint, FRONT.breakpoints );
			}
		},
		_isDevice: {
			deps: ['_isDeviceBreakpoint', '_isTouch'],
			fn() {
				return this._isDeviceBreakpoint && this._isTouch;
			}
		},
		_scrollDiff: {
			deps: ['_scrollOffset', '_scrollPos', '_isDevice'],
			fn: function() {
				if ( this._isDevice ) return 0;
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
			fn() {
				return Math.abs( this._scrollDiff ) > 1;
			}
		},
		// _currentBladeTop: {
		// 	deps: ['_scrollPos', '_bladeMap'],
		// 	fn: function() {
		// 		if ( this.fn ) this.fn.cancel();
		// 		this.fn = Utils.throttle(() => this.getCurrentWaypointLogo( this._scrollPos ), 250, { leading: true, trailing: true });
		// 		return this.fn();
		// 	}
		// },
		// _currentWaypointTop: {
		// 	deps: ['_isWaypointsReady', '_scrollPos', '_waypointMap'],
		// 	fn: function() {
		// 		var currentWaypointBlade = this.getCurrentWaypointBlade();
		// 		log( 'fnnn', currentWaypointBlade);
		// 		return currentWaypointBlade;
		// 	}
		// },
		// _isScrollTopSection: {
		// 	deps: ['_scrollPos', '_windowHeight', '_isDeviceBreakpoint'],
		// 	fn: function() {
		// 		return Utils.throttle( () => {
		// 			var isScrollTop = ( this._scrollPos < this._windowHeight * 0.25 );
		// 			return isScrollTop && !this._isDeviceBreakpoint;
		// 		}, 250, { leading: true, trailing: true })();
		// 	}
		// },
		// _currentBlade: {
		// 	deps: ['_isWaypointsReady', '_currentBladeTop'],
		// 	fn: function() {
		// 		if ( typeof this._currentBladeTop === 'undefined' || !this._isWaypointsReady ) return;
		// 		let blade = Utils.find( this._waypoints, { bladeTop: this._currentBladeTop, type: 'blade' } );
		// 		return blade; //typeof blade === 'undefined' ? undefined : blade;
		// 	}
		// },
		// _currentBladeId: {
		// 	deps: ['_currentBlade'],
		// 	fn() {
		// 		return this._currentBlade.id;
		// 	}
		// },
		// _headerTheme: {
		// 	deps: ['_isWaypointsReady', '_currentBlade', '_isDeviceBreakpoint'],
		// 	fn: function() {
		// 		if ( !this._isWaypointsReady ) return;
		// 		if ( this._isDeviceBreakpoint || typeof this._currentBlade === 'undefined' ) return;
		// 		if ( typeof this._currentBlade.instance.bladeTheme === 'undefined' ) return 'dark';
		// 		return this._currentBlade.instance.bladeTheme;
		// 	}
		// },
		_currentWaypoint: {
			deps: ['_isWaypointsReady', '_currentWaypointTop', '_waypoints'],
			fn: function() {
				if ( !this._isWaypointsReady || typeof this._currentWaypointTop === 'undefined' ) return;
				var waypoint = Utils.find( this._waypoints, { top: this._currentWaypointTop } );
				// if ( !waypoint ) debugger;
				return waypoint;
			}
		},
		_waypointTheme: {
			deps: ['_isWaypointsReady', '_currentWaypoint', '_isDeviceBreakpoint'],
			fn: function() {
				if ( !this._isWaypointsReady ) return;
				if ( this._isDeviceBreakpoint || typeof this._currentWaypoint === 'undefined' ) return;
				if ( this._currentWaypoint.type === 'slide' || this._currentWaypoint.instance.bladeType === 'tour' ) return 'tour';
				if ( typeof this._currentWaypoint.instance.bladeTheme === 'undefined' ) return 'dark';
				return this._currentWaypoint.instance.bladeTheme;
			}
		},
		_currentWaypointIndex: {
			deps: ['_isWaypointsReady', '_currentWaypoint'],
			fn() {
				if ( !this._isWaypointsReady ) return;
				return this._waypoints.indexOf( this._currentWaypoint );
			}
		},
		_isLastWaypoint: {
			deps: ['_isWaypointsReady', '_currentWaypointIndex' ],
			fn() {
				if ( !this._isWaypointsReady || this._currentWaypointIndex === -1 ) return;
				return this._currentWaypointIndex === this._waypoints.length - 1;
			}
		}
	},

	initialize() {
		this._browser = Browser;
		this._os = MD.os();
		this._transformProperty = Modernizr.prefixed('transform');
		this._hasTransforms3d = Modernizr.csstransforms3d;
		this._isTouch = Modernizr.touchevents;

		//	If QS has ?downloadapp=1 - redirect to appropriate app store.
		this.checkDownloadRedirect();

		// 	Async Derived Properties	 ------------

		//	_currentBladeTop
		// this.on('change:_isWaypointsReady change:_scrollPos change:_bladeMap', Utils.throttle(() => {
		// 	this._currentBladeTop = this.getCurrentWaypointLogo();
		// }, 250));
		//	_currentWaypointTop
		this.on('change:_isWaypointsReady change:_scrollPos change:_waypointMap', Utils.throttle(() => {
			if ( !this._isWaypointsReady ) return;
			this._currentWaypointTop = this.getCurrentWaypointBlade();
		}, 50));
		//	_isScrollTopSection
		this.on('change:_windowHeight change:_scrollPos change:_isDeviceBreakpoint', Utils.throttle(() => {
			this._isScrollTopSection = ( this._scrollPos < this._windowHeight * 0.25 )
		}, 250));
	},

	checkDownloadRedirect() {
		if ( Utils.getQsParam('downloadapp') !== '1' ) return;

		if ( this._os === 'iOS' ) {
			return window.location.replace( FRONT.appStoreURL );
		}
		if ( this._os === 'AndroidOS' ) {
			return window.location.replace( FRONT.playStoreURL );
		}
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

		// console.log('registerWaypoint', this._bladeMap.length, this._bladeObjects.length);
		if ( this._waypointMap.length >= this._bladeObjects.length ) {
			this._isWaypointsReady = true;
			// console.log('_isWaypointsReady');
		}
	},

	// getCurrentWaypointLogo() {
	// 	var waypoint = Utils.find( this._bladeMap, ( top ) => {
	// 		return top <= ( this._scrollPos + this._logoOffset );
	// 	});
	// 	return typeof waypoint === 'undefined' ? 0 : waypoint;
	// },

	getCurrentWaypointBlade() {
		var waypoint = Utils.find( this._waypointMap, ( top ) => {
			return top <= ( this._scrollPos + this._windowHeight * 0.5 );
		});
		return typeof waypoint === 'undefined' ? 0 : waypoint;
	},

	getNextWaypoint() {
		var nextWaypointIndex = Utils.MATH.clamp( this._currentWaypointIndex + 1, 0, this._waypoints.length - 1);
		nextWaypointIndex = nextWaypointIndex < this._waypoints.length ? nextWaypointIndex : currWaypointIndex;

		var nextWaypoint = this._waypoints[ nextWaypointIndex ];
		nextWaypoint = nextWaypoint.instance.isWaypointTrackable ? nextWaypoint : this._waypoints[ Utils.MATH.clamp( nextWaypointIndex + 1, 0, this._waypoints.length - 1 ) ];

		return nextWaypoint;
	}

});




/**
 *	App Initialization
 *  -------------------------------------
 */

FRONT.on('dom:start', () => {
	FRONT.app = new AppState();
	FRONT.appView = new AppView({ el: document.documentElement, model: FRONT.app });
});

FRONT.on('dom:ready', () => {
	FRONT.trigger('viewport:update');
});