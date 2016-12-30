'use strict';

/**
 * @ngdoc directive
 * @name adminApp.directive:validFile
 * @description
 * # validFile
 * 验证表单中图片是否上传，是否更改
 */
angular.module('adminApp')
  .directive('validFile', function () {
    return {
      require: 'ngModel',
      link: function (scope, el, attrs, ngModel) {
        var isFirst = false;
        ngModel.$render = function () {
          if (isFirst) {
            ngModel.$setViewValue(el.val());
          }
          isFirst = true;
        };

        el.bind('change', function () {
          scope.$apply(function () {
            ngModel.$render();
          });
        });
      }
    };
  });
