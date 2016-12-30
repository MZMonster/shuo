'use strict';

/**
 * @ngdoc service
 * @name adminApp.wanConfig
 * @description
 * # wanConfig
 * Constant in the adminApp.
 */
//var DOMAIN = 'http://localhost:1337/';

var DOMAIN = '/'; // for production
angular.module('adminApp')
  .constant('Config', {

    host: 'http://wan.meizu.com',
    domain: DOMAIN,
    wanDomain: '//wan.meizu.com',
    api: DOMAIN + 'api/admin/',
    product: DOMAIN + 'api/product/',
    apply: DOMAIN + 'api/apply/',
    upload: {
      image: DOMAIN + 'file/uploadUpyun'
    },


    tabEvent: 'tab', //
    icon: {
      user: 'glyphicon glyphicon-user',
      comment: 'glyphicon glyphicon-xbt',
      thread: 'glyphicon glyphicon-book',
      site: 'glyphicon glyphicon-wrench'
    },

    site: {
      '魅玩帮': 1,
      'bbs'  : 2
    }

  });
