'use strict';

app.controller('AuthCtrl', function ($scope, $location, Auth, User) {
	if (Auth.signedIn()) {
		$location.path('/');
	}
		
	$scope.$on('$firebaseSimpleLogin:login', function() {
		$location.path('/');
	});

	$scope.login = function () {
		Auth.login($scope.user).then(function() {
			$location.path('/');
		}, function(err){
			$scope.error = err.toString();
		});
	};

	$scope.register = function () {
		Auth.register($scope.user)
			.then(function (authUser) {
				User.create(authUser, $scope.user.username);
				$location.path('/login');
			}, function(err){
				$scope.error = err.toString();
			});
	};

});
