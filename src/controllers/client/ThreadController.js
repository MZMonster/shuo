/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author wuyanxin
 * @date  15/11/26
 * @description
 *
 */

/**
 * 加载文章基本信息及第一页评论
 * @param req
 * @param res
 * @returns {Promise.<T>}
 */
function load(req, res) {
  let site = req.shuo.site.id;
  let {sourceID, title, url, category, image, description, limit, cLimit, sort, flat} = req.query;
  let options = {title, url, category, image, description, limit, cLimit, sort, flat};
  options.user = req.session.user;

  return ThreadService.load(site, sourceID, options).then((data) => {
    return res.ok(data, {
      view: 'partials/comment-list',
      layout: 'default'
    });
  }).catch(UtilService.errorHandler(res));
}

/**
 * 批量获取文章评论数
 * @param req
 * @param res
 * @returns {*}
 */
function count(req, res) {
  let site = req.shuo.site.id;
  let sourceID = req.query.sourceID;
  if (!sourceID) {
    return res.badRequest('sourceID can not be null');
  }

  return ThreadService.count(site, sourceID.split(',')).then((data) => {
    if (req.query.callback) {
      return res.jsonp(data);
    }
    return res.json(data);
  }).catch(UtilService.errorHandler(res));
}

module.exports = {
  load,
  count
};
