

//
//	SEATFROG / Views / Context Signup Airline
//	


'use strict';

//	Dev
var log = require('bows')('CONTEXT-SIGNUP-AIRLINE');

//	App
var FRONT = require('app');
var Utils = require('utils');
var Templates = require('../base/templates');

//	Dependencies
var View = require('ampersand-view');
var InputView = require('ampersand-input-view');
var FormSubscribeView = require('./form-subscribe');


//
//
//


/**
 *	View / Context Signup Airline
 *  -------------------------------------
 */

module.exports = View.extend({
	template: Templates.Global.ContextSignupAirline,

	props: {
		dataEmail: ['string', true, ''],
		_isAirlineSelected: ['boolean', true, false],
		_isAirlineOtherSelected: ['boolean', true, false],
	},

	bindings: {
		'_isAirlineSelected': {
			type: 'booleanClass',
			name: '-is-airline-selected'
		},
		'_isAirlineOtherSelected': {
			type: 'booleanClass',
			name: '-is-other-selected'
		},
	},

	events: {
		'click [data-hook=airline-radio]': '_onRadioClickHandler'
	},

	render() {
		this.renderWithTemplate( this );

		this.$_formSignupAirline = this.queryByHook('form-signup-airline');
		this.v_formSignupAirline = new FormSubscribeView({
			dataEmail: this.dataEmail,
			el: this.$_formSignupAirline,
			fields() {
				return [
					new InputView({
						type: 'hidden',
						template: '<label class="input-email"><input type="hidden" id="fieldEmail" placeholder="" required /></label>',
						name: 'cm-qiynh-qiynh',
						value: this.dataEmail,
						required: true,
						tests: [
							function ( value ) { 
								if ( !/[A-Za-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?/g.test( value ) ) { 
									return 'Please enter a valid email address.'; 
								}
							}
						],
						parent: this
					}),
					new InputView({
						template: '<label data-hook="input-airline" class="input-airline"><input type="text" id="fieldbtrdut" placeholder="" class="-large" required /><div data-hook="message-container" class="message message-below message-error"><p data-hook="message-text"></p></div></label>',
						name: 'cm-f-btrdut',
						label: 'Airline',
						placeholder: 'Name of the airline',
						tests: [
							function ( value ) { 
								if ( !/^[A-Za-z0-9_-\s]+$/.test( value ) ) { 
									return 'Please enter an airline name.'; 
								}
							}
						],
						required: true
					})
				];
			},
			parent: this,
		});

		this.registerSubview( this.v_formSignupAirline );
		return this;
	},

	_onRadioClickHandler( e ) {
		var inputTarget = e.delegateTarget;

		this._isAirlineSelected = true;
		this._isAirlineOtherSelected = inputTarget.getAttribute('id') === 'other';
		this.v_formSignupAirline.setValue( 'cm-f-btrdut', inputTarget.value );
	}
});