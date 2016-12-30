/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author JerryC
 * @date  15/12/15
 * @description
 *
 */

/**
 * 前端登录系统，以致使用API
 * @param req
 * @param res
 */
function login(req, res) {
  let {shuoinfo, shuosession} = req.body;
  let {appkey, id: siteID} = req.shuo && req.shuo.site;
  if(!shuoinfo || !shuosession || !appkey || !siteID) {
    return res.badRequest('参数不全');
  }

  // Decode
  AuthService.decode(shuosession, shuoinfo, appkey).then((data) => {
    let {shuoSessionData, shuoInfoData} = data;

    // Check shuoSessionData and shuoInfoData
    if (!shuoSessionData || !shuoInfoData || shuoSessionData.remoteID !== shuoInfoData.remoteID){
      throw new Error('shuoSession、shuoInfo 不存在或不匹配');
    }

    // TODO timestamp check, check from shuoSessionData.timestamp

    // Check sign
    if (!AuthService.verifySign(shuoSessionData, appkey)){
      throw new Error('shuoSession.sign 匹配失败');
    }

    // Update user info or create new user
    let userInfo = {
      remoteID     : shuoInfoData.remoteID,
      username     : shuoInfoData.username,
      avatar       : shuoInfoData.avatar,
      homepage     : shuoInfoData.homepage,
      site         : siteID
    };
    sails.log.debug('userInfo: ', userInfo);

    return User.findOne({
      remoteID: shuoInfoData.remoteID
    }).then((user) => {
      if (!user) return User.create(userInfo);
      if (user.site !== siteID) throw new Error('用户与站点不匹配');
      return User.update(user.id, userInfo).then((users) => users[0]);
    });
  }).then(function (user) {
    AuthService.loginUser(req, user);
    return res.ok();
  }).catch(function (error) {
    sails.log.error(error.message || '身份验证失败');
    return res.forbidden('login error');
  });
}

/**
 * 登出用户操作
 * @param req
 * @param res
 */
function logout(req, res) {
  return AuthService.logoutUser(req, res);
}

module.exports = {
  login,
  logout
};