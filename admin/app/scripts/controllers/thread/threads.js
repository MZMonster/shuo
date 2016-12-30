'use strict';

/**
 * @ngdoc function
 * @name adminApp.controller:ThreadThreadsCtrl
 * @description
 * # ThreadThreadsCtrl
 * Controller of the adminApp
 */

angular.module('adminApp')
  .controller('ThreadsCtrl', ThreadsCtrl);

ThreadsCtrl.$inject = ['$scope', '$routeParams', 'Thread', 'N', 'Config', '$http', 'ModelService'];

function ThreadsCtrl($scope, $routeParams, Thread, N, Config, $http, ModelService) {

  var vm = $scope;

  // 分页
  vm.siteName = $routeParams.siteName || null;
  vm.items_per_page = 20;   // 每页显示的记录数
  vm.maxSize = 5;           // 页数显示的数目 如 1，2，3，4，5 ，如果是 4 的话，便是 1，2，3，4
  vm.totalItems;            // 总记录数
  vm.currentPage = 1;       // 当前页数

  vm.query = {};
  vm.LoginUser = {};
  vm.isSuper = null;
  vm.pageChanged = pageChanged;

  vm.search = search;
  vm.operation = operation;

  count();                      // 获得总记录数
  initThreads();              // 获得当前页数的 Threads 数组


  /**
   * 处理页数改变的时候的函数
   */
  function pageChanged() {
    initThreads();
  }

  /**
   *  获得当前页数的 Thread 数组
   */
  function initThreads() {
    ModelService.getLists('thread', getParams()).then(function (result) {
      vm.threads = result.data;
    });
  }

  /**
   * 查询
   */
  function search() {
    vm.currentPage = 1;
    count();
    initThreads();
  }


  /**
   * 点击详情按钮，获取该用户的角色
   * @param index
   * @param thread
   */
  function operation(index, thread) {
    var targetStatus = thread.status ? 0 : 1;
    $http.post(Config.domain + 'api/admin/thread/' + thread.id, {status: targetStatus}).success(function (data) {
      N.success("设置成功");
      vm.threads[index].status = targetStatus;
    }).error(function () {
      N.fail("设置失败");
    })
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
    where.site = Config.site[vm.siteName];

    if (vm.query.title) {
      where.title = {contains: vm.query.title};
    }
    if (vm.query.category) {
      where.category = {contains: vm.query.category};
    }
    query.where = JSON.stringify(where);

    return query;
  }

  /**
   * 计算总数
   */
  function count() {
    var params = getParams();

    ModelService.getCount('thread', params.where).then(function (result) {
      vm.totalItems = result.count;
    })
  }
}
