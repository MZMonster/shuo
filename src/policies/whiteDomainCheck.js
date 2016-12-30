/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author JerryC
 * @date  15/12/12
 * @description
 *
 */

module.exports = function (req, res, next) {
  let site = req.shuo.site.id;
  let hostname = req.host;
  SiteService.domainCheck(site, hostname).then(function (isOk) {
    if(!isOk) return res.forbidden('不允许的访问域名');
    next();
  }).catch(next);
};