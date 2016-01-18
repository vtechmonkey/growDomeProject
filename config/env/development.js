'use strict';

module.exports = {
	db: 'mongodb://growdomeUser:lettuceEater@ds055862.mongolab.com:55862/growdome',
	app: {
		title: 'GROWDOME - Development Environment'
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || '1692716550986437',
		clientSecret: process.env.FACEBOOK_SECRET || 'd7aafcdd7517e29470ecb0ef1e4af307',
		callbackURL: 'http://localhost:3000/auth/facebook/callback'
	},
	twitter: {
		clientID: process.env.TWITTER_KEY || 'm5gqX2GSeaShfnj9zzIs4VyNF',
		clientSecret: process.env.TWITTER_SECRET || 'PZQrAmECc4OKlixNZzDvTtaIJEIqwYRZmiY90M7u5EMApADKHp',
		callbackURL: 'http://localhost:3000/auth/twitter/callback'
			// use http://127.0.0.1:3000 for twitter
			//http://stackoverflow.com/questions/21170531/desktop-applications-only-support-the-oauth-callback-value-oob-oauth-request-t
	},
	google: {
		clientID: process.env.GOOGLE_ID || '378454823667-qqq59uord29i500j6geidc912un67v2b.apps.googleusercontent.com',
		clientSecret: process.env.GOOGLE_SECRET || 'bEQDzJrX_1EJrP1udBlustQm',
		callbackURL: 'http://localhost:3000/auth/google/callback'
	},
	linkedin: {
		clientID: process.env.LINKEDIN_ID || '77ipwhebla1rkv',
		clientSecret: process.env.LINKEDIN_SECRET || 'RakJR2tX031qsb1x',
		callbackURL: 'http://localhost:3000/auth/linkedin/callback'
	},
	github: {
		clientID: process.env.GITHUB_ID || '1c0cbc599fb1fc777262',
		clientSecret: process.env.GITHUB_SECRET || '6156c0dc8956fac1393702053c8d4470724752ff',
		callbackURL: 'http://127.0.0.1:3000/auth/github/callback'
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
