/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author JerryC
 * @date  15/12/8
 * @description
 *
 */

import bcrypt from 'bcryptjs';
import url from 'url';
import Promise from 'bluebird';
const ADMIN_PAGE = '/admin/#/';

/**
 * Hash a password
 * @param password
 * @returns {Promise}
 */
function hashPassword (password) {
  return new Promise(function (resolve, reject) {
    bcrypt.hash(password, 10, function (err, hash) {
      if (err) {
        return reject(err);
      }
      return resolve(hash);
    });
  });
}

/**
 * Compare a password
 * @param password
 * @param hash
 * @returns {Promise}
 */
function comparePassword(password, hash) {
  return new Promise(function (resolve, reject) {
    bcrypt.compare(password, hash, function (err, res) {
      if (err) {
        return reject(err);
      }
      return resolve(res);
    });
  });
}

/**
 * 记录登录用户信息，返回LoginLog对象
 * @param req
 */
function auditLogin(req, isSuccess, failReason) {
  return AdminLoginLog.create({
    loginTime   : new Date(),
    adminLog    : req.adminLog,
    isSuccess : isSuccess,
    failReason: failReason
  }).then(function (adminLoginLog) {
    req.session.adminLoginLog = adminLoginLog.id;
    return adminLoginLog;
  }).catch(function (error) {
    sails.log.error(error);
  });
}

/**
 * 记录登出日志
 * @param req
 */
function auditLogout(req) {
  var adminLoginLog = req.session.adminLoginLog;
  if (!adminLoginLog){
    return Promise.resolve();
  }

  delete req.session.adminLoginLog;
  return AdminLoginLog.update({id: adminLoginLog}, {
    logoutTime: new Date()
  }).then(function (loginLog) {
    return loginLog[0];
  }).catch(function (error) {
    sails.log.error(error);
  });
}

/**
 * 封装登录用户的操作
 * @param req
 * @param res
 * @param admin
 */
function loginAdmin(req, res, admin) {
  auditLogin(req, true).finally(function () {
    req.session.admin = admin.id;
    req.session.sessionAdmin = admin;
    return res.redirect(ADMIN_PAGE);
  });
}

/**
 * 封装登出用户的操作
 * @param req
 * @param res
 */
function logoutAdmin(req, res) {
  auditLogout(req).finally(function () {
    delete req.session.sessionAdmin;
    delete req.session.admin;
    res.redirect(ADMIN_PAGE);
  });
}

/**
 * 格式化Request url
 * @param req
 * @returns {*}
 * @private
 */
function _formatRequestUrl (req) {
  return url.format({
    protocol: req.protocol,
    host: req.host || sails.getHost(),
    pathname: req.path
  });
}

/**
 * 记录请求信息，并返回AdminLog对象
 * @param req
 */
function auditRequest(req) {
  var ipAddress = req.headers['x-forwarded-for'] || (req.connection && req.connection.remoteAddress);
  var params    = {
    query : req.query,
    body  : req.body
  };

  return AdminLog.create({
    ipAddress     : ipAddress,
    url           : _formatRequestUrl(req),
    path          : req.options && req.options.detectedVerb && req.options.detectedVerb.path,
    controller    : req.options && req.options.controller,
    action        : req.options && req.options.action,
    method        : req.method,
    params        : params,
    device        : req.headers['user-agent'],
    administrator : req.session.admin || null
  });
}

module.exports = {
  hashPassword    : hashPassword,
  comparePassword : comparePassword,
  loginAdmin      : loginAdmin,
  logoutAdmin     : logoutAdmin,
  auditRequest    : auditRequest,
  auditLogin      : auditLogin,
  auditLogout     : auditLogout
};