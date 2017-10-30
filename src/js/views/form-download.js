

//
//	SEATFROG / Views / Form Download
//	


'use strict';

//	Dev
var log = require('bows')('FORM-DOWNLOAD');

//	App
var FRONT = require('app');
var Utils = require('utils');
var Templates = require('../base/templates');

//	Dependencies
var View = require('ampersand-view');
var FormView = require('ampersand-form-view');
var InputView = require('ampersand-input-view');
var DataTypeFunctionMixin = require('ampersand-state-mixin-datatype-function');


//
//
//


/**
 *	FormView / Subscribe
 *  -------------------------------------
 */


module.exports = FormView.extend( DataTypeFunctionMixin, {
	template: Templates.Download.Form,

	props: {
		parent: 'state',
		message: 'string',
		dataPhone: ['string', true, ''],
		submitDownload: { type: 'function', required: true },
		showLoader: { type: 'function', required: true }
	},

	bindings: {
		'message': {
			selector: '[data-hook=form-message]',
			type: ( el, value ) => {
				if ( !value || value == '' ) return;
				return el.innerHTML = '<p>' + value + '</p>';
			}
		}
	},

	fields() {
		return [
			new InputView({
				template: '<label data-hook="input-phone"><input type="text" id="fieldPhone" placeholder="e.g. 07777123456" class="-large" required="" name="fieldPhone" tabindex="0"><div data-hook="message-container" class="message message-below message-error" data-anddom-display="" data-anddom-hidden="true" style="display: none;"><p data-hook="message-text">This field is required.</p></div></label>',
				name: 'fieldPhone',
				label: 'Enter your phone number',
				value: this.dataPhone,
				placeholder: 'e.g. 07777123456',
				required: true,
				tests: [
					function ( value ) { 
						if ( !/^(\+?(07|447)\d{8,9})$/.test( value ) ) { 
							return 'Please enter a valid UK mobile phone number.'; 
						}
					}
				],
				parent: this
			})
		];
	},

	render: function () {
		this.renderWithTemplate( this );
		if (this.autoAppend) {
			this.fieldContainerEl = this.el.querySelector('[data-hook~=field-container]') || this.el;
		}
		this._fieldViewsArray.forEach(function renderEachField(fV) {
			this.renderField(fV, true);
		}, this);
		if (this._startingValues) {
			this.setValues(this._startingValues);
			delete this._startingValues;
		}
		this.handleSubmit = this.handleSubmit.bind(this);
		this.el.addEventListener('submit', this.handleSubmit, false);
		this.set('valid', null, {silent: true});
		this.checkValid();
		return this;
	},

	//	Event Handlers	 ----------------

	submitCallback( data ) {
		return this.submitDownload( data );
	}

});