'use strict';
/**
 * Module dependencies.
 */
var init = require('./config/init')(),
	config = require('./config/config'),
	mongoose = require('mongoose');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Bootstrap db connection
var db = mongoose.connect(config.db, function(err) {
	if (err) {
		console.error('\x1b[31m', 'Could not connect to MongoDB!');
		console.log(err);
	}
});

// Init the express application
var app = require('./config/express')(db);

// Bootstrap passport config
require('./config/passport')();

// Start the app by listening on <port>
app.listen(config.port);

// Expose app
exports = module.exports = app;

// Logging initialization
console.log('MEAN.JS application started on port ' + config.port);

// returning the proper homepage
var http = require('http');

var options = {
	host:	'172.26.12.71',
	port:	3000,
	path: '/auth/login',

};

//var req = http.({ options, function(res) {
	
//});

var articles = [];
Array.prototype.unique = function() {
	var a = this.concat();
	for(var i = 0; i < this.length; i ++) 
	{
		for(var j = 0; j < this.length; j ++)
		{
			if( a[i] === a[j])
				a.splice(j--, 1);
		}
	}
	return a;
}

var req = http.request({path: '/constituents'}, function(res) {
	// returns an array of unread articles, and sets the article array to the current + 10
	res.on('get', function(data) {
		var newArticles = [];
		newArticles = db.articles.find({_id: {$lt: Date.now() } }.limit(10 + 10 * articles.length));
		var combine = articles.concat(newArticles);
		combine.unique();

		var ret = combine.concat(articles);
		ret.unique();
		
		articles = combine;
		return ret;
	});

	res.on('error', function(data) {
		// error handle idk yet
	});
});
