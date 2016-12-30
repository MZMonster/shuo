'use strict';

/**
 * @ngdoc overview
 * @name adminApp
 * @description
 * # adminApp
 *
 * Main module of the application.
 */
angular
  .module('adminApp', [
    'ngAnimate',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap',
    'ui.bootstrap.datetimepicker',
    'js-data',
    'cgNotify',
    'angularFileUpload',
    'decipher.tags',
    'ui.bootstrap.typeahead',
    'ng.ueditor',
    'dialogs',
    'ntt.TreeDnD',
    'ngCsv'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html'
      })
      .when('/:siteName/users', {
        templateUrl: 'views/user/users.html',
        controller: 'UsersCtrl'
      })
      .when('/:siteName/comments', {
        templateUrl: 'views/comment/comments.html',
        controller: 'CommentsCtrl'
      })
      .when('/:siteName/thread/:uuid/comments', {
        templateUrl: 'views/comment/thread-comments.html',
        controller: 'CommentsCtrl'
      })
      .when('/:siteName/threads', {
        templateUrl: 'views/thread/threads.html',
        controller: 'ThreadsCtrl'
      })
      .when('/:siteName/setting', {
        templateUrl: 'views/setting/setting.html',
        controller: 'SettingCtrl'
      })
      .when('/:siteName/data/import', {
        templateUrl: 'views/data/import.html'
      })
      .when('/administrator', {
        templateUrl: 'views/administrator/administrators.html',
        controller: 'AdministratorsCtrl'
      })
      .when('/administrator/changePassword/:userID', {
        templateUrl: 'views/administrator/change-password.html',
        controller: 'AdministratorsCtrl'
      })
      .when('/administrator/new', {
        templateUrl: 'views/administrator/administrator-new.html',
        controller: 'AdministratorsCtrl'
      })
      .when('/sites', {
        templateUrl: 'views/site/sites.html',
        controller: 'SitesCtrl'
      })
      .when('/site/new', {
        templateUrl: 'views/site/site-new.html',
        controller: 'SitesCtrl'
      })
      .otherwise({
        redirectTo: '/'
      })
  })
  .config(function (DSProvider, Config) {
    DSProvider.defaults.basePath = Config.api;
    DSProvider.defaults.baseUrl = Config.api;
  })
  .config(function ($httpProvider) {
    var interceptor = function ($q, $window) {
      return {
        responseError: function (res) {
          switch (res.status) {
            case 403:
              $window.location.href = '/admin/';
              break;
            case 404:
              //$window.location.href = '/login';
              break;
          }
          return $q.reject(res);
        }
      }
    };
    $httpProvider.interceptors.push(interceptor);
  });

