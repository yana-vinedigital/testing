

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
var DataTypeFunctionMixin = require('ampersand-state-mixin-datatype-function');

//
//
//


/**
 *	View / Thanks
 *  -------------------------------------
 */

module.exports = View.extend( DataTypeFunctionMixin, {
	template: Templates.Download.Thanks,

	props: {
		sentNumber: ['string', true, ''],
		resetDownload: { type: 'function', required: true },
	},

	bindings: {
		'sentNumber': '[data-hook=sent-number]'
	},

	events: {
		'click [data-hook=reset]': '_clickResetHandler'
	},

	_clickResetHandler: function ( e ) {
		e.preventDefault();
		this.resetDownload();
	},

});