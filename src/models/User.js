/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

import uuid from 'uuid';
import Promise from 'bluebird';

/**
 * 查询对象，如果没有则创建一个
 * @param query
 * @param values
 * @returns {*}
 */
function updateOrCreateOne(query, values) {
  return User.findOne(query).then(function (user) {
    if (user) {
      return User.update(query, values);
    }
    return User.create(values);
  }).then(function (user) {
    if (user[0]) {
      return user[0];
    }
    return user;
  });
}

/**
 * Not allow update some attribute
 * @param values
 * @param next
 */
function filterUser(values, next) {
  if(!Array.isArray(values)) {
    values = [values];
  }
  for (let value of values) {
    if(value.remoteID) {
      delete value.remoteID;
    }
    if(value.uuid) {
      delete value.uuid;
    }
  }
  next();
}

/**
 * 如果用户没有Avatar，则使用站点默认提供的Avatar
 * @param values
 * @param next
 */
function useDefaultAvatar(values, next) {
  if(!Array.isArray(values)) {
    values = [values];
  }
  Promise.map(values, function (user) {

    // 用户拥有Avatar，或者用户没有site，则返回null
    if(user.avatar || !user.site) {
      return null;
    }

    // 查找用户对应站点配置
    return SiteConfig.findOne({site: user.site}).then((config) => {

      // 如果站点没有配置默认头像，则返回null
      if(!config.user_default_avatar) {
        return null;
      }
      user.avatar = config.user_default_avatar;
      return user;
    });
  }).then(function (users) {
    next(null, users);
  });
}


module.exports = {

  schema: true,
  tableName: 'user',
  identity: 'User',

  attributes: {
    uuid        : {type: 'string', size: 36, unique: true, index: true, defaultsTo: uuid.v4},   // Shuo的用户唯一ID
    remoteID    : {type: 'string', size: 36, unique: true, index: true},    // 用户对应在远端的唯一ID
    username    : {type: 'string', size: 50},
    avatar      : {type: 'string', size: 255},
    homepage    : {type: 'string', size: 255},   // 用户在主站的个人页面
    status      : {type: 'integer', enum: [0, 1], defaultsTo: 1},    // 0，冻结；1,正常;
    site        : {model: 'site'}

  },

  config: {
    status: {
      FREEZE    : 0,
      NORMAL    : 1
    }
  },

  updateOrCreateOne: updateOrCreateOne,
  beforeUpdate  : filterUser,
  beforeCreate  : useDefaultAvatar
};
