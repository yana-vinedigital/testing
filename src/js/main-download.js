

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


var DownloadView = View.extend({

	initialize() {
		this._os = MD.os();
		var endpoint = 'http://seatfrog.com/virgintrainseastcoast.html';

		if ( this._os === 'iOS' ) {
			endpoint = FRONT.appStoreURL;
		}
		if ( this._os === 'AndroidOS' ) {
			endpoint = FRONT.playStoreURL;
		}
		return window.location.replace( endpoint );
	}
});



	
/**
 *	App Initialization
 *  -------------------------------------
 */

FRONT.on('dom:start', () => {
	FRONT.downloadView = new DownloadView({ el: document.documentElement });
});