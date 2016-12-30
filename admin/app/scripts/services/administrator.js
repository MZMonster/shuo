'use strict';

/**
 * @ngdoc service
 * @name adminApp.administrator
 * @description
 * # administrator
 * Factory in the adminApp.
 */

angular.module('adminApp')
  .factory('Administrator', Administrator);

Administrator.$inject = ['DS'];

function Administrator(DS) {
  return DS.defineResource ({
    name: "Administrator"
  });
}
