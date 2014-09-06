(function(w, d, undefined) {

    'use strict';

    angular.module('angularTodo', [
    		'ui.router'
    	])
	    .config(function ($stateProvider, $urlRouterProvider) {

        	$stateProvider.state('todo', {
        		url: '/',
        		templateUrl: 'templates/todoList.html',
        		controller: 'TodoCtrl'
        	})
            .state('edit', {
                url: '/:id/edit',
                templateUrl: 'templates/todoItem.html',
                controller: 'TodoCtrl'
            });

        	$urlRouterProvider.otherwise('/');
        })
        .controller('TodoCtrl', function ($scope, $timeout, Todo) {

        	$scope.todos = Todo.todos;
        	$scope.todo = {};

        	$scope.showNotification = function (todo) {
        		$scope.alert = todo;
        		$timeout(function () {
        			$scope.alert = null;
        		}, 5000);
        	};

        	$scope.createTodo = function (todo) {
        		var _create = Todo.create(todo);
        		$scope.showNotification(_create);
        		$scope.todo = {};
        	};

        	$scope.edit = function (id) {
        		var _edit = Todo.edit(id);
                $scope.todo = angular.copy(_edit.todo[0]);
        		$scope.todo.editing = true;
        	};

        	$scope.save = function (todo) {
        		Todo.save(todo.id, todo);
        		$scope.todo = {};
        		$scope.showNotification(todo);
        	};

        	$scope.delete = function (id) {
        		var _delete = Todo.delete(id);
        		$scope.showNotification(_delete);
        	};

        })
        .factory('Todo', function() {

            var Todo = {

            	count: 0,

                todos: [],

                notification: function (type) {
            		if (type == 'edit')
            			return 'Your todo has be changed.';
            		else if (type == 'create')
            			return 'Your todo was created.';
            		else
            			return 'Your todo was deleted.';
                },

                create: function(todo) {

                	var todo = angular.extend({
                		id: Todo.count++
                	}, todo);

                    this.todos.push(todo);

                    return {
                    	type: 'create',
                    	todo: todo,
                    	message: Todo.notification('create')
                    };
                },

                edit: function (id) {
                	var editable = Todo.todos.filter(function (item) {
                		return item.id == id;
                	});

                	return {
            			type: 'edit',
						todo: editable,
						message: Todo.notification('edit')
            		}
                },

                save: function (id, todo) {
                	var saveable = Todo.todos.filter(function (item) {
                		return item.id == id;
                	});
                	delete todo.editing;
                	saveable = todo;
                	return Todo.todos.splice(id, 1, saveable);
                },

                delete: function (id) {
                	var deleted = Todo.todos.splice(id, 1);
                	return {
                		type: 'delete',
                		todo: deleted,
                		message: Todo.notification('delete')
                	}
                }

            };

            return Todo;

        })
        .run(function() {
        	console.log('Started');
        });

    angular.element(d).ready(function() {
        angular.bootstrap(d, ['angularTodo']);
    });

})(window, document, undefined);