

//
//	FRONTIER / Templates
//


'use strict';

//	Dependencies




//	--------------------------------------------------

var Templates = {

	Global: {
		ContextSignup: require('../../tpl/partials/context-signup.hbs'),
		// ContextSignupAirline: require('../../tpl/partials/context-signup-airline.hbs'),
		ContextSignupThanks: require('../../tpl/partials/context-signup-thanks.hbs'),
		ContextSignupThanksPartners: require('../../tpl/partials/context-signup-thanks-partners.hbs'),
		ContextRequestDemo: require('../../tpl/partials/context-request-demo.hbs')
	},

	Download: {
		Form: require('../../tpl/partials/download-form.hbs'),
		Thanks: require('../../tpl/partials/download-thanks.hbs'),
	}

};



//	Exports
//	--------------------------------------------------

module.exports = Templates;