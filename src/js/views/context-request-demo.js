

//
//	SEATFROG / Views / Context Request Demo
//	


'use strict';

//	Dev
var log = require('bows')('CONTEXT-REQUEST-DEMO');

//	App
var FRONT = require('app');
var Utils = require('utils');
var Templates = require('../base/templates');

//	Dependencies
var View = require('ampersand-view');
var InputView = require('ampersand-input-view');
var FormSubscribeView = require('./form-subscribe');
var ContextThanksPartnersView = require('../views/context-thanks-partners');

//
//
//


/**
 *	View / Context Request Demo
 *  -------------------------------------
 */


var TextareaView = InputView.extend({

	events: {
		'input textarea': 'handleChange',
		'change textarea': 'handleChange'
	},

	render: function() {
		InputView.prototype.render.apply( this, arguments );
		this.enableAutoSize();
		return this;
	},

	enableAutoSize: function() {
		var style = window.getComputedStyle( this.input, null );
		this.listenTo( FRONT, 'window:reflow', this.handleChange );
		setTimeout( this._autoSize.bind(this), 0 );
		this._isAutoResize = true;
	},

	handleChange: function() {
		InputView.prototype.handleChange.apply( this, arguments );
		this._autoSize();
	},

	_autoSize: function() {
		if ( !this._isAutoResize ) return;
		var currentHeight = this.input.style.height;
		this.input.style.height = 'auto';
		var newHeight = this.input.scrollHeight + 'px';
		this.input.style.height = newHeight;
	}
})

var RequestDemoFormView = FormSubscribeView.extend({
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
			new TextareaView({
				template: '<label class="field -full"><textarea id="fieldMessage" class="-large" /><div data-hook="message-container" class="message message-below message-error"><p data-hook="message-text"></p></div></label>',
				name: 'cm-f-mjrjyu',
				label: 'Message',
				placeholder: 'Message',
				required: false,
				tests: [],
				parent: this
			})
		];
	},

	showThanks() {
		var view = new ContextThanksPartnersView({ parent: this.parent });
		FRONT.appView.openContext( view );
	}
});


module.exports = View.extend({
	template: Templates.Global.ContextRequestDemo,

	render() {
		var _this = this;
		this.renderWithTemplate( this );

		this.$_formRequestDemo = this.queryByHook('form-request-demo');
		this.v_formRequestDemo = new RequestDemoFormView({
			el: this.$_formRequestDemo,
			parent: this,
		});

		this.registerSubview( this.v_formRequestDemo );
		return this;
	},

	//	Event Handlers	 ----------------

	//	Public Methods	 ----------------

	//	Private Methods	 ----------------
	
});
