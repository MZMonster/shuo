/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author wuyanxin
 * @date  15/12/31
 * @description
 *
 */

import ExpectedError from '../lib/ExpectedError';

let ALLOW_MODEL = ['thread', 'comment'];  // 允许点赞的model

/**
 * 点赞/点踩/或取消赞和踩
 * @param site
 * @param type
 * @param user
 * @param targetID
 * @param action
 * @returns {*}
 */
function praise(site, user, type, targetID, action = PraiseLog.config.action.STAR) {

  type = String(type).toLowerCase();
  if (!ALLOW_MODEL.includes(type)) {
    return Promise.reject(new ExpectedError('40007', type));
  }

  try {
    UtilService.checkNotNull(site, user, type, targetID, action);
  } catch (e) {
    sails.log.debug(site, user, type, targetID, action);
    return Promise.reject(e);
  }

  return PraiseLog.findOne({targetID, user, action}).then((log) => {
    if (log) {
      // 已经赞过或踩过, 删除log并取消原操作
      return sails.models[type].increment({uuid: targetID}, [action], -1).then((result) => {
        return PraiseLog.destroy(log.id).then(() => result);
      });
    }

    // 增加log并对操作+1
    return sails.models[type].increment({uuid: targetID}, [action], 1).then((result) => {
      if (!result.length) {
        return Promise.reject(new ExpectedError('40011'));
      }
      return PraiseLog.create({site, user, type, targetID, action}).then(() => result);
    });
  });

}

module.exports = {
  praise
};
