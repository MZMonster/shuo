'use strict';

/**
 * @ngdoc service
 * @name adminApp.model
 * @description
 * # model
 * Service in the adminApp.
 */
angular.module('adminApp')
  .service('ModelService', ModelService);

ModelService.$inject = ['$q', '$http', 'Config', 'N', '$dialogs'];

function ModelService($q, $http, Config, N, $dialogs) {

  return {
    getLists : getLists,
    getCount : getCount,
    create   : create,
    update   : update,
    destroy  : destroy
  };

  function getLists(model, params) {
    var defer = $q.defer();
    var url = Config.domain + 'api/admin/' + model;
    var options = {
      params: params
    };

    $http.get(url, options).success(function (data) {
      defer.resolve({
        status : 1,
        data   : data
      });
    }).error(function (err) {
      N.fail('获取数据失败');
      defer.reject({
        status : 0,
        data   : []
      });
    });

    return defer.promise;
  }

  /**
   * 计算一个 model 的总记录数
   * @param    model   string   模型名称
   * @param    params  string   字符串参数
   * @returns  json
   * resolve
   *    status 1
   *    count  100
   * reject
   *    status  0
   */
  function getCount(model, params) {
    var defer = $q.defer();
    var url = Config.domain + 'api/admin/' + model + '/count?where=' + params;

    $http.get(url).success(function (data) {
      defer.resolve({
        status : 1,
        count  : data.count
      });
    }).error(function (err) {
      N.fail('获取总记录数失败');
      defer.reject({
        status : 0,
        count  : 0
      });
    });

    return defer.promise;
  }

  function create(Model, params) {
    var defer = $q.defer();

    Model.create(params).then(function (data) {
      N.success('新建成功');
      defer.resolve(data);
    }).catch(function (err) {
      N.fail('新建失败');
      defer.reject(err);
    });

    return defer.promise;
  }

  /**
   * 更新一条记录
   * @param Model
   * @param id
   * @param params
   */
  function update(Model, id, params) {
    var defer = $q.defer();

    Model
      .update(id, params)
      .then(function (data) {
        N.success('更新成功');
        defer.resolve(data);
      }).catch(function (err) {
        N.fail('更新失败');
        defer.reject(err);
      });

    return defer.promise;
  }

  /**
   * 删除一条记录
   * @param Model
   * @param id
   * @param title
   * @returns {*}
   */
  function destroy(Model, id, title) {
    var defer = $q.defer();
    var confirmStr;

    if (title) {
      confirmStr = '你确定要删除「' + title + '」吗？';
    } else {
      confirmStr = '你确定要删除吗？';
    }
    $dialogs
      .confirm('请确认', confirmStr)
      .result
      .then(function (btn) {
        Model.destroy(id).then(function (data) {
          N.success("删除成功");
          defer.resolve(true);
        }).catch(function () {
          N.fail("删除失败");
          defer.reject(false);
        });
      }, function (btn) {
      }
    );

    return defer.promise;
  }
}
