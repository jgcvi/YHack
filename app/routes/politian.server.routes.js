'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');

module.exports = function(app) {
	// Polition Routes
	var politians = require('../../app/controllers/politians');

	// Setting up the politians profile api
	app.route('/politians/me').get(politians.me);
	app.route('/politians').put(politians.update);
	app.route('/politians/accounts').delete(politians.removeOAuthProvider);

	// Setting up the politians password api
	app.route('/politians/password').post(politians.changePassword);
	app.route('/auth/forgot').post(politians.forgot);
	app.route('/auth/reset/:token').get(politians.validateResetToken);
	app.route('/auth/reset/:token').post(politians.reset);

	// Setting up the politians authentication api
	app.route('/auth/signup').post(politians.signup);
	app.route('/auth/signin').post(politians.signin);
	app.route('/auth/signout').get(politians.signout);

	// Setting the facebook oauth routes
	app.route('/auth/facebook').get(passport.authenticate('facebook', {
		scope: ['email']
	}));
	app.route('/auth/facebook/callback').get(politians.oauthCallback('facebook'));

	// Setting the twitter oauth routes
	app.route('/auth/twitter').get(passport.authenticate('twitter'));
	app.route('/auth/twitter/callback').get(politians.oauthCallback('twitter'));

	// Setting the google oauth routes
	app.route('/auth/google').get(passport.authenticate('google', {
		scope: [
			'https://www.googleapis.com/auth/politianinfo.profile',
			'https://www.googleapis.com/auth/politianinfo.email'
		]
	}));
	app.route('/auth/google/callback').get(politians.oauthCallback('google'));

	// Setting the linkedin oauth routes
	app.route('/auth/linkedin').get(passport.authenticate('linkedin'));
	app.route('/auth/linkedin/callback').get(politians.oauthCallback('linkedin'));
	
	// Setting the github oauth routes
	app.route('/auth/github').get(passport.authenticate('github'));
	app.route('/auth/github/callback').get(politians.oauthCallback('github'));

	// Finish by binding the politian middleware
	app.param('politianId', politians.politianByID);
};
