/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author JerryC
 * @date  15/12/7
 * @description
 *
 */

import shortid from 'shortid';
import uuid from 'uuid';
import Promise from 'bluebird';

module.exports = {

  schema    : true,
  identity  : 'Site',
  tableName : 'site',

  attributes: {

    sitename    : {type: 'string', size: 20, unique: true, required: true},
    url         : {type: 'string', size: 255, url: true},
    appid       : {type: 'string', size: 10, required: true, index: true, defaultsTo: shortid.generate},
    appkey      : {type: 'string', size: 36, required: true, defaultsTo: uuid.v4},
    siteConfig  : {model: 'SiteConfig'}

  },

  afterCreate: createSiteConfig,
  afterDestroy: destroySiteConfig
};

/**
 * 为Site创建SiteConfig
 * @param values
 * @param next
 */
function createSiteConfig(values, next) {
  if (!Array.isArray(values)) values = [values];
  Promise.map(values, function (value) {
    if(!value || !value.id) return null;
    return SiteConfig.create({site: value.id});
  }).finally(next);
}

/**
 * 为Site删除SiteConfig
 * @param values
 * @param next
 */
function destroySiteConfig(values, next) {
  if (!Array.isArray(values)) values = [values];
  Promise.map(values, function (value) {
    if(!value || !value.id) return null;
    return SiteConfig.destroy({site: value.id});
  }).finally(next);
}