'use strict';

/**
 * @ngdoc directive
 * @name adminApp.directive:upDDoneropdownToggle
 * @description
 * # upDDoneropdownToggle
 */
angular.module('adminApp')
  .directive("upDropdownToggle", ["$document", "$location", "$parse", function (e, t, a) {
    var r = null, n = angular.noop;
    return {
      restrict: "CA",
      link: function (t, a, o) {
        t.$watch("$location.path", function () {
          n()
        });
        //t.$watch(o.upDone, function (e) {
        //  e && n();
        //});
        a.parent().bind("click", function (e) {
          t.u = !1, e.preventDefault(), e.stopPropagation()
        });
        a.bind("click", function (t) {
          var o = a === r;
          t.preventDefault(), t.stopPropagation(), r && n(), o || a.hasClass("disabled") || a.prop("disabled") || (a.parent().addClass("open"), r = a, n = function (t) {
            t && (t.preventDefault(), t.stopPropagation()), e.unbind("click", n), a.parent().removeClass("open"), n = angular.noop, r = null
          }, e.bind("click", n))
        })
      }
    }
  }]);
