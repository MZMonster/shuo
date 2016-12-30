/**
 * Copyright (c) 2014 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author JerryC
 * @date  15/1/23
 * @description
 *
 */

var Promise      = require('bluebird'),
    _            = require('lodash'),
    uuid         = require('uuid'),
    path         = require('path'),
    development  = process.env.NODE_ENV || 'development',
    upyunDefault =  sails.config.upload[development],
    upyunConfig  = _.defaults(upyunDefault.upyun, {
      domain      : sails.config.upload.imgHost,
      adapter     : require('skipper-upyun')
    }),
    upBasePath = upyunConfig.basePath;

/**
 * 上传文件到又拍云
 * use way : UploadService.uploadToUpyun(req.file('files')).then(callback(result))
 * @param files
 * @param options
 * @returns {Promise}
 */
/* istanbul ignore next */
function uploadToUpyun(files, options) {
  var threadID  = options && options.threadID,
      fileName  = options && options.fileName;

  if(!files){
    return Promise.reject(new Error('The property \'files\' isn\'t exist'));
  }

  return new Promise(function (resolve, reject) {

    if (!threadID){
      threadID = 'public';
    }

    // 生成上传路径
    upyunConfig.dirname = _createDirOfDate(upBasePath + threadID + '/');

    // 重定义图片命名
    if (fileName){
      upyunConfig.saveAs = fileName;
    }

    // 上传图片
    files.upload(upyunConfig, function (err, result) {
      if (err){
        return reject(err);
      }
      return resolve(result);
    });
  });
}

/**
 * 创造当前日期路径
 * @returns {string}
 */
function _createDirOfDate(basePath) {
  var date = new Date(),
    year = date.getFullYear(),
    month = date.getMonth() + 1;
  return basePath + year + '/' + month + '/';
}

module.exports = {
  uploadToUpyun   : uploadToUpyun
};
