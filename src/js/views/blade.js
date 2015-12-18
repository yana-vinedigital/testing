

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
var Templates = require('tpl');

//
//
//

// var = {};


/**
 *	View / Blade
 *  -------------------------------------
 */

module.exports = View.extend({

	props: {
		// parent: 'state',
		index: ['number', false, 0],
		_isBladeVisible: ['boolean', false, false]
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
		'isVisible': {
			type: 'booleanClass',
			name: '-is-active'
		}
	},

	initialize: function() {
		log( 'blade init', this );
		// this.app = FRONT.app;
		// this._reflowHandler = this._reflowHandler.bind(this);
		// this._reflowHandler();

		// this.listenTo( this.model, 'all', log)
		// this._isVisibleBladeHandler = this._isVisibleBladeHandler.bind(this);

		this.listenTo( FRONT, 'window:reflow', this._reflowHandler );
		// this.listenTo( FRONT.app, 'change:viewportScrollMid', this._isVisibleBladeHandler );
	},

	//	Event Handlers	 ----------------

	_reflowHandler: function() {
		log( 'reflow')
		var pos = Utils.DOM.getPosition( this.el );
		this.offsetTop = pos.top;
		this.offsetBottom = pos.top + pos.height;
		this.offsetWidth = pos.width;
		this.offsetHeight = pos.height;

		FRONT.app.registerWaypoint({ id: this.index, instance: this, top: this.offsetTop });
	},

	// _isVisibleBladeHandler: function( app, viewportScrollMid ) {
	// 	var isBladeVisible = this._isBladeVisible = this.offsetTop <= viewportScrollMid && this.offsetBottom > viewportScrollMid;
	// 	if ( !isBladeVisible ) return;
	// 	FRONT.trigger( 'blade:visible', this.index );
	// 	FRONT.trigger( 'waypoint:active', this.index );
	// },

});