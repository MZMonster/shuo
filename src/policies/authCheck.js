/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author JerryC
 * @date  15/11/25
 * @description
 *
 */

module.exports = function (req, res, next) {
  let shuoSession = req.cookies.shuosession;
  let shuoInfo    = req.cookies.shuoinfo;
  let user        = req.session.user;
  sails.log.debug('login user:', user);

  // Once shuoSession or ShuoInfo invalid ,
  // logout user if has been logined
  // and return forbidden.
  if (!shuoSession || !shuoInfo){
    sails.log.error('shuoSession 或 shuoInfo 获取失败');
    if(user) AuthService.logoutUser(req, res);
    else AuthService.clearSessionCookie(req, res);
    return res.forbidden('permission error');
  }

  // Next if user has been logined
  if (user){
    return next();
  }

  // get appkey and siteid
  if (!req.shuo.site || !req.shuo.site.id || !req.shuo.site.appkey){
    sails.log.error('site.appkey or site.id 获取失败');
    AuthService.clearSessionCookie(req, res);
    return res.forbidden('permission error');
  }
  let appkey = req.shuo.site.appkey;
  let siteID = req.shuo.site.id;

  // Decode shuoSession and shuoInfo.
  // If succeed, it will return decoded data of shuoSession and shuoInfo.
  AuthService.decode(shuoSession, shuoInfo, appkey).then(function (data) {
    let {shuoSessionData, shuoInfoData} = data;
    sails.log.debug('shuoSessionData:', shuoSessionData);
    sails.log.debug('shuoInfoData:', shuoInfoData);

    // Check shuoSessionData and shuoInfoData.
    // Once conform one of conditions will logout user and return forbidden :
    // 1. shuoSession or shuoInfo invalid
    // 2. shuoSession.remoteID isn't equal shuoInfo.remoteID.
    if (!shuoSessionData || !shuoInfoData || shuoSessionData.remoteID !== shuoInfoData.remoteID){
      if(user) AuthService.logoutUser(req, res);
      throw new Error('shuoSession、shuoInfo 不存在或不匹配');
    }

    // Check sign.
    // It will logout user and return forbidden if the sign mismatching.
    if (!AuthService.verifySign(shuoSessionData, appkey)){
      if(user) AuthService.logoutUser(req, res);
      throw new Error('shuoSession.sign 匹配失败');
    }

    // All check passed ,
    // then update user info from shuoInfo
    // and login user.
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
    }).then(function (user) {
      if (!user) return User.create(userInfo);
      if (user.site !== siteID) throw new Error('用户与站点不匹配');
      return User.update(user.id, userInfo).then((users) => {
        return users[0];
      });
    });
  }).then(function (user) {
    sails.log.debug('user:', user);
    AuthService.loginUser(req, user);
    return next();
  }).catch(function (error) {
    sails.log.error(error.message || '身份验证失败');
    AuthService.clearSessionCookie(req, res);
    return res.forbidden('permission error');
  });
};