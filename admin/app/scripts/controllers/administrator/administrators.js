'use strict';

/**
 * @ngdoc function
 * @name adminApp.controller:AdministratorAdministratorsCtrl
 * @description
 * # AdministratorAdministratorsCtrl
 * Controller of the adminApp
 */

angular.module('adminApp')
  .controller('AdministratorsCtrl', AdministratorsCtrl);

AdministratorsCtrl.$inject = ['$scope', '$routeParams', 'N', 'Administrator',  'ModelService', '$http', 'Config'];

function AdministratorsCtrl($scope,  $routeParams, N, Administrator,  ModelService, $http, Config) {

  var vm = $scope;

  // 分页
  vm.items_per_page = 20;   // 每页显示的记录数
  vm.maxSize = 5;           // 页数显示的数目 如 1，2，3，4，5 ，如果是 4 的话，便是 1，2，3，4
  vm.totalItems;            // 总记录数
  vm.currentPage = 1;       // 当前页数
  vm.userID = $routeParams.userID || null;

  vm.newAdmin = {};
  vm.query = {};
  vm.changeQuery = {};
  vm.create = create;
  vm.pageChanged = pageChanged;
  vm.changePassword = changePassword;
  vm.search = search;

  count();
  initAdministrators();

  function create() {
    var adminParams = {
      username       : vm.newAdmin.username,
      password       : vm.newAdmin.password,
      confirmPassword: vm.newAdmin.confirmPassword
    };
    ModelService.create(Administrator, adminParams).then(function(data) {
      if (data) {
        vm.administrators.push(data);
      }
    });
  }

  function changePassword() {
    var passwordParams = {
      id: vm.userID,
      oldPassword: vm.changeQuery.old,
      password: vm.changeQuery.new,
      confirmPassword: vm.changeQuery.confirmNew
    };
    $http.post(Config.domain + 'api/admin/administrator/changePassword' , passwordParams).success(function () {
      N.success("修改成功");
    }).error(function () {
      N.fail("修改失败");
    })

  }

  /**
   * 处理页数改变的时候的函数
   */
  function pageChanged() {
    initAdministrators();
  }

  /**
   *  获得当前页数的 User 数组
   */
  function initAdministrators() {
    ModelService.getLists('administrator', getParams()).then(function (result) {
      vm.administrators = result.data;
    });
  }

  /**
   * 查询
   */
  function search() {
    vm.currentPage = 1;
    count();
    initAdministrators();
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

    ModelService.getCount('Administrator', params.where).then(function (result) {
      vm.totalItems = result.count;
    })
  }
}
