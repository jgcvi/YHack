'use strict';

//Setting up route
angular.module('politian').config(['$stateProvider',
	function($stateProvider) {
		// Politian state routing
		$stateProvider.
		state('politian', {
			url: '/politian',
			templateUrl: 'modules/politian/views/politian.client.view.html'
		});
	}
]);