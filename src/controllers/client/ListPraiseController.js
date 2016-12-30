/**
 * Copyright (c) 2016 Meizu MeiWanBang, All rights reserved.
 * http://wan.meizu.com/
 * @author wuyanxin
 * @date  16/6/16
 * @description
 *   实现类似lifekit计步排行榜点赞功能, 即列表式的点赞功能
 *   每天的排行榜当做一个thread
 *   每条排名记录当做一个comment
 */

/**
 * 为某条记录点赞
 * @param req
 * @param res
 * @returns {*}
 */
function star(req, res) {
  let site = req.shuo.site.id;
  let user = req.session.user;
  let {uuid, content, sourceID, title, targetUser} = req.body;
  let thread = {sourceID, title};
  let comment = {uuid, content, targetUser};

  ListPraiseService.star(site, user, comment, thread)
    .then(res.ok)
    .catch(UtilService.errorHandler(res));
}

/**
 * 加载一个列表的点赞数据
 * @param req
 * @param res
 * @returns {*}
 */
function load(req, res) {
  let site = req.shuo.site.id;
  let user = req.session.user;
  let commentID = req.query.commentID;
  if (!commentID) {
    return res.badRequest('commentID can not be null');
  }

  ListPraiseService.loadStarsOfComments(site, commentID.split(','), user).then((data) => {
    if (req.query.callback) {
      return res.jsonp(data);
    }
    return res.json(data);
  }).catch(UtilService.errorHandler(res));
}

/**
 * 获取某条记录的已点赞人信息
 * @param req
 * @param res
 * @returns {Array}
 * @returnExample
 *  [
 *    {
 *      uuid: "987490e0-4d91-428b-bda2-deeae06dc03d",
 *      remoteID: "e749e6bc-fa38-4c95-bdd9-6fe1f6522aff",
 *      username: "EthanWu",
 *      avatar: "http://img.res.meizu.com/img/download/uc/85/27/06/80/00/8527068/w200h200",
 *      homepage: "http://wan.meizu.com/people/N1AWDdP6"
 *    }
 *    ...
 *  ]
 */
function getStarredUsers(req, res) {
  let site = req.shuo.site.id;
  let targetID = req.query.targetID;
  if (!targetID) {
    return res.badRequest('targetID can not be null');
  }

  ListPraiseService.getStarredUsers(site, targetID).then((users) => {
    if (req.query.callback) {
      return res.jsonp(users);
    }
    return res.json(users);
  }).catch(UtilService.errorHandler(res));
}

module.exports = {
  star,
  load,
  getStarredUsers
};
