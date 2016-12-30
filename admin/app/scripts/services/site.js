'use strict';

/**
 * @ngdoc service
 * @name adminApp.site
 * @description
 * # site
 * Factory in the adminApp.
 */
angular.module('adminApp')
  .factory('Site', Site);

Site.$inject = ['DS'];

function Site(DS) {
  return DS.defineResource ({
    name: "Site"
  });
}
