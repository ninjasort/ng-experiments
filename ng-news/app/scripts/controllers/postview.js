'use strict';

app.controller('PostViewCtrl', function ($scope, $routeParams, Post) {
	$scope.post = Post.find($routeParams.id);

	$scope.upVotePost = function (upVoted) {
		if (upVoted) {
			Post.clearVote($routeParams.id, true);
		} else {
			Post.upVote($routeParams.id);
		}
	};

	$scope.downVotePost = function (downVoted) {
		if (downVoted) {
			Post.clearVote($routeParams.id, false);
		} else {
			Post.downVote($routeParams.id);
		}
	};

	$scope.upVoted = function () {
		return Post.upVoted($scope.post);
	};

	$scope.downVoted = function () {
		return Post.downVoted($scope.post);
	};

	$scope.addComment = function () {
		Post.addComment($routeParams.id, $scope.comment);
		$scope.comment = '';
	};

	$scope.deleteComment = function (comment, id) {
		Post.deleteComment($scope.post, comment, id);
	};
});