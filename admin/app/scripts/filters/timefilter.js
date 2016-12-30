'use strict';

/**
 * @ngdoc filter
 * @name adminApp.filter:timefilter
 * @function
 * @description
 * # timefilter
 * Filter in the adminApp.
 */
angular.module('adminApp')
  .filter('timeFilter', function () {
    return function (input) {
      return  moment(input).format('YYYY-MM-DD hh:mm:ss');
    };
  });
