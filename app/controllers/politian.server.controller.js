'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash');

/**
 * Extend politian's controller
 */
module.exports = _.extend(
	require('./politian/politian.authentication'),
	require('./politian/politian.authorization'),
	require('./politian/politian.password'),
	require('./politian/politian.profile')
);