

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
	appStoreURLVTEC1: 'https://itunes.apple.com/app/apple-store/id1129001637?pt=118038351&ct=VirginTrainsEC_SMS_1&mt=8',
	playStoreURLVTEC1: 'https://play.google.com/store/apps/details?id=au.com.seatfrog.icarus&referrer=utm_source%3DVirginTrainsEC%26utm_medium%3DSMS1',
	appStoreURLVTEC2: 'https://itunes.apple.com/app/apple-store/id1129001637?pt=118038351&ct=VirginTrainsEC_SMS_2&mt=8',
	playStoreURLVTEC2: 'https://play.google.com/store/apps/details?id=au.com.seatfrog.icarus&referrer=utm_source%3DVirginTrainsEC%26utm_medium%3DSMS2',
	appStoreURLLNER: 'https://itunes.apple.com/app/apple-store/id1129001637?pt=118038351&ct=email_lnerlaunch_s&mt=8',
	playStoreURLLNER: 'https://play.google.com/store/apps/details?id=au.com.seatfrog.icarus&referrer=utm_source%3Demail%26utm_campaign%3Dlnerlaunch_s',
	appStoreURLLNER1: 'https://itunes.apple.com/app/apple-store/id1129001637?pt=118038351&ct=email_lnerfollowup_s&mt=8',
	playStoreURLLNER1: 'https://play.google.com/store/apps/details?id=au.com.seatfrog.icarus&referrer=utm_source%3Demail%26utm_campaign%3Dlnerfollowup_s',
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