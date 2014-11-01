'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	mongoose = require('mongoose'),
	Politian = mongoose.model('Politian');

/**
 * Politian middleware
 */
exports.politianByID = function(req, res, next, id) {
	Politian.findOne({
		_id: id
	}).exec(function(err, politian) {
		if (err) return next(err);
		if (!politian) return next(new Error('Failed to load Politian ' + id));
		req.profile = politian;
		next();
	});
};

/**
 * Require login routing middleware
 */
exports.requiresLogin = function(req, res, next) {
	if (!req.isAuthenticated()) {
		return res.status(401).send({
			message: 'Politian is not logged in'
		});
	}

	next();
};

/**
 * Politian authorizations routing middleware
 */
exports.hasAuthorization = function(roles) {
	var _this = this;

	return function(req, res, next) {
		_this.requiresLogin(req, res, function() {
			if (_.intersection(req.politian.roles, roles).length) {
				return next();
			} else {
				return res.status(403).send({
					message: 'Politian is not authorized'
				});
			}
		});
	};
};