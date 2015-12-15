

//
//	FRONTIER / Controllers / Index
//


'use strict';

//	Dev
var log = require('bows')('INDEX');

//	App
var FRONT = require('app');
var Utils = require('utils');

//	Dependencies
var State = require('ampersand-state');
var View = require('ampersand-view');

//	Templates
var Templates = require('tpl');




var Index = {};



//	Controller
//	--------------------------------------------------

Index.Controller = State.extend({

	index: function( query, next ) {
		FRONT.app.mainRegion.set( new Index.IndexView() );
	}

});



//	Page Views
//	--------------------------------------------------

Index.IndexView = View.extend({
	template: Templates.Index.Index
});




//	Exports
//	--------------------------------------------------

module.exports = Index.Controller;