/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author JerryC
 * @date  15/12/10
 * @description
 *    从请求头中获取appid，查询site
 *
 */
import ExpectedError from '../lib/ExpectedError';
let {errorHandler} = UtilService;

module.exports = function (req, res, next) {
  let appid = req.headers.appid || req.query.appid || req.body && req.body.appid;
  if(!appid) return errorHandler(res)(new ExpectedError('40005', appid));

  Site.findOne({appid: appid}).then(function (site) {
    if(!site) throw new ExpectedError('40005', appid);
    req.shuo = {site};
    next();
  }).catch(errorHandler(res));
};