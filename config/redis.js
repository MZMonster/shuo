/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author liuxing
 * @date  15/7/1
 * @description   redis 默认配置，可以使用 local文件的  redis:{} 配置覆盖掉当前的配置
 *
 */
var _ = require('lodash');

var defaultConfig = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: +process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWD || ''
};

try {
  var local = require('./local');
  if (local['redis']) {
    _.merge(defaultConfig, local['redis']);
  }
} catch (e) {} finally {
  module.exports.redisConfig = defaultConfig;
}
