'use strict';

app.directive('checkUsername', function (User) {
	var usernameRegex = /^[^.$\[\]#\/\s]+$/;

	return {
		require: 'ngModel',
		restrict: 'E',
		link: function (scope, el, attrs, ctrl) {
			ctrl.$parsers.unshift(function (viewValue) {
				if (usernameRegex.test(viewValue)) {
					if (User.findByUsername(viewValue).$getIndex().length === 0) {
						ctrl.$setValidity('taken', true);
						ctrl.$setValidity('invalid', true);
						return viewValue;
					} else {
						ctrl.$setValidity('taken', false);
						ctrl.$setValidity('invalid', true);

						return undefined;
					}
				} else {
					ctrl.$setValidity('taken', true);
					ctrl.$setValidity('invalid', false);

					return undefined;
				}
			});
		}
	};
});
