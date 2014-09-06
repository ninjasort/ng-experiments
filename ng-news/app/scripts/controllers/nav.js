'use strict';

app.controller('NavCtrl', function ($scope, $location, Post, Auth) {
	$scope.posts = Post.all;

	$scope.post = {
		url: 'http://',
		title: ''
	};

	$scope.submitPost = function () {
		Post.create($scope.post).then(function(id){
			$scope.post = {url: 'http://', title: ''};
			$location.path('/posts/' + id);
		});
	};

	$scope.logout = function () {
		Auth.logout();
	};
});