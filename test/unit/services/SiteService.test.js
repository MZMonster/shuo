/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author JerryC
 * @date  15/12/12
 * @description
 *
 */

var should = require("should");
var chance = new require("chance")();

describe("SiteService", function () {
  describe("domainCheck", function () {
    let siteA, siteB;
    let domain = ['wan.meizu.com', ' wan.bigertech.com'];

    before(function () {
      // 准备站点A,B
      return Site.create([
        {sitename: chance.name(), url: chance.url()},
        {sitename: chance.name(), url: chance.url()}
      ]).then(function (sites) {
        [siteA, siteB] = sites;

        // 为站点增加白名单
        return SiteConfig.update({site: siteA.id}, {domain_whitelist: domain.toString()});
      });
    });

    it("should return false when domain not allow", function () {
      return SiteService.domainCheck(siteA.id, 'www.meizu.com').then(function (isOK) {
        should(isOK).be.false();
      });
    });

    it("should return true when site has'n config domain while list", function () {
      return SiteService.domainCheck(siteB.id, domain[0]).then(function (isOK) {
        should(isOK).be.true();
      });
    });

    it("should return true when domain allow", function () {
      return SiteService.domainCheck(siteA.id, domain[0]).then(function (isOK) {
        should(isOK).be.true();
      });
    });
  });
});