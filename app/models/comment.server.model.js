'use strict';
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var commentSchema = new Schema( {
	created: {
		type: Date,
		default: Date.now
	},

	user: {
		type: ObjectId,
		ref: 'User'
	}

	comment: String
});

mongoose.model('Comment', commentSchema);