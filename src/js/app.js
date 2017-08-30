

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
	breakpoints: [ 
		'mobile', 
		'smartphone', 
		'smartphone-wide', 
		'tablet', 
		'tablet-wide', 
		'default', 
		'desktop', 
		'med-desktop', 
		'large-desktop' 
	],
	subscriptionURL: 'http://email.seatfrog.com/t/i/s/qiynh/',
	appStoreURL: 'https://itunes.apple.com/app/seatfrog/id1129001637',
	playStoreURL: 'https://play.google.com/store/apps/details?id=au.com.seatfrog.icarus',
	smsURL: 'https://d2ieh1yqse.execute-api.us-east-1.amazonaws.com/dev/sms',
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