/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author JerryC
 * @date  15/12/8
 * @description
 *
 */

let {comparePassword} = AdminService;
import _ from 'lodash';
import createRecord from 'sails/lib/hooks/blueprints/actions/create';
import updateOneRecord from 'sails/lib/hooks/blueprints/actions/update';

/**
 * 重写create，确认两次密码需要一致
 * @param req
 * @param res
 * @returns {*}
 */
function create(req, res) {
  let {password, confirmPassword} = req.body;
  if (password && password !== confirmPassword){
    return res.badRequest('两次密码不匹配');
  }
  return createRecord(req, res);
}

/**
 * 重写update，过滤password字段的更新
 * @param req
 * @param res
 * @returns {*}
 */
function update(req, res) {
  if (req.body.password){
    return res.badRequest('该接口不用于修改密码');
  }
  return updateOneRecord(req, res);
}

/**
 * 修改密码
 * @param req
 * @param res
 */
function changePassword(req, res) {
  let {id, oldPassword, password, confirmPassword} = req.body;

  // 检测两次新密码是否相等
  if (!password || password !== confirmPassword) return res.badRequest('两次密码不匹配');
  if (!oldPassword) return res.badRequest('请输入旧密码');
  if (!id) return res.badRequest('需要指定管理员id');

  // 检测旧密码是否正确
  Administrator.findOne(id).then(function (admin) {
    return comparePassword(oldPassword, admin.password);
  }).then(function (isMatch) {
    if (!isMatch){
      let error = new Error('旧密码不正确');
      error.code = 400;
      throw error;
    }
    return Administrator.update(id, {password: password});
  }).then(function (admin) {
    if (!admin){
      let error = new Error('更新失败，Admin invalid');
      error.code = 400;
      throw error;
    }
    return res.ok('修改密码成功');
  }).catch(function (error) {
    sails.log.error(error.message);
    if (error.code === 400) return res.badRequest(error.message);
    return res.serverError(error.message);
  });
}

module.exports = _.merge(_.cloneDeep(require('../base/count')), {
  _config         : {model: 'administrator'},
  create          : create,
  update          : update,
  changePassword  : changePassword
});
