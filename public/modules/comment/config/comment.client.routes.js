'use strict';

//Setting up route
angular.module('comment').config(['$stateProvider',
	function($stateProvider) {
		// Comment state routing
		$stateProvider.
		state('comment', {
			url: '/comment',
			templateUrl: 'modules/comment/views/comment.client.view.html'
		});
	}
]);