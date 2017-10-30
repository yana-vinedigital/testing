

//
//	SEATFROG / Views / Blade
//	


'use strict';

//	Dev
var log = require('bows')('BLADE');

//	App
var FRONT = require('app');
var Utils = require('utils');
var Carousel = require('../base/carousel');

//	Dependencies
var View = require('ampersand-view');

//
//
//


/**
 *	View / Blade
 *  -------------------------------------
 */

module.exports = View.extend( Carousel, {

	props: {
		parent: 'state',
		index: ['number', false, 0],
		bladeName: ['string', true, 'default'],
		bladeType: ['string', true, 'default'],
		bladeTheme: ['string', true, 'dark'],
		bladeOffset: ['number', true, 0],
		isWaypointTrackable: ['boolean', true, true],
		_isBladeVisible: ['boolean', false, false],

		// _isActive: ['boolean', false, false]
	},

	session: {
		// Position properties
		offsetTop: ['number', false, 0],
		offsetBottom: ['number', false, 0],
		offsetWidth: ['number', false, 0],
		offsetHeight: ['number', false, 0]
	},

	derived: {
		//	Is in viewport

		// isBladeVisible: {
		// 	deps: ['app.viewportScrollMid', 'offsetTop'],
		// 	fn: function() {
		// 		log( 'blade visible', this.app.viewportScrollMid, this.offsetTop )
		// 		return this.offsetTop <= this.app.viewportScrollMid && this.offsetBottom > this.app.viewportScrollMid;
		// 	}
		// }

	},

	bindings: {
		'_isBladeVisible': {
			type: 'booleanClass',
			name: '-is-active'
		}
	},

	initialize: function() {
		var _this = this;
		// this.app = FRONT.app;
		// this._reflowHandler = this._reflowHandler.bind(this);
		// this._reflowHandler();
   
		// this.listenTo( this.model, 'all', log)
		// this._isVisibleBladeHandler = this._isVisibleBladeHandler.bind(this);
		// 
		
		//	UI	 --------------------
		this.$_uiCarousel = this.query('[data-component=ui-carousel]');

		if ( this.$_uiCarousel ) {
			this.$_uiCarouselItems = [].slice.call( this.$_uiCarousel.querySelectorAll('.carousel-item') );

			this.carousel = this.initializeCarousel({ 
				el: this.$_uiCarousel,
				$items: this.$_uiCarouselItems,
				app: this.parent.model,
				hasNav: true,
				// hasPoints: false,
				// hasPercentageLayout: false,
				breakpoints: {
					type: 'min',
					target: 'mobile'
				}
			});
		}

		//	Events	 ----------------
		this.listenTo( FRONT, 'window:reflow', this._reflowHandler );
		this.listenTo( FRONT, 'waypoint:active', waypoint => {
			if ( !waypoint ) return;
			this._isBladeVisible = Math.floor( waypoint.id ) === this.index;
		});
	},

	//	Event Handlers	 ----------------

	_reflowHandler: function() {
		var pos = Utils.DOM.getPosition( this.el, true );
		this.offsetTop = pos.top;
		this.offsetBottom = pos.top + pos.height;
		this.offsetWidth = pos.width;
		this.offsetHeight = pos.height;

		FRONT.app.registerWaypoint({ id: this.index, name: this.bladeName, instance: this, top: this.offsetTop, offset: this.bladeOffset, type: 'blade' });
	},

	// _isVisibleBladeHandler: function( app, viewportScrollMid ) {
	// 	var isBladeVisible = this._isBladeVisible = this.offsetTop <= viewportScrollMid && this.offsetBottom > viewportScrollMid;
	// 	if ( !isBladeVisible ) return;
	// 	FRONT.trigger( 'blade:visible', this.index );
	// 	FRONT.trigger( 'waypoint:active', this.index );
	// },

});