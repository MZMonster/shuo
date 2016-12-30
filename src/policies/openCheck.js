/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author JerryC
 * @date  15/12/3
 * @description
 *  OPEN API 的授权过滤器，用于过滤非授权的请求。
 */

let {
  ipCheck,
  signCheck,
  timesCheck,
  nullCheck
  } = OpenAuthService;

module.exports = function (req, res, next) {
  try{

    let {sign = nullCheck(), timestamp = nullCheck()} = req.headers;
    let {appkey = nullCheck()} = req.shuo.site;
    let body = req.body;

    // 过滤IP
    ipCheck(req);

    // 签名校验
    signCheck(sign, {timestamp, body}, appkey);

    // 时间验证
    timesCheck(timestamp);

    return next();
  }catch(error){
    sails.log.error(error.message || 'open check error');
    return res.forbidden();
  }
};

