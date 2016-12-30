/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author JerryC
 * @date  15/11/27
 * @description
 *
 */
let Promise = require('bluebird');
let jwt = require('jsonwebtoken');
jwt.verify = Promise.promisify(jwt.verify);

const Strategy = {
  'shuoInfo': {
    encode: normalEncode,
    decode: normalDecode
  },
  'pushback': {
    encode: normalEncode,
    decode: normalDecode
  }
  // you can extend custom strategy in the following
};

/**
 * 通用解密方法
 * @param token
 * @param appkey
 * @returns {*}
 */

/**
 * 通用加密方法
 * @param data
 * @param appkey
 * @returns {*}
 */
function normalEncode(data, appkey) {
  return jwt.sign(data, appkey);
}
function normalDecode(token, appkey) {
  return jwt.verify(token, appkey);
}

module.exports = {
  encode: function encode(strategy, data, appkey) {
    return Strategy[strategy].encode(data, appkey);
  },
  decode: function decode(strategy, token, appkey) {
    return Strategy[strategy].decode(token, appkey);
  }
};