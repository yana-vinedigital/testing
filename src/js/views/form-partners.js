

//
//	SEATFROG / Views / Form Subscribe
//	


'use strict';

//	Dev
var log = require('bows')('FORM-SUBSCRIBE');

//	App
var FRONT = require('app');
var Utils = require('utils');

//	Dependencies
var View = require('ampersand-view');
var InputView = require('ampersand-input-view');
var FormSubscribeView = require('./form-subscribe');
var ContextThanksPartnersView = require('../views/context-thanks-partners');


//
//
//


/**
 *	FormView / Subscribe
 *  -------------------------------------
 */

module.exports = FormSubscribeView.extend({

	template: '<form action="http://email.seatfrog.com/t/i/s/uljthu/" method="post" id="subForm" data-hook="form-partners"><fieldset data-hook="field-container"></fieldset></form>',

	fields() {
		return [
			new InputView({
				template: '<label class="field -half"><input type="text" id="fieldFirstName" class="-large" required /><div data-hook="message-container" class="message message-below message-error"><p data-hook="message-text"></p></div></label>',
				name: 'cm-f-uktdjh',
				label: 'First name',
				placeholder: 'First name',
				required: true,
				tests: [],
				parent: this
			}),
			new InputView({
				template: '<label class="field -half"><input type="text" id="fieldSurname" class="-large" required /><div data-hook="message-container" class="message message-below message-error"><p data-hook="message-text"></p></div></label>',
				name: 'cm-f-uktdjk',
				label: 'Surname',
				placeholder: 'Surname',
				required: true,
				tests: [],
				parent: this
			}),
			new InputView({
				template: '<label class="field -half"><input type="text" id="fieldOrganisation" class="-large" required /><div data-hook="message-container" class="message message-below message-error"><p data-hook="message-text"></p></div></label>',
				name: 'cm-f-uktdyk',
				label: 'Organisation',
				placeholder: 'Organisation',
				required: true,
				tests: [],
				parent: this
			}),
			new InputView({
				template: '<label class="field -half"><input type="text" id="fieldContactNumber" class="-large" required /><div data-hook="message-container" class="message message-below message-error"><p data-hook="message-text"></p></div></label>',
				name: 'cm-f-uktdyu',
				label: 'Contact number',
				placeholder: 'Contact number',
				required: true,
				tests: [
					function ( value ) { 
						if ( !/^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{2})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/gm.test( value ) ) { 
							return 'Please enter a valid phone number.'; 
						}
					}
				],
				parent: this
			}),
			new InputView({
				template: '<label class="field -half"><input type="email" id="fieldEmail" class="-large" required /><div data-hook="message-container" class="message message-below message-error"><p data-hook="message-text"></p></div></label>',
				type: 'email',
				name: 'cm-uljthu-uljthu',
				label: 'Email address',
				placeholder: 'Email address',
				required: true,
				tests: [
					function ( value ) { 
						if ( !/[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g.test( value ) ) { 
							return 'Please enter a valid email address.'; 
						}
					} 
				],
				parent: this
			})
		];
	},
	
	showThanks() {
		var view = new ContextThanksPartnersView({ parent: this.parent });
		FRONT.appView.openContext( view );
	}

});