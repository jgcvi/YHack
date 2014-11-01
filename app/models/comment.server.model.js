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
<<<<<<< Updated upstream
	comment: {
		type: String,
		ref: 'User'
	}

=======

	comment: String
>>>>>>> Stashed changes
});

mongoose.model('Comment', commentSchema);
