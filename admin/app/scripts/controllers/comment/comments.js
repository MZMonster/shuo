'use strict';

/**
 * @ngdoc function
 * @name adminApp.controller:CommentCommentsCtrl
 * @description
 * # CommentCommentsCtrl
 * Controller of the adminApp
 */

angular.module('adminApp')
  .controller('CommentsCtrl', CommentsCtrl);

CommentsCtrl.$inject = ['$scope', '$routeParams', 'Comment', 'N', 'Config', '$http', 'ModelService', '$filter'];

function CommentsCtrl($scope, $routeParams, Comment, N, Config, $http, ModelService, $filter) {

  var vm = $scope;

  // 分页
  vm.items_per_page = 20;   // 每页显示的记录数

  vm.siteName = $routeParams.siteName || null;

  vm.maxSize = 5;           // 页数显示的数目 如 1，2，3，4，5 ，如果是 4 的话，便是 1，2，3，4
  vm.totalItems = 0;            // 总记录数
  vm.currentPage = 1;       // 当前页数
  vm.threadUuid = $routeParams.uuid || null;
  vm.chartTitleTime = $filter("date")(new Date, "yyyy-MM-dd");
  vm.query = {
    period: 1,
    status: 2,
    startTime: $filter("date")(new Date, "yyyy-MM-dd"),
    endTime: $filter("date")(new Date, "yyyy-MM-dd")
  };
  vm.dateEnd = new Date;
  vm.dateStart = new Date(new Date - 864e5 * vm.query.period);

  vm.filterByDateRange = filterByDateRange;
  vm.filterByCustomDateRange = filterByCustomDateRange;
  vm.setQueryDate = setQueryDate;
  vm.pageChanged = pageChanged;
  vm.search = search;
  vm.operation = operation;

  count();                      // 获得总记录数
  initComments();              // 获得当前页数的 Comment 数组

  /**
   * 处理页数改变的时候的函数
   */
  function pageChanged() {
    initComments();
  }

  /**
   *  获得当前页数的 Comment 数组
   */
  function initComments() {
    ModelService.getLists('comment', getParams()).then(function (result) {
      vm.comments = result.data;
    })
  }

  /**
   * 查询
   */
  function search() {
    vm.currentPage = 1;
    count();
    initComments();
  }

  /**
   * 删除、置顶评论
   * @param index
   * @param comment
   * @param select
   * @param operate
   */
  function operation(index, comment, select, operate) {
    var targetStatus = comment[select] ? 0 : 1;
    if (operate) {
      targetStatus = comment[select] === 2 ? 1 : 2;
    }
    var updateQuery = select === 'status' ? {status: targetStatus} : {isTop: targetStatus};
    $http.post(Config.domain + 'api/admin/comment/' + comment.id, updateQuery).success(function (data) {
      N.success("设置成功");
      vm.comments[index][select] = targetStatus;
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

    console.log(vm.query);

    if (vm.query.status && vm.query.status != "") {
      where.status = vm.query.status;
    }

    if (vm.query.startTime && vm.query.startTime != "") {
      where.createdAt = where.createdAt || {};
      where.createdAt['>'] = moment(vm.query.startTime).format("YYYY-MM-DD")
    }
    if (vm.query.endTime && vm.query.endTime != "") {
      where.createdAt = where.createdAt || {};
      var endDate = new Date(vm.query.endTime);
      endDate.setDate(endDate.getDate() + 1);
      where.createdAt['<'] = $filter("date")(endDate, "yyyy-MM-dd");
    }

    if (vm.query.content) {
      where.content = {contains: vm.query.content};
    }

    if (vm.threadUuid) {
      delete where.createdAt;
      where.threadID = vm.threadUuid;
    }

    if (vm.isPraiseDesc) {
      query.sort = 'star desc';
    }
    if (vm.isReplyCountDesc) {
      query.sort = 'replyCount desc';
    }

    query.where = JSON.stringify(where);

    return query;
  }

  /**
   * 计算总数
   */
  function count() {
    var params = getParams();

    ModelService.getCount('comment', params.where).then(function (result) {
      vm.totalItems = result.count;
    })
  }




  function filterByCustomDateRange() {
    try {
      vm.dateStart = new Date(vm.dateStart);
      vm.dateEnd = new Date(vm.dateEnd);
    } catch (e) {
      return
    }
    if (angular.isDate(vm.dateStart) && angular.isDate(vm.dateEnd)) {
      if (vm.dateEnd.getTime() - vm.dateStart.getTime() < 0) {
        N.fail("请输入正确日期顺序");
        return;
      }
      var today = new Date;
      if (today.getTime() - vm.dateEnd.getTime() < 0) {
        N.fail("结束日期不能大于今天");
        return;
      }
      if (today.getTime() - vm.dateStart.getTime() < 0) {
        N.fail("开始日期不能大于今天");
        return;
      }
      vm.chartTitleTime = $filter("date")(vm.dateStart, "yyyy-MM-dd") + " 至 " + $filter("date")(vm.dateEnd, "yyyy-MM-dd");
      vm.setQueryDate();
    }
  }

  function filterByDateRange(e) {
    if (e && e > 1) {
      var a = (new Date).getTime() - 864e5 * (e - 1);
      vm.chartTitleTime = $filter("date")(new Date(a), "yyyy-MM-dd") + " 至 " + $filter("date")(new Date, "yyyy-MM-dd");
      vm.query.period = e;
    } else {
      vm.chartTitleTime = $filter("date")(new Date, "yyyy-MM-dd");
      vm.query.period = 1;
    }
    vm.dateEnd = new Date;
    vm.dateStart = new Date(vm.dateEnd.getTime() - 864e5 * (vm.query.period - 1));

    vm.setQueryDate();
  }

  function setQueryDate() {
    vm.query.startTime = $filter("date")(vm.dateStart, "yyyy-MM-dd");
    vm.query.endTime = $filter("date")(vm.dateEnd, "yyyy-MM-dd");
  }
}
