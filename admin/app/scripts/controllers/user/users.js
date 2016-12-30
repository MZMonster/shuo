'use strict';

/**
 * @ngdoc function
 * @name adminApp.controller:UsersCtrl
 * @description
 * # UsersCtrl
 * Controller of the adminApp
 */
angular.module('adminApp')
  .controller('UsersCtrl', UsersCtrl);

UsersCtrl.$inject = ['$scope', '$routeParams', 'User', 'N', 'Config', '$http', 'ModelService', '$dialogs'];

function UsersCtrl($scope, $routeParams, User, N, Config, $http, ModelService, $dialogs) {

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
  initUsers();              // 获得当前页数的 User 数组

  //Util.getLoginUser().then(function (user) {
  //  if (user) {
  //    vm.LoginUser = user;
	//
  //    $http.get(Config.domain + 'user/getRoles/' + vm.LoginUser.id).success(function (result) {
  //      for (var i = 0; i < result.length; i++) {
  //        if (result[i].name == 'superadmin') {
  //          vm.isSuper = true;
  //        }
  //      }
  //    });
  //  }
  //});

  /**
   * 处理页数改变的时候的函数
   */
  function pageChanged() {
    initUsers();
  }

  /**
   *  获得当前页数的 User 数组
   */
  function initUsers() {
    ModelService.getLists('user', getParams()).then(function (result) {
      vm.users = result.data;
    });
  }

  /**
   * 查询
   */
  function search() {
    vm.currentPage = 1;
    count();
    initUsers();
  }


  /**
   * 点击详情按钮，获取该用户的角色
   * @param index
   * @param user
   */
  function operation(index, user) {
    var targetStatus = user.status ? 0 : 1;
    $http.post(Config.domain + 'api/admin/user/' + user.id, {status: targetStatus}).success(function (data) {
      N.success("设置成功");
      vm.users[index].status = targetStatus;
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

    if (vm.query.status) {
      where.status = vm.query.status;
    }
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

    ModelService.getCount('user', params.where).then(function (result) {
      vm.totalItems = result.count;
    })
  }
}
