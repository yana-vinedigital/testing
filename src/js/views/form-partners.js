

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

	template: '<form action="https://seatfrog.createsend.com/t/i/s/uljto/" method="post" id="subForm" data-hook="form-partners"><fieldset data-hook="field-container"></fieldset></form>',

	fields() {
		return [
			new InputView({
				template: '<label class="field -half"><input type="text" id="fieldFirstName" class="-large" required /><div data-hook="message-container" class="message message-below message-error"><p data-hook="message-text"></p></div></label>',
				name: 'cm-f-uktdty',
				label: 'First name',
				placeholder: 'First name',
				required: true,
				tests: [],
				parent: this
			}),
			new InputView({
				template: '<label class="field -half"><input type="text" id="fieldSurname" class="-large" required /><div data-hook="message-container" class="message message-below message-error"><p data-hook="message-text"></p></div></label>',
				name: 'cm-f-uktdtj',
				label: 'Surname',
				placeholder: 'Surname',
				required: true,
				tests: [],
				parent: this
			}),
			new InputView({
				template: '<label class="field -half"><input type="email" id="fieldEmail" class="-large" required /><div data-hook="message-container" class="message message-below message-error"><p data-hook="message-text"></p></div></label>',
				type: 'email',
				name: 'cm-uljto-uljto',
				label: 'Email address',
				placeholder: 'Email address',
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
				template: '<label class="field -half"><input type="text" id="fieldOrganisation" class="-large" required /><div data-hook="message-container" class="message message-below message-error"><p data-hook="message-text"></p></div></label>',
				name: 'cm-f-uktdc',
				label: 'Company name',
				placeholder: 'Company name',
				required: true,
				tests: [],
				parent: this
			}),
			new InputView({
				template: '<label class="field -full"><input type="text" id="fieldMessage" class="-large" /><div data-hook="message-container" class="message message-below message-error"><p data-hook="message-text"></p></div></label>',
				name: 'cm-f-mjrjyu',
				label: 'Message',
				placeholder: 'Message',
				required: false,
				tests: [],
				parent: this
			})
			// new InputView({
			// 	template: '<label class="field -half"><input type="text" id="fieldContactNumber" class="-large" required /><div data-hook="message-container" class="message message-below message-error"><p data-hook="message-text"></p></div></label>',
			// 	name: 'cm-f-uktdv',
			// 	label: 'Contact number',
			// 	placeholder: 'Contact number',
			// 	required: true,
			// 	tests: [
			// 		function ( value ) { 
			// 			if ( !/^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{2})[-. )]*)?((\d{2,4})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/gm.test( value ) ) { 
			// 				return 'Please enter a valid phone number.'; 
			// 			}
			// 		}
			// 	],
			// 	parent: this
			// }),
			
		];
	},
	
	showThanks() {
		var view = new ContextThanksPartnersView({ parent: this.parent });
		FRONT.appView.openContext( view );
	}

});