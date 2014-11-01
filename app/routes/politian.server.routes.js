'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');

module.exports = function(app) {
	// Polition Routes
	var politian = require('../../app/controllers/politian');

	// Setting up the politian profile api
	app.route('/politian/me').get(politian.me);
	app.route('/politian').put(politian.update);
	app.route('/politian/accounts').delete(politian.removeOAuthProvider);

	// Setting up the politian password api
	app.route('/politian/password').post(politian.changePassword);
	app.route('/auth/forgot').post(politian.forgot);
	app.route('/auth/reset/:token').get(politian.validateResetToken);
	app.route('/auth/reset/:token').post(politian.reset);

	// Setting up the politian authentication api
	app.route('/auth/signupP').post(politian.signup);
	app.route('/auth/signin').post(politian.signin);
	app.route('/auth/signout').get(politian.signout);

	// Setting the facebook oauth routes
	app.route('/auth/facebook').get(passport.authenticate('facebook', {
		scope: ['email']
	}));
	app.route('/auth/facebook/callback').get(politian.oauthCallback('facebook'));

	// Setting the twitter oauth routes
	app.route('/auth/twitter').get(passport.authenticate('twitter'));
	app.route('/auth/twitter/callback').get(politian.oauthCallback('twitter'));

	// Setting the google oauth routes
	app.route('/auth/google').get(passport.authenticate('google', {
		scope: [
			'https://www.googleapis.com/auth/politianinfo.profile',
			'https://www.googleapis.com/auth/politianinfo.email'
		]
	}));
	app.route('/auth/google/callback').get(politian.oauthCallback('google'));

	// Setting the linkedin oauth routes
	app.route('/auth/linkedin').get(passport.authenticate('linkedin'));
	app.route('/auth/linkedin/callback').get(politian.oauthCallback('linkedin'));
	
	// Setting the github oauth routes
	app.route('/auth/github').get(passport.authenticate('github'));
	app.route('/auth/github/callback').get(politian.oauthCallback('github'));

	// Finish by binding the politian middleware
	app.param('politianId', politian.politianByID);
};
