

//
//	SEATFROG / Views / Blade
//	


'use strict';

//	Dev
var log = require('bows')('BLADE');

//	App
var FRONT = require('app');
var Utils = require('utils');

//	Dependencies
var View = require('ampersand-view');
var BladeView = require('./blade');

//
//
//

var SlideView = View.extend({

	props: {
		// app: ['state', true, function() { return FRONT.app; }],
		parent: 'state',
		index: ['number', false, 0],
		isWaypointTrackable: ['boolean', true, true],
		_isVisible: ['boolean', false, false],
		_isPrevVisible: ['boolean', false, false]
	},

	session: {
		// Position properties
		offsetTop: ['number', false, 0],
		offsetBottom: ['number', false, 0],
		offsetWidth: ['number', false, 0],
		offsetHeight: ['number', false, 0]
	},

	derived: {
		//	is in viewport
		waypoint: {
			deps: ['index', 'parent.index'],
			fn: function() {
				return +(this.parent.index + '.' + (this.index + 1));
			}
		}
		// isVisible: {
		// 	deps: ['offsetTop', 'app.viewportScrollMid'],
		// 	fn: function() {
		// 		log( 'bladeTour', this.app.viewportScrollMid )
		// 		return this.offsetTop <= this.app.viewportScrollMid && this.offsetBottom > this.app.viewportScrollMid;
		// 	}
		// }
	},

	bindings: {
		'_isVisible': {
			type: 'booleanClass',
			name: '-is-active'
		},
		// '_isPrevVisible': {
		// 	type: 'booleanClass',
		// 	name: '-is-prev'
		// }
	},

	initialize: function() {
		this._reflowHandler = this._reflowHandler.bind(this);
		// this._isVisibleSlideHandler = this._isVisibleSlideHandler.bind(this);

		this.listenTo( FRONT, 'window:reflow', this._reflowHandler );
		this.listenTo( FRONT, 'waypoint:active', waypoint => {
			this._isVisible = ( waypoint.id === this.waypoint ) || ( this.waypoint === 1.1 && waypoint.id === 1 );

			// if ( waypoint.prev ) {
			// 	this._isPrevVisible = waypoint.prev.id === this.waypoint;
			// }
		});

		// this.listenTo( FRONT.app, 'change:viewportScrollMid', this._isVisibleSlideHandler );
	},

	//	Event Handlers	 ----------------

	_reflowHandler: function() {
		var pos = Utils.DOM.getPosition( this.el, false );
		this.offsetTop = pos.top;
		this.offsetBottom = pos.top + pos.height;
		this.offsetWidth = pos.width;
		this.offsetHeight = pos.height;

		FRONT.app.registerWaypoint({ id: this.waypoint, instance: this, top: this.offsetTop, type: 'slide' });
	},

	// _isVisibleSlideHandler: function( app, viewportScrollMid ) {
	// 	var isSlideVisible = this._isSlideVisible = this.offsetTop <= viewportScrollMid && this.offsetBottom > viewportScrollMid;
	// 	if ( !isSlideVisible ) return;
	// 	FRONT.trigger( 'waypoint:active', this.waypoint );
	// },

});


/**
 *	View / Blade
 *  -------------------------------------
 */

module.exports = BladeView.extend({

	props: {
		bladeType: ['string', true, 'tour']
	},

	initialize: function() {
		this.isWaypointTrackable = false;
		BladeView.prototype.initialize.apply(this);

		this.slideObjects = [];
		this._setupSlides();
	},

	//	Event Handlers	 ----------------

	//	Public Methods	 ----------------
	
	//	Private Methods	 ----------------

	_setupSlides: function() {
		var _this = this;
		var $_slideObjects = this.queryAll('[data-hook=slide]');

		$_slideObjects.forEach( function( el, i ) {
			var slideView = new SlideView({ el: el, index: i, parent: _this });
			_this.slideObjects.push( slideView );
		});

		// this.slideObjects[0]._isActive = true;
	},



});