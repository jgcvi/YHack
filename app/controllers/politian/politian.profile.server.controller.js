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
 * Update politian details
 */
exports.update = function(req, res) {
	// Init Variables
	var politian = req.politian;
	var message = null;

	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	if (politian) {
		// Merge existing politian
		politian = _.extend(politian, req.body);
		politian.updated = Date.now();
		politian.displayName = politian.firstName + ' ' + politian.lastName;

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
	} else {
		res.status(400).send({
			message: 'Politian is not signed in'
		});
	}
};

/**
 * Send Politian
 */
exports.me = function(req, res) {
	res.jsonp(req.politian || null);
};