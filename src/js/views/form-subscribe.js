

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
var FormView = require('ampersand-form-view');
var InputView = require('ampersand-input-view');
var ContextThanksView = require('../views/context-thanks');


//
//
//


/**
 *	FormView / Subscribe
 *  -------------------------------------
 */

module.exports = FormView.extend({

	template: '<form action="https://seatfrog.createsend.com/t/i/s/qiynh/" method="post" id="subForm" data-hook="form-subscribe"><fieldset data-hook="field-container"></fieldset></form>',
	
	autoAppend: true,
	autoRender: true,

	props: {
		parent: 'state',
		dataEmail: ['string', true, '']
	},

	session: {
		_isSubmitted: ['boolean', true, false]
	},

	fields() {
		return [
			new InputView({
				template: '<label data-hook="input-email"><input type="email" id="fieldEmail" placeholder="" class="-large -outline-rounded" required /><input type="submit" value="Get early access" class="ui-btn -alt" data-hook="submit-form" /><div data-hook="message-container" class="message message-below message-error"><p data-hook="message-text"></p></div></label>',
				name: 'cm-qiynh-qiynh',
				label: 'Email',
				placeholder: 'Enter your email',
				required: true,
				tests: [
					function ( value ) { 
						if ( !/[A-Za-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?/g.test( value ) ) { 
							return 'Please enter a valid email address.'; 
						}
					}
				],
				parent: this
			})
		];
	},

	//	Event Handlers	 ----------------

	validCallback( valid ) {
		// log('validCallback', this.el.action)
		// if (valid) {
		// 	console.log('The form is valid!');
		// } else {
		// 	console.log('The form is not valid!');
		// }
	},

	submitCallback( data ) {
		// log('form submitted! Your data:', data);
		this.submitSubscription( data, () => { 
			this.showThanks(); 
			this.clear();
		});
		return false;
	},
	
	submitSubscription( data, next ) {
		if ( this._isSubmitted ) return;
		// var data = Utils.qs.stringify( data );
		// log('data', data )

		this._isSubmitted = true;
		this.showLoader();

		Utils.jsonp( this.el.action, data, { name: 'callback' }, function( err, resp ) {
			// console.log('response', err, resp);
			next();
		});
	},

	showLoader() {
		var view = new View({
			template: '<div class="context container context-loader"><div class="row -margin-none"><div class="col -wide -center"><div class="loader"></div></div></div></div>',
			parent: this.parent 
		});
		FRONT.appView.openContext( view );
	},

	showThanks() {
		var view = new ContextThanksView({ parent: this.parent });
		FRONT.appView.openContext( view );
	}

});