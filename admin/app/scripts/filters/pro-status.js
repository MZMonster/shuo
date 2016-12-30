'use strict';

/**
 * @ngdoc filter
 * @name adminApp.filter:proStatus
 * @function
 * @description
 * # proStatus
 * Filter in the adminApp.
 */
angular.module('adminApp')
  .filter('proStatusFilter', function () {
    return function (input) {
      var result = "";
      switch (input) {
        case 1:
          result = "待发布";
          break;
        case 2:
          result = "已发布未开始申请";
          break;
        case 3:
          result = "申请中";
          break;
        case 4:
          result = "筛选中";
          break;
        case 5:
          result = "发放中";
          break;
        case 6:
          result = "回收报告";
          break;
        case 7:
          result = "结案";
          break;
      }
      return result;
    };
  });
