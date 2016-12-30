'use strict';

/**
 * @ngdoc service
 * @name adminApp.comment
 * @description
 * # comment
 * Factory in the adminApp.
 */

angular.module('adminApp')
  .factory('Comment', Comment);

Comment.$inject = ['DS'];

function Comment(DS) {
  return DS.defineResource ({
    name: "Comment"
  });
}
