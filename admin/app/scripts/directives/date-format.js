'use strict';

/**
 * @ngdoc directive
 * @name adminApp.directive:dateFormat
 * @description
 * # dateFormat
 */
angular.module('adminApp')
  .directive('dateFormat', dateFormat);

dateFormat.$inject = ['$filter'];

function dateFormat($filter) {
  var dateFilter = $filter('date');
  return {
    require: 'ngModel',
    link: function (scope, elm, attrs, ctrl) {

      function formatter(value) {
        return dateFilter(value, 'yyyy-MM-dd'); //format
      }

      function parser() {
        console.log("parser");
        return ctrl.$modelValue;
      }

      ctrl.$formatters.push(formatter);
      ctrl.$parsers.unshift(parser);

    }
  };
}
