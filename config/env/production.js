'use strict';

module.exports = {
	db: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://growdomeUser:lettuceEater@ds055862.mongolab.com:55862/growdome',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.min.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.min.css',
			],
			js: [
				'public/lib/angular/angular.min.js',
				'public/lib/angular-resource/angular-resource.js', 
				'public/lib/angular-cookies/angular-cookies.js', 
				'public/lib/angular-animate/angular-animate.js', 
				'public/lib/angular-touch/angular-touch.js', 
				'public/lib/angular-sanitize/angular-sanitize.js', 
				'public/lib/angular-ui-router/release/angular-ui-router.min.js',
				'public/lib/angular-ui-utils/ui-utils.min.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js'
			]
		},
		css: 'public/dist/application.min.css',
		js: 'public/dist/application.min.js'
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || '936432603093229',
		clientSecret: process.env.FACEBOOK_SECRET || 'e2f62960d65c48c8c1fc8673a8c755ca',
		callbackURL: 'https://boiling-refuge-3005.herokuapp.com/auth/facebook/callback'
	},
	twitter: {
		clientID: process.env.TWITTER_KEY || 'hF3jqsd47lvO3XRgPuVdA8Zke',
		clientSecret: process.env.TWITTER_SECRET || 'CLylVxO4Z0YjYzJZrf027CbDycJgSdF0TUM5iGtYXJj2xHiyFp',
		callbackURL: '	https://boiling-refuge-3005.herokuapp.com/auth/twitter/callback'
	},
	google: {
		clientID: process.env.GOOGLE_ID || '831179169893-lk777eai2dhdrp4ihh4qo4kauehtu2qg.apps.googleusercontent.com',
		clientSecret: process.env.GOOGLE_SECRET || 'jq96JwOHj25litlpb5g2Dy3w',
		callbackURL: 'https://boiling-refuge-3005.herokuapp.com/auth/google/callback'
	},
	linkedin: {
		clientID: process.env.LINKEDIN_ID || '77ipwhebla1rkv',
		clientSecret: process.env.LINKEDIN_SECRET || 'RakJR2tX031qsb1x',
		callbackURL: 'https://boiling-refuge-3005.herokuapp.com/auth/linkedin/callback'
	},
	github: {
		clientID: process.env.GITHUB_ID || 'APP_ID',
		clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
		callbackURL: '/auth/github/callback'
	},
	mailer: {
		from: process.env.MAILER_FROM || 'MAILER_FROM',
		options: {
			service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
				pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
			}
		}
	}
};
