

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
	subscriptionURL: 'https://seatfrog.createsend.com/t/i/s/qiynh/',
	appStoreURL: 'https://itunes.apple.com/app/seatfrog/id1129001637',
	playStoreURL: 'https://play.google.com/store/apps/details?id=au.com.seatfrog.icarus',
	appDeepLink: 'seatfrog://login',
	// smsURL: 'https://d2ieh1yqse.execute-api.us-east-1.amazonaws.com/dev/sms',
	'smsURL': 'https://twk9zgo54k.execute-api.us-east-1.amazonaws.com/dev/sms',
	appStoreReviewURL: 'https://itunes.apple.com/app/id1129001637?action=write-review',
	playStoreReviewURL: 'https://play.google.com/store/apps/details?id=au.com.seatfrog.icarus',
	facebookReviewURL: 'https://www.facebook.com/SeatFrog/reviews/',
	appStoreURLVTEC: 'https://itunes.apple.com/app/apple-store/id1129001637?pt=118038351&ct=VirginTrainsEC_Email&mt=8',
	playStoreURLVTEC: 'https://play.google.com/store/apps/details?id=au.com.seatfrog.icarus&referrer=utm_source%3DVirginTrainsEC%26utm_medium%3Demail',
	rootEl: document.querySelector('[data-hook=app]'),

}, Events.createEmitter() );

//	App Event Listeners		-------------

window.addEventListener('DOMContentLoaded', function () {
	FRONT.trigger('dom:start');
});
window.addEventListener('load', function () {
	FRONT.trigger('dom:ready');
	window.cookieconsent.initialise({
		 "palette": {
			"popup": {
				"background": "#1e1f2f",
				"text": "#CBCBD0"
			},
			"button": {
				"background": "#d8ed1f",
				"text": "#1e1f2f"
			}
		},
		"theme": "classic",
		"content": {
			"message": "This site uses cookies. By continuing to browse the site you are agreeing to our use of cookies.",
			"link": "Find out more",
			"href": "http://www.seatfrog.com/privacy.html"
		}

	});
});


/**
 *	Exports
 *  -------------------------------------
 */

module.exports = FRONT;