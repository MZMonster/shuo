/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author JerryC
 * @date  15/11/25
 * @description
 *
 */

let crypto = require('crypto');
let _ = require('lodash');

/**
 * 校验shuoSession的签名
 * @param shuoSessionData
 * @param appkey
 */
function verifySign(shuoSessionData, appkey) {
  // 生成签名
  let sign = _generateSign(shuoSessionData, appkey);
  // 匹配签名, 返回boolean
  return sign === shuoSessionData.sign;
}

/**
 * 解析shuoSession、shuoInfo
 * @param shuoSession
 * @param shuoInfo
 * @param appkey
 * @returns {{shuoSessionData: *, shuoInfoData: *}}
 */
function decode(shuoSession, shuoInfo, appkey) {
  return _decodeShuoInfo(shuoInfo, appkey).then(function (shuoInfoData) {
    let shuoSessionData = _decodeShuoSession(shuoSession);
    return {
      shuoSessionData : shuoSessionData,
      shuoInfoData    : shuoInfoData
    };
  });
}

/**
 * 加密shuoSessionData、shuoInfoData
 * @param shuoSessionData
 * @param shuoInfoData
 * @param appkey
 * @returns {{shuoSession: *, shuoInfo: *}}
 */
function encode(shuoSessionData, shuoInfoData, appkey) {
  return {
    shuoSession : _encodeShuoSession(shuoSessionData, appkey),
    shuoInfo    : _encodeShuoInfo(shuoInfoData, appkey)
  };
}

/**
 * 封装登出用户操作
 * @param req
 * @param res
 */
/* istanbul ignore next */
function logoutUser(req, res) {
  if (req.session.user) {
    delete req.session.user;
    delete req.session.sessionUser;
  }
  clearSessionCookie(req, res);
}

/**
 * 封装登录用户操作
 * @param req
 * @param user
 * @returns {null}
 */
/* istanbul ignore next */
function loginUser(req, user) {
  req.session.user = user.id;
  req.session.sessionUser = user;
  return null;
}

/**
 * 清楚shuoInfo shuoSession
 * @param req
 * @param res
 */
function clearSessionCookie(req, res) {
  if (req.cookies.shuosession) {
    res.cookie('shuosession', '', {expires: new Date(Date.now() + 500), httpOnly: true});
  }
  if (req.cookies.shuoinfo) {
    res.cookie('shuoinfo', '', {expires: new Date(Date.now() + 500), httpOnly: true});
  }
  res.ok();
}

/**
 * 解析shuoSession
 * @param shuoSession
 * @private
 */
function _decodeShuoSession(shuoSession) {
  try{
    if (!shuoSession) {
      return null;
    }

    // base64转义
    shuoSession = new Buffer(shuoSession, 'base64').toString();

    // 解析JSON并返回这个对象
    return JSON.parse(shuoSession);
  }catch(error){
    throw new Error('shuosession 解析失败：', error.message);
  }
}

/**
 * 解析shuoInfo
 * @param shuoInfo
 * @param appkey
 * @private
 */
function _decodeShuoInfo(shuoInfo, appkey) {
  if (!shuoInfo) return null;
  return JWTService.decode('shuoInfo', shuoInfo, appkey).catch(function (error) {
    throw new Error('shuoinfo 解析失败：', error.message);
  });
}

/**
 * 加密shuoSessionData
 * @param shuoSessionData
 * @param appkey
 * @private
 */
function _encodeShuoSession(shuoSessionData, appkey) {
  if (!shuoSessionData) return null;
  try{
    let shuoSession;
    let _shuoSessionData = _.clone(shuoSessionData);

    // 生成timestamp
    _shuoSessionData.timestamp = Date.now();
    // 生成sign
    _shuoSessionData.sign = _generateSign(_shuoSessionData, appkey);
    // 转JSON字符串
    shuoSession = JSON.stringify(_shuoSessionData);
    // 转base64
    shuoSession = new Buffer(shuoSession).toString('base64');
    return shuoSession;
  }catch(error){
    throw new Error('shuosession 加密失败：', error.message);
  }
}

/**
 * 加密shuoInfoData
 * @param shuoInfoData
 * @param appkey
 * @returns {*}
 * @private
 */
function _encodeShuoInfo(shuoInfoData, appkey) {
  if (!shuoInfoData) return null;
  try{
    let _shuoInfoData = _.clone(shuoInfoData);

    // JWT加密
    return JWTService.encode('shuoInfo', _shuoInfoData, appkey);
  }catch(error){
    throw new Error('shuoinfo 加密失败：', error.message);
  }
}

/**
 * 生成签名
 * @param data
 * @param appkey
 * @private
 */
function _generateSign(data, appkey) {
  let toSign = `timestamp=${data.timestamp}&remoteID=${data.remoteID}`;
  return _hmacsha1(toSign, appkey);
}

/**
 * hmacsha1加密
 * @param str
 * @param appkey
 * @returns {*}
 * @private
 */
function _hmacsha1(str, appkey) {
  var sha1 = crypto.createHmac('sha1', appkey);
  sha1.update(str, 'utf-8');
  return sha1.digest().toString('base64');
}

module.exports = {
  decode            : decode,
  encode            : encode,
  verifySign        : verifySign,
  logoutUser        : logoutUser,
  loginUser         : loginUser,
  clearSessionCookie: clearSessionCookie
};

