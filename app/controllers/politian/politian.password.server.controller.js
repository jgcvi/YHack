'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	Politian = mongoose.model('Politian'),
	config = require('../../../config/config'),
	nodemailer = require('nodemailer'),
	async = require('async'),
	crypto = require('crypto');

/**
 * Forgot for reset password (forgot POST)
 */
exports.forgot = function(req, res, next) {
	async.waterfall([
		// Generate random token
		function(done) {
			crypto.randomBytes(20, function(err, buffer) {
				var token = buffer.toString('hex');
				done(err, token);
			});
		},
		// Lookup politian by politianname
		function(token, done) {
			if (req.body.politianname) {
				Politian.findOne({
					politianname: req.body.politianname
				}, '-salt -password', function(err, politian) {
					if (!politian) {
						return res.status(400).send({
							message: 'No account with that politianname has been found'
						});
					} else if (politian.provider !== 'local') {
						return res.status(400).send({
							message: 'It seems like you signed up using your ' + politian.provider + ' account'
						});
					} else {
						politian.resetPasswordToken = token;
						politian.resetPasswordExpires = Date.now() + 3600000; // 1 hour

						politian.save(function(err) {
							done(err, token, politian);
						});
					}
				});
			} else {
				return res.status(400).send({
					message: 'Politianname field must not be blank'
				});
			}
		},
		function(token, politian, done) {
			res.render('templates/reset-password-email', {
				name: politian.displayName,
				appName: config.app.title,
				url: 'http://' + req.headers.host + '/auth/reset/' + token
			}, function(err, emailHTML) {
				done(err, emailHTML, politian);
			});
		},
		// If valid email, send reset email using service
		function(emailHTML, politian, done) {
			var smtpTransport = nodemailer.createTransport(config.mailer.options);
			var mailOptions = {
				to: politian.email,
				from: config.mailer.from,
				subject: 'Password Reset',
				html: emailHTML
			};
			smtpTransport.sendMail(mailOptions, function(err) {
				if (!err) {
					res.send({
						message: 'An email has been sent to ' + politian.email + ' with further instructions.'
					});
				}

				done(err);
			});
		}
	], function(err) {
		if (err) return next(err);
	});
};

/**
 * Reset password GET from email token
 */
exports.validateResetToken = function(req, res) {
	Politian.findOne({
		resetPasswordToken: req.params.token,
		resetPasswordExpires: {
			$gt: Date.now()
		}
	}, function(err, politian) {
		if (!politian) {
			return res.redirect('/#!/password/reset/invalid');
		}

		res.redirect('/#!/password/reset/' + req.params.token);
	});
};

/**
 * Reset password POST from email token
 */
exports.reset = function(req, res, next) {
	// Init Variables
	var passwordDetails = req.body;

	async.waterfall([

		function(done) {
			Politian.findOne({
				resetPasswordToken: req.params.token,
				resetPasswordExpires: {
					$gt: Date.now()
				}
			}, function(err, politian) {
				if (!err && politian) {
					if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
						politian.password = passwordDetails.newPassword;
						politian.resetPasswordToken = undefined;
						politian.resetPasswordExpires = undefined;

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
										// Return authenticated politian 
										res.jsonp(politian);

										done(err, politian);
									}
								});
							}
						});
					} else {
						return res.status(400).send({
							message: 'Passwords do not match'
						});
					}
				} else {
					return res.status(400).send({
						message: 'Password reset token is invalid or has expired.'
					});
				}
			});
		},
		function(politian, done) {
			res.render('templates/reset-password-confirm-email', {
				name: politian.displayName,
				appName: config.app.title
			}, function(err, emailHTML) {
				done(err, emailHTML, politian);
			});
		},
		// If valid email, send reset email using service
		function(emailHTML, politian, done) {
			var smtpTransport = nodemailer.createTransport(config.mailer.options);
			var mailOptions = {
				to: politian.email,
				from: config.mailer.from,
				subject: 'Your password has been changed',
				html: emailHTML
			};

			smtpTransport.sendMail(mailOptions, function(err) {
				done(err, 'done');
			});
		}
	], function(err) {
		if (err) return next(err);
	});
};

/**
 * Change Password
 */
exports.changePassword = function(req, res) {
	// Init Variables
	var passwordDetails = req.body;

	if (req.politian) {
		if (passwordDetails.newPassword) {
			Politian.findById(req.politian.id, function(err, politian) {
				if (!err && politian) {
					if (politian.authenticate(passwordDetails.currentPassword)) {
						if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
							politian.password = passwordDetails.newPassword;

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
											res.send({
												message: 'Password changed successfully'
											});
										}
									});
								}
							});
						} else {
							res.status(400).send({
								message: 'Passwords do not match'
							});
						}
					} else {
						res.status(400).send({
							message: 'Current password is incorrect'
						});
					}
				} else {
					res.status(400).send({
						message: 'Politian is not found'
					});
				}
			});
		} else {
			res.status(400).send({
				message: 'Please provide a new password'
			});
		}
	} else {
		res.status(400).send({
			message: 'Politian is not signed in'
		});
	}
};