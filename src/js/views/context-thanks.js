

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
	template: Templates.Global.ContextSignupThanks,

	props: {
		currentUrl: ['string', false, document.URL],
		shareTitle: ['string', false, document.title],
	},

	events: {
		'click [data-hook=share]': '_clickSocialShareHandler'
	},

	_clickSocialShareHandler: function ( e ) {
		e.preventDefault();
		var target = Utils.DOM.closest( e.target || e.srcElement, 'a' );
		if ( !target ) return;
		
		var href = target.getAttribute('href')
			.replace('{text}', encodeURIComponent( this.shareTitle ))
			.replace('{url}', encodeURIComponent( this.currentUrl ));

		var width   = 575,
			height  = 400,
			left    = (window.innerWidth  - width)  / 2,
			top     = (window.innerHeight - height) / 2,
			url     = href,
			options = 'status=1' +
					  ',width='  + width  +
					  ',height=' + height +
					  ',top='    + top    +
					  ',left='   + left;
		window.open(url, 'social-popup', options);
	},

});