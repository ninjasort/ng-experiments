'use strict';

app.controller('ProfileCtrl', function ($scope, $routeParams, Post, User) {

	$scope.user = User.findByUsername($routeParams.username);
	$scope.commentedPosts = {};

	$scope.user.$on('loaded', function (user) {
		Profile.populatePosts(user.posts);
		Profile.populateComments();
	});

	var Profile = {

		populatePosts: function (posts) {
			$scope.posts = {};

			angular.forEach(posts, function (id) {
				$scope.posts[id] = Post.find(id);
			});
		},

		populateComments: function () {
			$scope.comments = {};

			angular.forEach($scope.user.comments, function (comment) {
				var post = Post.find(comment.id);

				post.$on('loaded', function () {
					$scope.comments[comment.id] = post.$child('comments').$child(comment.id);
					$scope.commentedPosts[comment.id] = post;
				});
			});
		}
	};
});
