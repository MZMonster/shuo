/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author JerryC
 * @date  15/12/3
 * @description
 *
 */

import _ from "lodash";

/**
 * 同步用户数据
 * @param req
 * @param res
 */
function importUser(req, res) {
  let users = req.body;
  let site = req.shuo.site.id;
  if (!Array.isArray(users)){
    users = [users];
  }

  let tasks = [];
  for (let user of users) {
    let {remoteID, username, avatar, homepage} = user;
    tasks.push(User.updateOrCreateOne({site, remoteID}, {site, remoteID, username, avatar, homepage}));
  }

  Promise.all(tasks).then(function (users) {
    res.ok(_.pluck(users, 'remoteID'));
  }).catch(function (error) {
    sails.log.error(error);
    res.serverError();
  });
}

module.exports = {
  importUser: importUser
};