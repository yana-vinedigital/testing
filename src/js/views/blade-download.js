

//
//	SEATFROG / Views / Blade
//	


'use strict';

//	Dev
var log = require('bows')('BLADE');

//	App
var FRONT = require('app');
var Utils = require('utils');
var Templates = require('../base/templates');

//	Dependencies
var Region = require('ampersand-view-switcher');
var View = require('ampersand-view');
var BladeView = require('./blade');
var FormDownloadView = require('./form-download');
var DownloadThanksView = require('./download-thanks');


//
//
//


/**
 *	View / Blade
 *  -------------------------------------
 */

module.exports = BladeView.extend({

	props: {
		bladeType: ['string', true, 'download'],
		dataPhone: ['string', false, '']
	},

	session: {
		_isViewLoading: ['boolean', true, false],
		_isViewThanks: ['boolean', true, false],
		_isSubmitted: ['boolean', true, false]
	},

	bindings: {
		'_isViewThanks': {
			type: 'booleanClass',
			name: '-is-sent'
		}
	},

	initialize: function() {
		this.isWaypointTrackable = false;
		BladeView.prototype.initialize.apply(this);

		this.showLoader = this.showLoader.bind(this);
		this.submitDownload = this.submitDownload.bind(this);
		this.resetDownload = this.resetDownload.bind(this);

		this.$_downloadRegion = this.query('[data-region=download]');
		this.v_downloadRegion = new Region({ el: this.$_downloadRegion });
		this.registerSubview( this.v_downloadRegion );

		// this.showThanks();
		this.showForm();
	},

	//	Event Handlers	 ----------------

	//	Public Methods	 ----------------
	
	showForm: function( message = null ) {
		var view = new FormDownloadView({
			message: message,
			dataPhone: this.dataPhone,
			submitDownload: this.submitDownload, 
			showLoader: this.showLoader 
		});
		this.v_downloadRegion.set( view );
	},

	showThanks() {
		var view = new DownloadThanksView({ 
			sentNumber: this.dataPhone, 
			resetDownload: this.resetDownload 
		});
		this.v_downloadRegion.set( view );
		this._isViewThanks = true;
	},

	showLoader() {
		var view = new View({
			template: '<div class="download-loader"><div class="loader"></div></div>',
			parent: this 
		});
		this.v_downloadRegion.set( view );
		this._isViewLoading = true;
	},

	submitDownload( data ) {
		if ( this._isSubmitted ) return;

		this._isSubmitted = true;
		this.dataPhone = data.fieldPhone.replace(/\s/g,'');
		this.showLoader();

		Utils.xhr({
			method: 'post',
			uri: FRONT.smsURL,
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				phoneNumber: this.dataPhone
			})
		}, ( err, resp, body ) => {
			if (body.status === "ERROR") return this.showForm('Please enter a valid UK mobile phone number.');
			if ( err || resp.statusCode !== 200 ) return this.showForm('Something seems to have gone wrong, please try again.');
			return this.showThanks();
		});
	},

	resetDownload() {
		this._isSubmitted = false;
		this._isViewThanks = false;
		this.showForm();
	}

	//	Private Methods	 ----------------

	



});