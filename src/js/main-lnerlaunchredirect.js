

//
//	SEATFROG - LNER Launch Redirect
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


var LNERLaunchRedirectView = View.extend({

	initialize() {
		this._os = MD.os();
        var endpoint = 'http://seatfrog.com/lner.html';

		if ( this._os === 'iOS' ) {
			endpoint = FRONT.appStoreURLLNER;
		}
		if ( this._os === 'AndroidOS' ) {
			endpoint = FRONT.playStoreURLLNER;
		}
		return window.location.replace( endpoint );
	}
});



	
/**
 *	App Initialization
 *  -------------------------------------
 */

FRONT.on('dom:start', () => {
	FRONT.LNERLaunchRedirectView = new LNERLaunchRedirectView({ el: document.documentElement });
});