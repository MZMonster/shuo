'use strict';

/**
 * @ngdoc function
 * @name adminApp.controller:SiteSitesCtrl
 * @description
 * # SiteSitesCtrl
 * Controller of the adminApp
 */

angular.module('adminApp')
  .controller('SitesCtrl', SitesCtrl);

SitesCtrl.$inject = ['$scope',  'Site',  'ModelService'];

function SitesCtrl($scope, Site, ModelService) {

  var vm = $scope;

  // 分页
  vm.items_per_page = 20;   // 每页显示的记录数
  vm.maxSize = 5;           // 页数显示的数目 如 1，2，3，4，5 ，如果是 4 的话，便是 1，2，3，4
  vm.totalItems;            // 总记录数
  vm.currentPage = 1;       // 当前页数

  vm.newSite = {};
  vm.query = {};
  vm.create = create;
  vm.pageChanged = pageChanged;

  vm.search = search;

  count();
  initSites();

  function create() {
    var siteParams = {
      sitename: vm.newSite.sitename,
      url     : vm.newSite.url
    };
    ModelService.create(Site, siteParams).then(function(data) {
      if (data) {
        vm.sites.push(data);
      }
    });
  }

  /**
   * 处理页数改变的时候的函数
   */
  function pageChanged() {
    initSites();
  }

  function initSites() {
    ModelService.getLists('site', getParams()).then(function (result) {
      vm.sites = result.data;
    });
  }

  /**
   * 查询
   */
  function search() {
    vm.currentPage = 1;
    count();
    initSites();
  }

  /**
   * 获取参数
   * @returns {{sort: string, limit: number, skip: number, where: string}}
   */
  function getParams() {
    var query = {
      sort: 'createdAt DESC',
      limit: vm.items_per_page,
      skip: (vm.currentPage - 1) * vm.items_per_page,
      where: ''
    };
    var where = {};

    if (vm.query.username) {
      where.username = {contains: vm.query.username};
    }
    query.where = JSON.stringify(where);

    return query;
  }

  /**
   * 计算总数
   */
  function count() {
    var params = getParams();

    ModelService.getCount('Site', params.where).then(function (result) {
      vm.totalItems = result.count;
    })
  }
}
