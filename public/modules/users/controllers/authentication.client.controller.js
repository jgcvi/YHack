'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
			//		$http.post('I\'m a dummy ' + $scope.authentication.user.displayName);
				if($scope.authentication.user.politician === true)
				{
					response.setHeader('Location', '/politician');
					$http.post('I\'m a dummy ' + $scope.authentication.user.displayName);
				}
				else
				{
				//	$http.post('HI HELLO THERE ', $scope.authentication.user.displayName);
				//	response.statusCode = 302;
					$location.path('./constituent', function(res) {
						console.log("Status: ", response.statusCode);
					});
				//	$location.path('/constituent');

				}
//				original default path, lame
//				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);