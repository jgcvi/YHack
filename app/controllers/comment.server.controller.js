'use strict';

var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Comment = mongoose.model('Comment');

$scope.create = function() {
	var comment = new Comment({
		created: time.now,
		user = this,
		comment = this.commentField
	});

	comment.pre('save', function(res) {
		if(this.commentField === null)
			return null;
		else return articles.comments.push(this.commentField);
	});
}