/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author wuyanxin
 * @date  15/11/26
 * @description
 *
 */

import ExpectedError from '../../lib/ExpectedError';

/**
 * 发表评论
 * @param req
 * @param res
 */
function submit(req, res) {
  let {content, threadID, parentID, replyTo} = req.body;
  let comment = {content, threadID, parentID, replyTo};
  comment.site = req.shuo.site.id;
  comment.userAgent = req.get('User-Agent');
  comment.ip = req.ip;
  comment.user = req.session.user;

  CommentService.submit(comment).then((data) => {
    // populate users
    return Comment.findOne({id: data.id, select: Comment.config.select.FRONT})
      .populate('user').populate('replyTo');
  }).then(function(comment) {
    comment.currentUser = req.session.user;
    return res.ok(comment, {
      view: 'partials/comment-item',
      layout: null
    });
  }).catch(UtilService.errorHandler(res));
}

/**
 * 评论列表
 * @param req
 * @param res
 */
function list(req, res) {
  let site = req.shuo.site.id;
  let {sourceID, page, limit, cLimit, sort, flat} = req.query;
  let options = { // 过滤非法参数
    page: +page || undefined,
    limit: +limit || undefined,
    cLimit: +cLimit || undefined,
    flat: flat === 'true',
    sort
  };

  CommentService.list(site, sourceID, req.session.user, options).then((data) => {
    return res.ok(data, {
      view: 'partials/comment-list',
      layout: null
    });
  }).catch(UtilService.errorHandler(res));
}

/**
 * 删除评论
 * @param req
 * @param res
 */
function destroy(req, res) {
  let site = req.shuo.site.id;
  let commentID = req.body.commentID;

  CommentService.destroy(site, commentID, req.session.user).then((data) => {
    if (!data.result) {
      throw new ExpectedError('40008');
    }
    return res.ok(data);
  }).catch(UtilService.errorHandler(res));
}

/**
 * @用户列表搜索
 * @param req
 * @param res
 */
function getSuggestUsers(req, res) {
  let {threadID, username} = req.query;
  try {
    UtilService.checkNotNull(threadID);
  } catch (error) {
    return res.badRequest(error.message);
  }
  CommentService.atSuggestList(threadID, username).then((users) => {
    return res.ok({suggest: users});
  }).catch((error) => {
    sails.log.error(error);
    return res.badRequest(error);
  });
}

/**
 * 获取更多子评论
 * @param req
 * @param res
 */
function getMoreReplies(req, res) {
  let {commentID, page, limit} = req.query;
  return CommentService.getMoreReplies(req.shuo.site.id, commentID, page, limit).then(function(data) {
    data.currentUser = req.session.user;

    return res.ok(data, {
      view: 'partials/reply-list',
      layout: null
    });
  }).catch(UtilService.errorHandler(res));
}

/**
 * 获取一组文章的评论（类似魅玩帮讨论功能）
 * @param req
 * @param res
 */
function getGroupOfComments(req, res) {
  let site = req.shuo.site.id;
  let sourceID = req.query.sourceID;
  let limit = +req.query.limit || 4;

  if (!sourceID) {
    return res.badRequest('sourceID can not be null');
  }
  sourceID = sourceID.split(',');

  return CommentService.getGroupOfComments(site, sourceID, req.session.user, limit).then(result => {
    res.ok(result);
  }).catch(err => {
    sails.log.error(err);
    res.serverError();
  });
}

module.exports = {
  submit,
  list,
  destroy,
  getSuggestUsers,
  getMoreReplies,
  getGroupOfComments
};
