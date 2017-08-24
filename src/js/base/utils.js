

//
//	FRONTIER / Utils
//


'use strict';


//	--------------------------------------------------

var Utils = {

	//	Lodash	 ------------------------
	each: 		require('lodash/each'),
	extend: 	require('lodash/assign'),
	find: 		require('lodash/find'),
	filter: 	require('lodash/filter'),
	debounce: 	require('lodash/debounce'),
	defaults: 	require('lodash/defaults'),
	defer: 		require('lodash/defer'),
	delay: 		require('lodash/delay'),
	indexOf: 	require('lodash/indexOf'),

	map: 		require('lodash/map'),
	sortBy: 	require('lodash/sortBy'),
	throttle: 	require('lodash/throttle'),
	
	//	Misc	 ------------------------
	xhr: require('xhr'),
	jsonp: require('b-jsonp'),
	raf: require('raf'),
	qs: require('query-string')
	
};

Utils.getQsParam = function( name, url ) {
	if ( !url ) url = window.location.href;
	name = name.replace( /[\[\]]/g, "\\$&" );
	var regex = new RegExp( "[?&]" + name + "(=([^&#]*)|&|#|$)" );
	var results = regex.exec( url );
	if ( !results ) return null;
	if ( !results[2] ) return '';
	return decodeURIComponent( results[2].replace( /\+/g, " " ));
}

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
	onTransitionEnd: require('./on-transition-end'),

	matches( el, selector ) { 
		var p = Element.prototype;
		var matchesFn = p.matches || p.webkitMatchesSelector || p.mozMatchesSelector || p.msMatchesSelector || function(s) {
			return [].indexOf.call( document.querySelectorAll(s), this ) !== -1;
		};
		return matchesFn.call( el, selector );
	},

	closest( el, selector ) {
		if ( typeof el === 'undefined' || selector === '' ) return false;
		
		while ( el ) {
			if ( Utils.DOM.matches( el, selector ) ) {
				return el;
			} else {
				el = el.parentElement;
			}
		}
		return false;
	},

	setAttributes( el, attrs ) {
		for ( var key in attrs ) {
			if ( !attrs.hasOwnProperty( key ) ) { return; }
			el.setAttribute(key, attrs[key]);
		}
	},

	getPosition( el, withScroll = false ) {
		if ( typeof el === 'undefined' ) return 0;
		var rect = el.getBoundingClientRect();
		var scrollTop = withScroll ? document.defaultView.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop : 0;

		return {
			width: Math.round( rect.width || el.offsetWidth ),
			height: Math.round( rect.height || el.offsetHeight ),
			top: Math.round( rect.top + scrollTop )
		};
	},

	getAfterAttr( el ) {
		if ( !el ) return undefined;
		var content = window.getComputedStyle( el, ':after').getPropertyValue('content');
		return content.replace(/['"]+/g, '');
	},

	hexToRgb( hex ) {
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