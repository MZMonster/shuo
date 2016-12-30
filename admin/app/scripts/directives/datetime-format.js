'use strict';

/**
 * @ngdoc directive
 * @name adminApp.directive:datetimeFormat
 * @description
 * # datetimeFormat
 */
angular.module('adminApp')
  .directive('datetimeFormat', function ($filter) {
    var dateFilter = $filter('date');
    return {
      require: 'ngModel',
      link: function (scope, elm, attrs, ctrl) {

        function formatter(value) {
          return dateFilter(value, 'yyyy-MM-dd HH:mm:ss'); //format
        }

        function parser() {
          return ctrl.$modelValue;
        }

        ctrl.$formatters.push(formatter);
        ctrl.$parsers.unshift(parser);

      }
    };
  });
