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

import ExpectedError from '../lib/ExpectedError';
import _ from 'lodash';

/**
 * 检查当前用户是否为这些记录点过赞
 * @param user {int}
 * @param comments {Array} [...commentUUID]
 * @returns {*}
 * @private
 */
function _hasStarred(user, comments) {
  if (!user) {
    return Promise.resolve(comments);
  }

  let uuids = _.pluck(comments, 'uuid');
  return PraiseLog.find({
    where: {
      user: user,
      targetID: uuids,
      action: PraiseLog.config.action.STAR
    },
    select: ['targetID']
  }).then(function(logs) {
    let staredID = _.pluck(logs, 'targetID');
    for (let i of comments.keys()) {
      comments[i].hasStarred = staredID.includes(comments[i].uuid);
    }
    return comments;
  });
}

/**
 * 加载多条排行记录的点赞情况
 * @param site {int}
 * @param commentsIDs {Array} [...commentUUID]
 * @param user {int}
 * @returns {*}
 */
function loadStarsOfComments(site, commentsIDs, user) {
  if (!commentsIDs || !commentsIDs.length) {
    return Promise.reject(new ExpectedError('40001'));
  }

  return Comment.find({
    site,
    uuid: commentsIDs,
    select: ['uuid', 'star']
  }).then(comments => _hasStarred(user, comments))
    .then(comments => _.indexBy(comments, 'uuid'));
}

/**
 * 为排行榜上用户点赞
 * @param site {int} 站点id
 * @param user {int} 点赞用户ID
 * @param comment {Object} { uuid, content }
 * @param thread {Object} { sourceID, title }
 */
function star(site, user, comment = {}, thread = {}) {
  if (!comment.uuid || !thread.sourceID) {
    return Promise.reject(new ExpectedError('40001'));
  }

  return PraiseService.praise(site, user, 'comment', comment.uuid).then((result) => {
    return result[0];
  }).catch((err) => {
    if (err.code !== '40011') {
      return Promise.reject(err);
    }

    // 因为comment记录不存在导致点赞失败, 创建comment
    // 检查是否存在thread, 如果没有先创建thread再创建comment并设置star=1
    return Thread.findOne({sourceID: thread.sourceID}).then((_thread) => {
      if (!_thread) {
        return Thread.create({
          site,
          sourceID: thread.sourceID,
          title: thread.title || thread.sourceID
        });
      }
      return _thread;
    }).then((_thread) => {
      let _comment = {
        site,
        threadID: _thread.uuid,
        uuid: comment.uuid,
        content: comment.content || comment.uuid,
        user: 0   // 点赞记录创建人为0
      };

      // 用于记录被点赞的这条记录属于哪个用户的, 便于统计该用户一共获取了多少赞
      if (comment.targetUser) {
        _comment.atUsers = [comment.targetUser];
      }

      return Comment.create(_comment);
    }).then((_comment) => {
      return PraiseService.praise(site, user, 'comment', _comment.uuid).then(result => result[0]);
    });
  });

}

/**
 * 获取为目标记录点过赞的用户
 * @param site
 * @param targetID
 * @returns {*}
 */
function getStarredUsers(site, targetID) {
  return PraiseLog.find({
    site,
    targetID,
    action: 'star'
  }).populate('user').then((logs) => {
    let users = _.pluck(logs, 'user');
    return users;
  });
}

module.exports = {
  loadStarsOfComments,
  star,
  getStarredUsers
};
