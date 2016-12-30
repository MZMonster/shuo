/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author wuyanxin
 * @date  15/11/25
 * @description
 *
 */

import Promise from 'bluebird';
import ExpectedError from '../lib/ExpectedError';

/**
 * 获取页面评论信息
 * @param {int} site
 * @param {String} sourceID
 * @param {Object} options {title, category, image, description, user}
 * @return {Object}
 * {
 *  threadID: 'fae98886-cac4-431e-bb3a-f912aba15b69',
 *   cmtCount: 78,  // 评论数
 *   partsCount: 103,  // 参与数
 *   page: 1,  // 当前页
 *   limit: 30,  // 每页几条
 *   totalPage: 3,  // 共多少页
 *   list: [    // 评论列表
 *     {Comment},
 *     ...
 *   ],
 *   users: {   // 关联用户
 *     "user.uuid": userObject,
 *     ...
 *   }
 * }
 */
function load(site, sourceID, options) {
  if (!sourceID) {
    return Promise.reject(new ExpectedError('40001'));
  }

  return Thread.findOne({site: site, sourceID: sourceID}).then((thread) => {
    if (!thread) {
      if (!options || !options.title) {
        return Promise.reject(new ExpectedError('40001'));
      }

      options.sourceID = sourceID;
      options.site = site;
      return Thread.create(options);
    }
  }).then(() => {
    Thread.increment({site: site, sourceID: sourceID}, ['view']);
    return CommentService.list(site, sourceID, options.user, {
      limit: +options.limit || undefined,
      cLimit: +options.cLimit || undefined,
      flat: options.flat === 'true',
      sort: options.sort,
    });
  });
}

/**
 * 批量获取文章评论数
 * @param site
 * @param sourceIDs
 * @return {Object}
 * {
 *   "12345679": {
 *     sourceID: "12345679",
 *     uuid: "5467321313", // threadID
 *     cmtCount: 123,   // 直接评论数
 *     partsCount: 145   // 参与数(所有评论数)
 *   }
 * }
 */
function count(site, sourceIDs) {
  if (!sourceIDs || !sourceIDs.length) {
    return Promise.reject(new ExpectedError('40001'));
  }

  return Thread.find({
    site: site,
    sourceID: sourceIDs,
    select: ['sourceID', 'uuid', 'cmtCount', 'partsCount', 'view']
  }).then((threads) => _.indexBy(threads, 'sourceID'));
}

/**
 * 批量获取文章的信息
 * @param site
 * @param sourceIDs
 */
function info(site, sourceIDs) {
  if (!sourceIDs || !sourceIDs.length) {
    return Promise.reject(new ExpectedError('40001'));
  }
  if (!Array.isArray(sourceIDs)){
    sourceIDs = [sourceIDs];
  }

  return Promise.map(sourceIDs, (sourceID) => {
    return CommentService.list(site, sourceID, null, {
      limit: null,
      cLimit: null,
      threadSelect: Object.keys(Thread.attributes),
      commentSelect: Object.keys(Comment.attributes)
    });
  });
}

module.exports = {
  load,
  count,
  info
};
