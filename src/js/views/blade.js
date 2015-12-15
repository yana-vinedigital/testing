

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
		_isActive: ['boolean', false, false]
	},

	session: {
		// Position properties
		offsetTop: ['number', false, 0],
		offsetWidth: ['number', false, 0],
		offsetHeight: ['number', false, 0]
	},

	derived: {
		//	Is in viewport
		isVisible: {
			deps: ['offsetTop', 'parent._scrollPos', 'parent._windowHeight'],
			fn: function() {
				if ( !this.isScrollHiding ) return true;
				return this.isDisplay && this.offsetTop <= (this.app.windowOffset + this.app.windowHeight * 0.85);
			}
		}
	},

	bindings: {
		'_isActive': {
			type: 'booleanClass',
			name: '-is-active'
		}
	},

	initialize: function() {
		this._reflowHandler = this._reflowHandler.bind(this);
		this._isVisibleBladeHandler = this._isVisibleBladeHandler.bind(this);

		this.listenToAndRun( FRONT, 'window:reflow', this._reflowHandler );
		this.on( 'change:isVisible', this._isVisibleBladeHandler );
	},

	//	Event Handlers	 ----------------

	_reflowHandler: function() {
		var pos = Utils.DOM.getPosition( this.el );
		this.offsetTop = pos.top;
		this.offsetWidth = pos.width;
		this.offsetHeight = pos.height;
	},

	_isVisibleBladeHandler: function( component ) {
		if ( !this.isVisible ) return;
		FRONT.trigger( 'blade:visible', this );
	},

});