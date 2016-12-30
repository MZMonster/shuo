'use strict';

/**
 * @ngdoc service
 * @name adminApp.util
 * @description
 * # util
 * Service in the adminApp.
 */
angular
  .module('adminApp')
  .service('Util', Util);

Util.$inject = ['N','Config','FileUploader','$http', '$q'];

function Util(N, Config, FileUploader, $http, $q) {
  // AngularJS will instantiate a singleton by calling "new" on this function
  return {
    notNull         : notNull,
    isNull          : isNull,
    getFileUpload   : getFileUpload,
    getLoginUser    : getLoginUser,
    getDateRange    : getDateRange
  };

  /**
   * 字符串中不存在空的返回 true
   */
  function notNull() {
    for (var i = 0; i < arguments.length; i++) {
      if (!arguments[i] || arguments[i] === '') {
        return false;
      }
    }
    return true;
  }

  /**
   * 字符串存在空的返回 true
   * @returns {boolean}
   */
  function isNull() {
    for (var i = 0; i < arguments.length; i++) {
      if (!arguments[i] || arguments[i] === '') {
        return true;
      }
    }
    return false;
  }

  /**
   * 上传图片对象
   * @param callback
   * @returns {*}
   */
  function getFileUpload(callback) {
    return new FileUploader({
      url: Config.upload.image,
      alias: 'imgFile',
      autoUpload: true,
      onCompleteItem: function (item, result) {
        var url;
        if (result.response && result.response[0].url) {
          N.success("上传成功");
          url = result.response[0].url;
        } else {
          N.fail("上传失败");
        }
        callback(url);
      }
    });
  }

  /**
   * 获取用户是否登录
   * @returns {*}
   */
  function getLoginUser() {
    var defer = $q.defer();

    $http.post(Config.domain + 'user/getUserForBackstage', {}).success(function (data) {
      if (data.is_login == 1) {
        defer.resolve(data.user);
      } else if (data.is_login == 0) {
        N.fail("您没登录。。");
        defer.reject(false);
      }
    }).catch(function () {
      N.fail("获取登录用户信息失败");
    });

    return defer.promise;
  }

  /**
   * 根据日期获取日期所在的天/自然周/月/年范围
   * @param date {Date} 日期
   * @param loffset {Number} 距离天/自然周/月/年初的天数
   * @param roffset {Number} 距离天/自然周/月/年末的天数
   * @return {Object} {start: Number, end: Number}
   * @private
   */
  function getDateRange(date, loffset, roffset) {
    var MILLISECONDS_OF_DAY = 24 * 3600 * 1000;
    var MILLISECONDS_OF_MINUTE = 60 * 1000;

    var start = new Date(date.getTime()
        // 修正UTC时区差 当天归00:00:00
      - (date.getTime() - date.getTimezoneOffset() * MILLISECONDS_OF_MINUTE) % (MILLISECONDS_OF_DAY)
        // 返回星期天 or 月初 or 年初
      - loffset * MILLISECONDS_OF_DAY);

    var end = new Date(date.getTime()
        // 修正UTC时区差 当天归00:00:00
      - (date.getTime() - date.getTimezoneOffset() * MILLISECONDS_OF_MINUTE) % (MILLISECONDS_OF_DAY)
        // 本周周末 23:59:59 or 月末
      + roffset * MILLISECONDS_OF_DAY - 1000);

    return {start: start.getTime(), end: end.getTime()};
  }
}
