/**
 * Copyright (c) 2016 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author JerryC
 * @date  16/4/22
 * @description
 *
 */
'use strict';

/**
 * 获取文章信息
 * @param req
 * @param res
 */
function info(req, res) {
  let site = req.shuo.site.id;
  let sourceID = req.body.sourceID;

  if (!sourceID) {
    return res.badRequest('sourceID can not be null');
  }

  return ThreadService.info(site, sourceID.split(',')).then((data) => {
    if (req.query.callback){
      return res.jsonp(data);
    }
    return res.json(data);
  }).catch(UtilService.errorHandler(res));
}

/**
 * 创建评论thread
 */
function create(req, res) {
  let site = req.shuo.site.id;
  let { sourceID, title, url, category, description } = req.body;

  sails.log('create thread from server', { sourceID, title, url, category, description, site });

  return Thread.create({ sourceID, title, url, category, description, site })
    .then((data) => res.json(data))
    .catch(UtilService.errorHandler(res));
}

module.exports = {
  info: info,
  create
};