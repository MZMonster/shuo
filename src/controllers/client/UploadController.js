/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author JerryC
 * @date  16/1/14
 * @description
 *
 */

/**
 * Upload files to upyun
 * @param req
 * @param res
 */
function uploadUpyun(req, res) {
  _initContentType(req.file('imgFile'));
  if (req.param('isIE')){
    _specialForIE(req, res);
  }

  UploadService.uploadToUpyun(req.file('imgFile'), {
    threadID  : req.body.threadID,
    fileName  : req.body.filename
  }).then(function (result) {
    var response = _filesFormater(result);
    res.json(response);
  }).catch(function (err) {
    sails.log.error(err);
    res.json({
      "state": err.message
    });
  });
}

/**
 * 针对于IE的特殊操作
 * @author JC
 * @param req
 * @param res
 * @private
 */
function _specialForIE(req, res) {
  res.set('Content-Type', 'text/plain');
}

/**
 * 根据文件名初始化ContentType
 * @author JC
 * @param file
 * @private
 */
function _initContentType(file) {
  if (file._files){
    _.each(file._files, function (_file) {
      var isNeedInit = _isNeedInitContentType(_file.stream.headers['content-type']);
      if (_file.stream && _file.stream.headers && isNeedInit){
        var filename = _file.stream['filename'];
        _file.stream.headers['content-type'] = CT(filename);
      }
    });
  }
}

/**
 * 给ContentType定下规则，是否需要通过文件名初始化
 * @author JC
 * @param contentType
 * @private
 */
function _isNeedInitContentType(contentType) {
  if (contentType === 'undefined' || contentType === 'application/octet-stream'){
    return true;
  }else{
    return false;
  }
}

/**
 * Response formater for files
 * @param files
 */
function _filesFormater(files) {

  // set template for response
  var responseTpl = {
    state   : null,
    response: null
  };
  if (files && files.length !== 0) {
    var response = {};
    for (var i = 0; i < files.length; i++) {
      response[i] = {
        "url"     : files[i].fd,
        "title"   : files[i].fd.substr(files[i].fd.lastIndexOf('\/') + 1),
        "original": files[i].filename
      };
    }
    responseTpl.state = 'SUCCESS';
    responseTpl.response = response;
  } else {
    responseTpl.state = 'Can\'t find the upload file';
  }
  return responseTpl;
}

module.exports = {
  uploadImg: uploadUpyun
};