

//
//	FRONTIER / App Namespace
//


'use strict';

//	Dependencies
var Utils = require('utils');
var Events = require('ampersand-events');



/**
 *	Application Singleton
 *  -------------------------------------
 */

var FRONT = window.FRONT = window.FRONT || Utils.extend({

	controllers: {},
	dirs: {
		img: '/img/'
	},
	rootEl: document.querySelector('[data-hook=app]'),

}, Events.createEmitter() );

//	App Event Listeners		-------------

window.addEventListener('DOMContentLoaded', function () {
	FRONT.trigger('dom:start');
});
window.addEventListener('load', function () {
	FRONT.trigger('dom:ready');
});


/**
 *	Exports
 *  -------------------------------------
 */

module.exports = FRONT;