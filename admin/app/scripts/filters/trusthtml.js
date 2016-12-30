'use strict';

/**
 * @ngdoc filter
 * @name adminApp.filter:trustHtml
 * @function
 * @description
 * # trustHtml
 * Filter in the adminApp.
 */
angular.module('adminApp')
  .filter('trustHtml', trustHtml);
trustHtml.$inject = ['$sce'];

function trustHtml($sce) {
  return function (input) {
    return $sce.trustAsHtml(input);
  };
}
