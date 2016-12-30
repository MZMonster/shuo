'use strict';

/**
 * @ngdoc service
 * @name adminApp.thread
 * @description
 * # thread
 * Factory in the adminApp.
 */

angular.module('adminApp')
  .factory('Thread', Thread);

Thread.$inject = ['DS'];

function Thread(DS) {
  return DS.defineResource ({
    name: "Thread"
  });
}
