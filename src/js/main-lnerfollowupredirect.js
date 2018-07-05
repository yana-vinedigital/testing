

//
//	SEATFROG - LNER Follow Up Redirect
//  Used in campaign email links sent by LNER
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


var LNERFollowUpRedirectView = View.extend({

	initialize() {
		this._os = MD.os();
        var endpoint = 'http://seatfrog.com/lner.html';

		if ( this._os === 'iOS' ) {
			endpoint = FRONT.appStoreURLLNER1;
		}
		if ( this._os === 'AndroidOS' ) {
			endpoint = FRONT.playStoreURLLNER1;
		}
		return window.location.replace( endpoint );
	}
});



	
/**
 *	App Initialization
 *  -------------------------------------
 */

FRONT.on('dom:start', () => {
	FRONT.LNERFollowUpRedirectView = new LNERFollowUpRedirectView({ el: document.documentElement });
});