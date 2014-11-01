'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Article Schema
 */
var ArticleSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	proposalName: {
		type: String,
		default: '',
		trim: true,
		required: 'Name of proposal cannot be blank'
	},
	sponsorName: {
		type: String,
		default: '',
		trim: true,
		required: 'Name of sponsor cannot be blank'
	},
	govLevel: {
		type: String,
		default: '',
		trim: true,
		required: 'Goverment level cannot be blank'
	},
	state: {
		type: String,
		default: '',
		trim: true,
		required: 'State cannot be blank'
	},
	city: {
		type: String,
		default: '',
		trim: true,
		required: 'City cannot be blank'
	},
	summary: {
		type: String,
		default: '',
		trim: true
	},
	proposalLink: {
		type: String,
		default: '',
		trim: true,
		required: 'Proposal link is required'
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Article', ArticleSchema);