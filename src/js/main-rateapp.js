

//
//	SEATFROG / Download Redirect
//	


'use strict';

//	Dependencies
var View = require('ampersand-view');

//	App
var FRONT = require('app');
var MobileDetect = require('mobile-detect');
var MD = new MobileDetect( window.navigator.userAgent );


//
//
//


var RateAppView = View.extend({

	initialize() {
		this._os = MD.os();
        var endpoint = FRONT.facebookReviewURL;

		if ( this._os === 'iOS' ) {
			endpoint = FRONT.appStoreReviewURL;
		}
		if ( this._os === 'AndroidOS' ) {
			endpoint = FRONT.playStoreReviewURL;
		}
		return window.location.replace( endpoint );
	}
});



	
/**
 *	App Initialization
 *  -------------------------------------
 */

FRONT.on('dom:start', () => {
	FRONT.rateAppView = new RateAppView({ el: document.documentElement });
});