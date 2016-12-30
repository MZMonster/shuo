'use strict';

/**
 * @ngdoc service
 * @name adminApp.N
 * @description
 * # N
 * Service in the adminApp.
 */
angular.module('adminApp')
  .service('N', function (notify) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    return {
      success: function (message) {
        notify({ message: message, classes: 'alert-success'});
      },
      fail: function (message) {
        notify({ message: message, classes: 'alert-danger'});
      }
    }
  });
