

//
//	SEATFROG - VTEC Download Redirect
//  Used in campaign email links sent by VTEC
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


var VTECRedirectView = View.extend({

	initialize() {
		this._os = MD.os();
        var endpoint = 'http://seatfrog.com/virgintrainseastcoast.html';

		if ( this._os === 'iOS' ) {
			endpoint = FRONT.appStoreURLVTEC;
		}
		if ( this._os === 'AndroidOS' ) {
			endpoint = FRONT.playStoreURLVTEC;
		}
		return window.location.replace( endpoint );
	}
});



	
/**
 *	App Initialization
 *  -------------------------------------
 */

FRONT.on('dom:start', () => {
	FRONT.VTECRedirectView = new VTECRedirectView({ el: document.documentElement });
});