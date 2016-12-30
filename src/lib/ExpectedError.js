/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author wuyanxin
 * @date  15/11/26
 * @description
 *
 */

/**
 * 预期错误类型
 *
 * 在一些可以预知的错误中抛出一个ExpectedError
 * 在Controller层使用UtilService.errorHandler处理错误
 *
 */
class ExpectedError extends Error {

  /**
   * @param {String} code 需要按照规范在config/errors.js中定义与code关联的message
   * @param {String} [data] 附加消息,
   */
  constructor(code, data='') {
    if (!code) {
      throw new Error('ExpectedError: code can not be null');
    }
    super();
    if (process.env.NODE_ENV !== 'production') {
      Error.captureStackTrace(this);
    }
    this.code = code;
    this.data = data;

    let extraMessage;
    if (data && typeof data === 'object') {
      extraMessage = JSON.stringify(data);
    } else {
      extraMessage = String(data);
    }

    this.message = `${sails.config.errors[code] || ''}${extraMessage} | code: #${code}`;
  }
}

module.exports = ExpectedError;
