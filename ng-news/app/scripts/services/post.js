'use strict';

app.factory('Post', function ($firebase, FIREBASE_URL, User) {
	var ref = new Firebase(FIREBASE_URL + 'posts');

	var posts = $firebase(ref);

	var Post = {

		all: posts,

		create: function(post){
			if(User.signedIn()){
				var user = User.getCurrent();

				post.owner = user.username;

				return posts.$add(post).then(function (ref) {
					var id = ref.name();

					user.$child('posts').$child(id).$set(id);

					return id;
				});
			}
		},
		
		addComment: function (id, comment) {
			if (User.signedIn()) {

				var user = User.getCurrent();
				comment.username = user.username;
				comment.id = id;
				
				posts.$child(id)
					.$child('comments')
					.$add(comment).then(function (ref) {
						user.$child('comments')
							.$child(ref.name())
							.$set({
								id: ref.name(),
								postId: id
							});
					});

			}

		},

		deleteComment: function (post, comment, id) {
			if (User.signedIn()) {
				var user = User.findByUsername(comment.username);

				post.$child('comments')
					.$remove(id)
					.then(function () {
						user.$child('comments').$remove(id);
					});
			}
		},

		upVote: function (id) {

			if (User.signedIn()) {
				var user = User.getCurrent();
				var post = posts.$child(id);

				post.$child('upvotes')
					.$child(user.username)
					.$set(user.username)
					.then(function () {
						user.$child('upvotes').$child(id).$set(id);
						post.$child('downvotes').$remove(user.username);
						user.$child('downvotes').$remove(id);

						post.$child('score').$transaction(function (score) {
							if (!score) {
								return 1;
							}
							
							return score++;
						});
					});
			}
		},

		downVote: function (id) {
			if (User.signedIn()) {
				var user = User.getCurrent();
				var post = posts.$child(id);

				post.$child('downvotes')
					.$child(user.username)
					.$set(user.username)
					.then(function () {
						user.$child('downvotes').$child(id).$set(id);
						post.$child('upvotes').$remove(user.username);
						user.$child('upvotes').$remove(id);

						post.$child('score').$transaction(function (score) {
							if (score === undefined || score === null) {
								return -1;
							}

							return score - 1;
						});
					});

			}

		},

		clearVote: function (id, upVoted) {

			if (User.signedIn()) {
				var user = User.getCurrent();
				var username = user.username;
				var post = posts.$child(id);

				post.$child('upvotes').$remove(username);
				post.$child('downvotes').$remove(username);
				user.$child('upvotes').$remove(id);
				user.$child('downvotes').$remove(id);
				post.$child('score').$transaction(function (score) {

					if (upVoted) {
						return score - 1;
					} else {
						return score + 1;
					}

				});
			}

		},

		upVoted: function (post) {
			if (User.signedIn() && post.upvotes) {
				return post.upvotes.hasOwnProperty(User.getCurrent().username);
			}
		},
		downVoted: function (post) {
			if (User.signedIn() && post.downvotes) {
				return post.downvotes.hasOwnProperty(User.getCurrent().username);
			}
		},

		find: function(id){
			return posts.$child(id);
		},
		
		delete: function(id){
			if (User.signedIn()) {
				var post = Post.find(id);

				post.$on('loaded', function () {
					var user = User.findByUsername(post.owner);

					posts.$remove(id).then(function () {
						user.$child('posts').$remove(id);
					});
				});
			}
			return posts.$remove(id);
		}
	};

	return Post;
});