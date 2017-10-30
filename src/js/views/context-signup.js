

//
//	SEATFROG / Views / Context Signup
//	


'use strict';

//	Dev
var log = require('bows')('CONTEXT-SIGNUP');

//	App
var FRONT = require('app');
var Utils = require('utils');
var Templates = require('../base/templates');

//	Dependencies
var View = require('ampersand-view');
var InputView = require('ampersand-input-view');
var FormSubscribeView = require('./form-subscribe');
// var ContextThanksView = require('./context-thanks');
// var ContextSignupAirlineView = require('./context-signup-airline');

//
//
//


/**
 *	View / Context Signup
 *  -------------------------------------
 */

module.exports = View.extend({
	template: Templates.Global.ContextSignup,
	
	// events: {
	// 	'click [data-hook=context-action-submit]': '_submitHandler'
	// },

	render() {
		var _this = this;
		this.renderWithTemplate( this );

		this.$_formSignup = this.queryByHook('form-signup');
		this.v_formSignup = new FormSubscribeView({
			el: this.$_formSignup,
			fields() {
				return [
					new InputView({
						template: '<label data-hook="input-email"><input type="email" id="fieldEmail" placeholder="" class="-large" required /><div data-hook="message-container" class="message message-below message-error"><p data-hook="message-text"></p></div></label>',
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
			// submitCallback( data ) {
			// 	this.submitSubscription( data, () => {
			// 		_this.showAirline( data['cm-qiynh-qiynh'] );
			// 	});
			// 	return false;
			// },
			parent: this,
		});

		// this.$_formSignup.appendChild( this.v_formSignup.el );
		// this.registerSubview( this.v_formSignup );

		return this;
	},

	//	Event Handlers	 ----------------

	// _submitHandler( e ) {
	// 	if ( e ) e.preventDefault();
	// 	// this.submitForm.handleSubmit( e );
	// 	this.showAirline();
	// },

	//	Public Methods	 ----------------

	// showAirline( email ) {
	// 	var view = new ContextSignupAirlineView({ parent: this.parent, dataEmail: email });
	// 	FRONT.appView.openContext( view );
	// },

	//	Private Methods	 ----------------

	// _submitData( data ) {
	// 	var _this = this;
	// 	this.model.save( data, { 
	// 		success: function() {
	// 			_this.showThanks();
	// 		},
	// 		error: function() {

	// 		}
	// 	});
		
	// }
});
