'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	Politian = mongoose.model('Politian');

/**
 * Signup
 */
exports.signup = function(req, res) {
	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	// Init Variables
	var politian = new Politian(req.body);
	var message = null;

	// Add missing politian fields
	politian.provider = 'local';
	politian.displayName = politian.firstName + ' ' + politian.lastName;

	// Then save the politian 
	politian.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			// Remove sensitive data before login
			politian.password = undefined;
			politian.salt = undefined;

			req.login(politian, function(err) {
				if (err) {
					res.status(400).send(err);
				} else {
					res.jsonp(politian);
				}
			});
		}
	});
};

/**
 * Signin after passport authentication
 */
exports.signin = function(req, res, next) {
	passport.authenticate('local', function(err, politian, info) {
		if (err || !politian) {
			res.status(400).send(info);
		} else {
			// Remove sensitive data before login
			politian.password = undefined;
			politian.salt = undefined;

			req.login(politian, function(err) {
				if (err) {
					res.status(400).send(err);
				} else {
					res.jsonp(politian);
				}
			});
		}
	})(req, res, next);
};

/**
 * Signout
 */
exports.signout = function(req, res) {
	req.logout();
	res.redirect('/');
};

/**
 * OAuth callback
 */
exports.oauthCallback = function(strategy) {
	return function(req, res, next) {
		passport.authenticate(strategy, function(err, politian, redirectURL) {
			if (err || !politian) {
				return res.redirect('/#!/signin');
			}
			req.login(politian, function(err) {
				if (err) {
					return res.redirect('/#!/signin');
				}

				return res.redirect(redirectURL || '/');
			});
		})(req, res, next);
	};
};

/**
 * Helper function to save or update a OAuth user profile
 */
exports.saveOAuthPolitianProfile = function(req, providerPolitianProfile, done) {
	if (!req.politian) {
		// Define a search query fields
		var searchMainProviderIdentifierField = 'providerData.' + providerPolitianrProfile.providerIdentifierField;
		var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerPolitianProfile.provider + '.' + providerPolitianProfile.providerIdentifierField;

		// Define main provider search query
		var mainProviderSearchQuery = {};
		mainProviderSearchQuery.provider = providerPolitianProfile.provider;
		mainProviderSearchQuery[searchMainProviderIdentifierField] = providerPolitianProfile.providerData[providerPolitianProfile.providerIdentifierField];

		// Define additional provider search query
		var additionalProviderSearchQuery = {};
		additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerPolitianProfile.providerData[providerPolitianProfile.providerIdentifierField];

		// Define a search query to find existing user with current provider profile
		var searchQuery = {
			$or: [mainProviderSearchQuery, additionalProviderSearchQuery]
		};

		Politian.findOne(searchQuery, function(err, Politian) {
			if (err) {
				return done(err);
			} else {
				if (!Politian) {
					var possibleUsername = providerPolitianProfile.username || ((providerPolitianProfile.email) ? providerPolitianProfile.email.split('@')[0] : '');

					Politian.findUniqueUsername(possibleUsername, null, function(availableUsername) {
						politian = new Politian({
							firstName: providerPolitianProfile.firstName,
							lastName: providerPolitianProfile.lastName,
							username: availablePolitianname,
							displayName: providerPolitianProfile.displayName,
							email: providerPolitianProfile.email,
							city: providerPolitianProfile.city,
							state: providerPolitianProfile.state,
							bio: providerPolitianProfile.bio,
							affiliation: providerPolitianProfile.affiliation,
							title: providerPolitianProfile.title,
							provider: providerPolitianProfile.provider,
							providerData: providerPolitianProfile.providerData
						});

						// And save the politian
						politian.save(function(err) {
							return done(err, politian);
						});
					});
				} else {
					return done(err, politian);
				}
			}
		});
	} else {
		// User is already logged in, join the provider data to the existing politian
		var politian = req.politian;

		// Check if politian exists, is not signed in using this provider, and doesn't have that provider data already configured
		if (politian.provider !== providerPolitianProfile.provider && (!politian.additionalProvidersData || !politian.additionalProvidersData[providerPolitianProfile.provider])) {
			// Add the provider data to the additional provider data field
			if (!politian.additionalProvidersData) politian.additionalProvidersData = {};
			politian.additionalProvidersData[providerPolitianProfile.provider] = providerPolitianProfile.providerData;

			// Then tell mongoose that we've updated the additionalProvidersData field
			politian.markModified('additionalProvidersData');

			// And save the politian
			politian.save(function(err) {
				return done(err, politian, '/#!/settings/accounts');
			});
		} else {
			return done(new Error('Politian is already connected using this provider'), politian);
		}
	}
};

/**
 * Remove OAuth provider
 */
exports.removeOAuthProvider = function(req, res, next) {
	var politian = req.politian;
	var provider = req.param('provider');

	if (politian && provider) {
		// Delete the additional provider
		if (politian.additionalProvidersData[provider]) {
			delete politian.additionalProvidersData[provider];

			// Then tell mongoose that we've updated the additionalProvidersData field
			politian.markModified('additionalProvidersData');
		}

		politian.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				req.login(politian, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.jsonp(politian);
					}
				});
			}
		});
	}
};