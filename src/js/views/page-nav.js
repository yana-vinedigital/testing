

//
//	SEATFROG / Views / Page Nav
//	


'use strict';

//	Dev
var log = require('bows')('PAGENAV');

//	App
var FRONT = require('app');
var Utils = require('utils');

//	Dependencies
var View = require('ampersand-view');


//
//
//

var NavItemView = View.extend({

	props: {
		parent: 'state',
		index: ['number', false, 0],
		waypoint: 'number'
	},

	derived: {
		_isActive: {
			deps: ['parent.waypointActive', 'waypoint'],
			fn: function() {
				return (this.parent.waypointActive === this.waypoint) || ( this.waypoint === 1.1 && this.parent.waypointActive === 1 );
			}
		}
	},

	bindings: {
		'_isActive': {
			type: 'booleanClass',
			name: '-is-active'
		}
	},

	// events: {
	// 	'click a': '_clickHandler'
	// },

	// _clickHandler: function( e ) {
	// 	e.preventDefault();
	// 	FRONT.trigger( 'waypoint:go', this.waypoint );
	// },

});


/**
 *	View / Page Nav
 *  -------------------------------------
 */

module.exports = View.extend({

	props: {
		waypointActive: ['number', true, 0]
	},

	derived: {
		_isTourIndex: {
			deps: ['waypointActive'],
			fn: function() {
				return this.waypointActive > 0 && this.waypointActive < 2;
			}
		}
	},

	bindings: {
		'_isTourIndex': {
			type: 'booleanClass',
			name: '-is-tour-active'
		}
	},



	initialize: function() {
		var _this = this;
		this.v_navItems = [];
		this._setupNavItems();

		this.listenTo( FRONT, 'waypoint:active', function( waypoint ) {
			if ( !waypoint ) return;
			_this.waypointActive = +(waypoint.id);
		});
	},

	//	Event Handlers	 ----------------



	//	Public Methods	 ----------------
	
	//	Private Methods	 ----------------

	_setupNavItems: function() {
		var _this = this;
		var $_navItems = this.queryAll('li');

		$_navItems.forEach( function( el, i ) {
			var waypoint = +el.getAttribute('data-nav-waypoint');
			var v_navItem = new NavItemView({ el: el, index: i, waypoint: waypoint, parent: _this });
			_this.v_navItems.push( v_navItem );
		});

		// this.slideObjects[0]._isActive = true;
	},



});