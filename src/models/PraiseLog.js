/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author wuyanxin
 * @date  15/12/31
 * @description
 *
 */
import Promise from 'bluebird';
import { omit } from 'lodash';
const CALLBACK_TYPE = 'praise';
const CONFIG = {
  action: {
    HATE: 'hate',
    STAR: 'star'
  }
};
const TypeFinder = {
  'thread': function threadFinder(where) {
    return Thread.findOne({ where, select: ['uuid', 'sourceID', 'title', 'url', 'category'] });
  }
}

/**
 * 调用回推接口，回推点赞
 * @param values
 * @param next
 * @returns {*}
 */
function pushPraiseBack(action) {
  return function (values, next) {
    if (!Array.isArray(values)) {
      values = [values];
    }
    let pushBackURL;
    let appkey;
    Promise.map(values, function (value) {
      if (!value.site) {
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
        if (!pushBackURL) {
          throw new Error('no comment_pushback_url');
        }

        // 过滤value字段
        value = omit(value, ['id']);

        let typeFinder = TypeFinder[value.type];

        if (!typeFinder) {
          throw new Error(`no typeFinder for type ${value.typ}`);
        }

        // 查找评论关联信息
        return Promise.all([
          User.findOne({ where: { id: value.user }, select: ['remoteID', 'username', 'avatar', 'homepage', 'status'] }),
          typeFinder({ uuid: value.targetID }),
        ]);
      }).then(function (results) {

        value.user = results[0];
        value.target = results[1];
        value.callbackType = CALLBACK_TYPE;
        value.action = action;

        sails.log.debug('Praise push back, value:', value);

        // 调用CommentService.pushBack，回推到第三方地址
        CommentService.pushBack(value, pushBackURL, appkey);
      });
    }).catch(function (error) {
      sails.log.error(error);
    }).finally(next);
  }
}

module.exports = {

  schema: true,
  identity: 'PraiseLog',
  tableName: 'praise_log',

  attributes: {

    site: { type: 'integer' },
    user: { model: 'User', required: true },
    type: { type: 'string', enum: ['comment', 'thread'] },
    targetID: { type: 'string' },  // 目标UUID
    action: { type: 'string', enum: ['hate', 'star'] }

  },

  config: CONFIG,

  afterCreate: [pushPraiseBack(CONFIG.action.STAR)],
  afterDestroy: [pushPraiseBack(CONFIG.action.HATE)],
};
