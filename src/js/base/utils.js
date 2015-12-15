

//
//	FRONTIER / Utils
//


'use strict';


//	--------------------------------------------------

var Utils = {

	//	Lodash	 ------------------------
	each: 		require('lodash/collection/each'),
	extend: 	require('lodash/object/assign'),
	debounce: 	require('lodash/function/debounce'),
	defaults: 	require('lodash/object/defaults'),
	defer: 		require('lodash/function/defer'),
	delay: 		require('lodash/function/delay'),
	
	
	//	Misc	 ------------------------
	raf: require('raf')
	
};

//	Math Utilities	 ----------------

Utils.MATH = {

	//	Math clamp number range
	clamp: function( number, min, max ) {
		return Math.min( Math.max( number, min ), max );
	}

};

//	Media Query Utilities	 --------

Utils.MQ = {

	max: function( target, current, breakpoints ) {
		var targetIndex = breakpoints.indexOf( target );
		var currentIndex = breakpoints.indexOf( current );
		if ( currentIndex <= targetIndex ) return true;
		return false;
	},

	min: function( target, current, breakpoints ) {
		var targetIndex = breakpoints.indexOf( target );
		var currentIndex = breakpoints.indexOf( current );
		if ( currentIndex >= targetIndex ) return true;
		return false;
	}
};


//	DOM Utilities	 ----------------

Utils.DOM = {

	addClass: require('amp-add-class'),
	hasClass: require('amp-has-class'),
	make: require('domify'),

	setAttributes: function ( el, attrs ) {
		for ( var key in attrs ) {
			if ( !attrs.hasOwnProperty( key ) ) { return; }
			el.setAttribute(key, attrs[key]);
		}
	},

	getAfterAttr: function( el ) {
		if ( !el ) return undefined;
		var content = window.getComputedStyle( el, ':after').getPropertyValue('content');
		return content.replace(/['"]+/g, '');
	},

	hexToRgb: function( hex ) {
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec( hex );
		return result ? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16)
		} : null;
	}

};


//	Bindings Utilities	 ------------

Utils.BIND = {

	imageBg: function( el, value ) {
		if ( typeof value === 'undefined' ) return;
		el.style.backgroundImage = 'url(\'' + value + '\')';
	}

};



//	Exports
//	--------------------------------------------------

module.exports = Utils;