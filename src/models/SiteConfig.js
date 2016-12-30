/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author JerryC
 * @date  15/12/7
 * @description
 *
 */

module.exports = {

  schema    : true,
  identity  : 'SiteConfig',
  tableName : 'site_config',

  attributes: {
    comment_default_status  : {type: 'integer', enum: [1, 2]},    // 审核规则，1：[待审核]先审后发，2：[发布]先发后审
    comment_pushback_url    : {type: 'string', size: 255, url: true},   // 评论回推的地址
    domain_whitelist        : {type: 'string', size: 255},   // 域名白名单
    user_default_avatar     : {type: 'string', size: 255},    // 用户的默认头像
    site                    : {model: 'site'}
  }
};