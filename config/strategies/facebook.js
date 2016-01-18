'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
    url = require('url'),
    FacebookStrategy = require('passport-facebook').Strategy,
    config = require('../config'),
    users = require('../../app/controllers/users.server.controller');

module.exports = function() {
  // Use facebook strategy
  passport.use(new FacebookStrategy({
        clientID: config.facebook.clientID,
        clientSecret: config.facebook.clientSecret,
        callbackURL: config.facebook.callbackURL,
        enableProof:false


      },
      function(req, accessToken, refreshToken, profile, done) {
        // Set the provider data and include tokens
        var providerData = profile._json;
        providerData.accessToken = accessToken;
        providerData.refreshToken = refreshToken;

        // Create the user OAuth profile
        var providerUserProfile = {
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          displayName: profile.displayName,
          email: (profile.emails)? profile.emails[0].value: '',// changed from original file
          username: profile.username || profile.id, // changed from original file
          provider: 'facebook',
          providerIdentifierField: 'id',
          providerData: providerData
        };

        // Save the user OAuth profile
        users.saveOAuthUserProfile(req, providerUserProfile, done);
      }
  ));
};
