/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author JerryC
 * @date  15/12/12
 * @description
 *
 */

import _ from 'lodash';

/**
 * 从网站配置中检查域名白名单
 * @param siteID
 * @param hostname
 * @returns {*}
 */
function domainCheck(siteID, hostname) {
  return SiteConfig.findOne({site: siteID}).then((config) => {
    let {domain_whitelist} = config;
    if(!domain_whitelist) return true;
    let lists = _.map(domain_whitelist.split(','), (item) => item.trim());
    return lists.includes(hostname);
  });
}

module.exports = {
  domainCheck: domainCheck
};