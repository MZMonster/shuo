/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author wuyanxin
 * @date  15/11/25
 * @description
 *
 */

import uuid from 'uuid';

module.exports = {

  schema    : true,
  identity  : 'Thread',
  tableName : 'thread',

  attributes: {

    uuid        : {type: 'string', size: 36, unique: true, defaultsTo: uuid.v4},
    sourceID    : {type: 'string', size: 36, unique: true, required: true},
    url         : {type: 'string', size: 255},
    title       : {type: 'string', size: 255, required: true},
    category    : {type: 'string', size: 32, index: true},
    image       : {type: 'string', size: 255},
    description : {type: 'string', size: 500},
    cmtCount    : {type: 'integer', defaultsTo: 0},   // 总评论数
    partsCount  : {type: 'integer', defaultsTo: 0},   // 总参与数(包含直接评论和回复)
    star        : {type: 'integer', defaultsTo: 0},   // 赞
    hate        : {type: 'integer', defaultsTo: 0},   // 踩
    view        : {type: 'integer', defaultsTo: 0},   // 浏览数
    site        : {model: 'site'}

  },

  /**
   * @param {Object} query
   * @param {Array} field
   * @param {number} increment
   * @param {Array} select 默认为['uuid'], 则返回结果的字段为field.concat(select)
   * @returns {Object[]} updated record
   */
  increment: UtilService.generateIncrement('Thread')

};
