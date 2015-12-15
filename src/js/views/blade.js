

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
		parent: 'state',
		index: ['number', false, 0],
		_isActive: ['boolean', false, false]
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
		isVisible: {
			deps: ['offsetTop', 'parent._scrollPos', 'parent._windowHeight'],
			fn: function() {
				var viewportMid = this.parent._scrollPos + this.parent._windowHeight * 0.5;
				return this.offsetTop <= viewportMid && this.offsetBottom >= viewportMid;
			}
		}
	},

	bindings: {
		'isVisible': {
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
		this.offsetBottom = pos.top + pos.height;
		this.offsetWidth = pos.width;
		this.offsetHeight = pos.height;
	},

	_isVisibleBladeHandler: function() {
		if ( !this.isVisible ) return;
		FRONT.trigger( 'blade:visible', this );
	},

});