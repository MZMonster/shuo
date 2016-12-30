'use strict';

/**
 * @ngdoc service
 * @name adminApp.SiteConfig
 * @description
 * # SiteConfig
 * Factory in the adminApp.
 */
angular.module('adminApp')
  .factory('SiteConfig', SiteConfig);

SiteConfig.$inject = ['DS'];

function SiteConfig(DS) {
  return DS.defineResource ({
    name: "SiteConfig"
  });
}
