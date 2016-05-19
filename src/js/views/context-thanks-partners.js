

//
//	SEATFROG / Views / Form Thanks
//	


'use strict';

//	Dev
var log = require('bows')('FORM-SUBSCRIBE');

//	App
var FRONT = require('app');
var Utils = require('utils');
var Templates = require('../base/templates');

//	Dependencies
var View = require('ampersand-view');

//
//
//


/**
 *	View / Thanks
 *  -------------------------------------
 */

module.exports = View.extend({
	template: Templates.Global.ContextSignupThanksPartners,

	props: {
		currentUrl: ['string', false, document.URL],
	}

});