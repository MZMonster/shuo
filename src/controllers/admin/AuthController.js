/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author JerryC
 * @date  15/12/9
 * @description
 *
 */

let {comparePassword, loginAdmin, logoutAdmin, auditLogin, auditLogout} = AdminService;
let adminInfoSelect = ['id', 'uuid',  'username', 'password'];

/**
 * Login Admin
 * @param req
 * @param res
 * @returns {*}
 */
function login(req, res) {
  let {username, password} = req.body;
  if (!username || !password) {
    auditLogin(req, false, '参数不全');
    return res.badRequest('参数不全');
  }

  // 查找Admin
  let admin;
  Administrator.findOne({
    where: {username: username},
    select: adminInfoSelect
  }).then(function (_admin) {
    admin = _admin;

    // 对比密码
    return comparePassword(password, admin.password);
  }).then(function (isMatch) {
    if (!isMatch){
      let error = new Error('密码错误');
      error.code = 400;
      throw error;
    }

    // 如果密码正确，则登录Admin
    delete admin.password;
    return loginAdmin(req, res, admin);
  }).catch(function (error) {
    auditLogin(req, false, error.message);
    if (error.code === 400 ) {
      sails.log.error(error.message);
      return res.badRequest(error.message);
    }
    sails.log.error(error);
    return res.serverError(error.message);
  });
}

/**
 * Logout Admin
 * @param req
 * @param res
 */
function logout(req, res) {
  return logoutAdmin(req, res);
}

/**
 *
 * @param req
 * @param res
 */
function loginPage(req, res) {
	return res.view('partials/login',{layout:'login'});
}
module.exports = {
  login    : login,
  logout   : logout,
	loginPage: loginPage
};