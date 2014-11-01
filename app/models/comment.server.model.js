'use strict';
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var commentSchema = new Schema( {
	created: {
		type: Date,
		default: Date.now
	},
	user: {
<<<<<<< Updated upstream
		type: String,
		ref: 'User'
	},
	comment: {
		type: String,
		ref: 'User'
	} 
=======
		type: Schema.ObjectId,
		ref: 'User'
	},

	comment: String
>>>>>>> Stashed changes
});

mongoose.model('Comment', commentSchema);