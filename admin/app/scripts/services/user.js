'use strict';

/**
 * @ngdoc service
 * @name adminApp.user
 * @description
 * # user
 * Factory in the adminApp.
 */
angular.module('adminApp')
  .factory('User', function (DS) {
    return DS.defineResource ({
      name: 'user',
      computed: {
        isDisguise: ['id',function (id) {
          return 0;
        }]
      }
    });
  });
