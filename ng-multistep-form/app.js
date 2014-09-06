'use strict';

// app.js
// create our angular module and inject ngAnimate and ui-router
// ============================================================
angular.module('formApp', ['ngAnimate','ui.router'])

// Configuring the routes
// ============================================================
.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    $stateProvider
	// route to show basic form (/form)
	.state('form', {
	    url: '/form',
	    templateUrl: 'form.html',
	    controller: 'FormCtrl'
	})
	// nested states
	// each of these states will have their own view
	// url will be nested (/form/profile)
	.state('form.profile', {
	    url: '/profile',
	    templateUrl: 'form-profile.html'
	})
	// url will be /form/interests
	.state('form.interests', {
	    url: '/interests',
	    templateUrl: 'form-interests.html'
	})
	// url will be /form/payment
	.state('form.payment', {
	    url: '/payment',
	    templateUrl: 'form-payment.html'
	});

    // catch all routes
    // send users to form page
    $urlRouterProvider.otherwise('/form/profile');
}])

// our controller for the form
// ============================================================
.controller('FormCtrl', ['$scope', '$rootScope', '$state', function ($scope, $rootScope, $state) {

    $scope.formData = {};

    $scope.processForm = function () {
	$state.go('form.profile');
	$rootScope.$on('$stateChangeSuccess', function (e, toState) {
	    if (toState.name === 'form.profile') {
		$scope.formData = {};
	    }
	});
    };

}])