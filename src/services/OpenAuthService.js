/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author JerryC
 * @date  15/12/3
 * @description
 *
 */

import {createHmac} from 'crypto';
let ENV = process.env.NODE_ENV;
const {
  allow_ip      : ALLOW_IP,
  allow_timeout : ALLOW_TIMEOUT = 30 * 1000
  } = sails.config.auth.open[ENV];

/**
 * 生成签名
 * @param timestamp
 * @param body
 * @param appkey
 * @returns {*}
 */
function generateSign(timestamp, body, appkey) {

  // generate seed str
  let seed = JSON.stringify(body);
  let toSign = `timestamp=${timestamp}&seed=${seed}`;
  return _hmacsha1(toSign, appkey);
}

/**
 * 时间校验
 * @param timestamp
 * @returns {null}
 * @private
 */
function timesCheck(timestamp) {
  if (Date.now() - timestamp > ALLOW_TIMEOUT){
    throw new Error('时间戳过期');
  }
  return null;
}

/**
 * 参数检查
 * @private
 */
function nullCheck() {
  throw new Error('params missing');
}

/**
 * 校验IP
 * @param req
 * @private
 */
function ipCheck(req) {
  if (ALLOW_IP === '*') return null;
  let remoteIP = req.ip;
  let allowIPs = ALLOW_IP.split(',');
  if (!allowIPs.includes(remoteIP)){
    throw new Error('ip not permit: ', remoteIP);
  }
  return null;
}

/**
 * 检验签名
 * @param sign
 * @param data
 * @param appkey
 */
function signCheck(sign, data, appkey) {
  let {timestamp, body} = data;
  let toCheckSign = generateSign(timestamp, body, appkey);
  if (sign !== toCheckSign){
    throw new Error('校验签名错误');
  }
  return null;
}

/**
 * hmacsha1加密
 * @param str
 * @param appkey
 * @returns {*}
 * @private
 */
function _hmacsha1(str, appkey) {
  var sha1 = createHmac('sha1', appkey);
  sha1.update(str, 'utf-8');
  return sha1.digest().toString('base64');
}

module.exports = {
  generateSign  : generateSign,
  timesCheck    : timesCheck,
  nullCheck     : nullCheck,
  ipCheck       : ipCheck,
  signCheck     : signCheck
};