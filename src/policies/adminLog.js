/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author JerryC
 * @date  15/12/9
 * @description
 *
 */

const controllerWhiteList = ['admin/auth'];
let {auditRequest} = AdminService;

module.exports = function (req, res, next) {

  // GET请求不记录
  if (req.method === 'GET'){

    // 过滤白名单
    var controllerName = req.options && req.options.controller;
    var isControllerDisabled = controllerWhiteList.indexOf(controllerName) > -1;
    if (!isControllerDisabled){
      return next();
    }
  }

  auditRequest(req).then(function (adminLog) {
    req.adminLog = adminLog.id;
  }).catch(function (error) {
    sails.log.error(error);
  }).finally(function () {
    next();
  });
};