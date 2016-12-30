'use strict';

/**
 * @ngdoc function
 * @name adminApp.controller:SiteSitesCtrl
 * @description
 * # SiteSitesCtrl
 * Controller of the adminApp
 */

angular.module('adminApp')
  .controller('SettingCtrl', SettingCtrl);

SettingCtrl.$inject = ['$scope', '$routeParams', 'Site', 'SiteConfig', 'ModelService', 'N', 'Util'];

function SettingCtrl($scope, $routeParams, Site, SiteConfig, ModelService, N, Util) {

  var vm = $scope;

  // 属性
  vm.siteName = $routeParams.siteName || null;

  // 方法
  vm.save = save;

  /**
   * 初始化
   */
  initSites();

  function initSites() {
    ModelService.getLists('site', getParams()).then(function (result) {
      vm.site = result.data[0];
      vm.siteConfig = vm.site.siteConfig;
    });
  }


  /**
   * 获取参数
   * @returns {{sort: string, limit: number, skip: number, where: string}}
   */
  function getParams() {
    var query = {
      populate: ['siteConfig'],
      where: ''
    };
    var where = {};
    where.sitename = vm.siteName;
    query.where = JSON.stringify(where);

    return query;
  }

	/**
   * 参数检查
   * @returns {boolean}
   * @private
   */
  function _checkMixin() {
    // 检查是否为空
    if (Util.isNull(
        vm.siteConfig.comment_default_status
      )) {
      N.fail('「审查规则」、不能为空');
      return false;
    }
    return true;
  }

  // 保存更新
  function save() {
    if (!_checkMixin()) {
      return;
    }
    var params = {
      comment_default_status: vm.siteConfig.comment_default_status,
      comment_pushback_url: vm.siteConfig.comment_pushback_url,
      domain_whitelist: vm.siteConfig.domain_whitelist,
      user_default_avatar: vm.siteConfig.user_default_avatar
    };
    ModelService.update(SiteConfig, vm.siteConfig.id, params).then(function (data) {
      if (data) {
        vm.siteConfig = data;
      }
    });
  }

}
