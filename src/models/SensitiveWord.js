/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author wuyanxin
 * @date  15/9/6
 * @description
 *
 */

module.exports = {

  schema    : true,
  identity  : 'SensitiveWord',
  tableName : 'sensitiveWord',

  attributes: {
    id: {type: 'integer', primaryKey: true},
    type: {type: 'integer', defaultsTo: 1},
    keyword: {type: 'string', size: 300, notNull: true},
    replace: {type: 'string', size: 300},
    createdBy: {type: 'integer'},
    createdAt: {type: 'datetime'},
    updatedBy: {type: 'integer'},
    updatedAt: {type: 'datetime'}
  }
};
