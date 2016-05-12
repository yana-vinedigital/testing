

//
//	FRONTIER / Data Schema / User
//


'use strict';

//	Dev
var log = require('bows')('SCHEMA.USER');

//	App
var FRONT = require('app');
var Utils = require('utils');

//	Dependencies
var State = require('ampersand-state');
// var Model = require('ampersand-model');
var Collection = require('ampersand-collection');




//	REST Models
//	--------------------------------------------------

var User = State.extend({
	modelType: 'user',
	// urlRoot: SN.apiUrl + '/user',

	props: {
		id: 'string',
		name: ['string', false, '']
	},

	session: {

	},

	derived: {

	},

	//	Event Handlers	 ----------------

	//	Public Methods	 ----------------
});


var UserSession = State.extend({
	modelType: 'userSession',

	props: {
		user: 'string'
	},

	session: {

	},

	derived: {
		userModel: {
			deps: ['user'],
			fn: function() {
				return FRONT.app.user;
			}
		},
		// isAuthenticated: {
		// 	deps: ['access_token'],
		// 	fn: function() {
		// 		return !Utils.isEmpty( this.access_token );
		// 	}
		// }
	},

	//	Event Handlers	 ----------------

	//	Public Methods	 ----------------

	//	Private Methods	 ----------------

});

//	REST Collections
//	--------------------------------------------------

//	Collections
//	--------------------------------------------------

var Users = Collection.extend({
	// url: SN.apiUrl + '/users',
	model: User
});


//	Exports
//	--------------------------------------------------

module.exports = {	
	User:			User,
	UserSession:	UserSession,
	Users:			Users
};