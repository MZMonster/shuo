/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author wuyanxin
 * @date  15/11/25
 * @description
 *
 */

import uuid from 'uuid';
import Promise from 'bluebird';
import {omit} from 'lodash';
const CALLBACK_TYPE = 'comment';

/**
 * 新增评论之后Thread的cmtCount或者partsCount加1
 * 父评论回复数加1
 * @param comment
 * @param next
 * @returns {Promise.<T>}
 */
function autoIncrement(comment, next) {
  if(comment.status !== Comment.config.status.PUBLISH) {
    return next();
  }
  if (!comment.parentID) {
    return Thread.increment({uuid: comment.threadID}, ['cmtCount', 'partsCount']).then(() => next()).catch(next);
  }
  else {
    return Thread.increment({uuid: comment.threadID}, ['partsCount']).then(() => {
      return Comment.increment({uuid: comment.parentID}, ['replyCount']).then(() => next()).catch(next);
    });
  }
}

/**
 * 调用回推接口，回推评论
 * @param values
 * @param next
 * @returns {*}
 */
function pushCommentBack(values, next) {
  if(!Array.isArray(values)) {
    values = [values];
  }
  let pushBackURL;
  let appkey;
  Promise.map(values, function (value) {
    if(!value.site) {
      return null;
    }

    // 获取Comment的site
    return Site.findOne(value.site).populate('siteConfig').then(function (site) {
      if (!site) {
        throw new Error('Site not found', value.site);
      }

      // 获取site的配置，是否有 comment pushback url
      pushBackURL = site.siteConfig && site.siteConfig.comment_pushback_url;
      appkey = site.appkey;
      if(!pushBackURL) {
        throw new Error('no comment_pushback_url');
      }

      // 过滤value字段
      value = omit(value, ['id']);

      // 查找评论关联信息
      return Promise.all([
        User.findOne({where: {id: value.user}, select: ['remoteID', 'username', 'avatar', 'homepage', 'status']}),
        User.findOne({where: {id: value.replyTo}, select: ['remoteID', 'username', 'avatar', 'homepage']}),
        Thread.findOne({where: {uuid: value.threadID}, select: ['sourceID', 'url', 'title', 'category', 'description']})
      ]);
    }).then(function (results) {

      value.user = results[0];
      value.replyTo = results[1];
      value.thread = results[2];
      value.callbackType = CALLBACK_TYPE;

      // 调用CommentService.pushBack，回推到第三方地址
      CommentService.pushBack(value, pushBackURL, appkey);
    });
  }).catch(function (error) {
    sails.log.error(error.message);
  }).finally(next);
}

/**
 * filter blank parentID
 * 如果parentID为空字符串, 则保存为null
 * @param comment
 * @param next
 */
function filterParentID(comment, next) {
  comment.parentID = comment.parentID && comment.parentID.trim() ? comment.parentID : null;
  next();
}

/**
 * 审核配置
 * @param values
 * @param next
 */
function defaultStatus(values, next) {
  if(!Array.isArray(values)) {
    values = [values];
  }
  return Promise.map(values, function (value) {
    if(!value.site) {
      return null;
    }

    // 获取Comment的SiteConfig
    return SiteConfig.findOne({site: value.site}).then(function (config) {
      value.status = config && config.comment_default_status || Comment.config.status.PUBLISH;
      return value;
    });
  }).then(function (comments) {
    next(null, comments);
  }).catch(next);
}

/**
 * 如果atUsers包含了replyTo,移除之
 * @param values
 * @param next
 */
function removeReplyToFromAtUsers(values, next) {
  if(!Array.isArray(values)) {
    values = [values];
  }
  return Promise.map(values, (value) => {
    if(!value.atUsers || value.atUsers.length === 0 || !value.replyTo){
      return null;
    }
    return User.findOne({
      where: {id: value.replyTo},
      select: ['remoteID']
    }).then((user) => {
      let replyToRemoteID = user.remoteID;
      if(value.atUsers.includes(replyToRemoteID)) {
        _.remove(value.atUsers, n => n === replyToRemoteID);
      }
      return user;
    });
  }).then(() => {
    next(null, values);
  }).catch(next);
}


module.exports = {

  schema    : true,
  identity  : 'Comment',
  tableName : 'comment',

  attributes : {

    uuid      : {type: 'string', size: 50, unique: true, defaultsTo: uuid.v4},
    threadID  : {type: 'string', size: 36, required: true, index: true},
    srcContent: {type: 'text'},
    content   : {type: 'text', required: true},
    parentID  : {type: 'string', size: 36},   // 回复哪条评论
    isTop     : {type: 'boolean', defaultsTo: false},  // 是否置顶
    star      : {type: 'integer', defaultsTo: 0},   // 赞
    hate      : {type: 'integer', defaultsTo: 0},   // 踩
    status    : {type: 'integer', defaultsTo: 2, enum: [0, 1, 2]},   // 0:删除, 1: 待审核, 2: 正常
    replyCount: {type: 'integer', defaultsTo: 0},   // 多少条回复
    atUsers   : {type: 'array'}, // @的用户remoteID组
    ip        : {type: 'string'},
    userAgent : {type: 'string'},

    site      : {model: 'site'},
    user      : {model: 'User', required: true},
    replyTo   : {model: 'User'}  // 回复谁, userID

  },

  beforeCreate: [
    filterParentID,
    defaultStatus,
    removeReplyToFromAtUsers
  ],

  afterCreate: [
    autoIncrement,
    pushCommentBack
  ],

  /**
   * @param {Object} query
   * @param {Array} field
   * @param {number} increment
   * @param {Array} select 默认为['uuid'], 则返回结果的字段为field.concat(select)
   * @returns {Object[]} updated record
   */
  increment: UtilService.generateIncrement('Comment'),

  config: {
    LIMIT: 15,   // 评论默认每页多少条
    C_LIMIT: 10, // 子评论默认每页多少条
    AT_SUGGEST_LIMIT: 10, // @用户列表搜索条数

    status: {
      DELETE: 0,
      AUDITING: 1,
      PUBLISH: 2
    },

    select: {
      // 可显示于前端的所有字段
      FRONT: ['id', 'uuid', 'threadID', 'content', 'parentID', 'isTop', 'star', 'hate',
        'status', 'replyCount', 'user', 'replyTo', 'createdAt']
    }
  }
};
