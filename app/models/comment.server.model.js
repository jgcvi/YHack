'use strict';
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var commentSchema = new Schema( {
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: String,
		ref: 'User'
	},
	comment: {
		type: String,
		ref: 'User'
	} 
});

mongoose.model('Comment', commentSchema);