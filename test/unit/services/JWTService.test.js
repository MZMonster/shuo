/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author JerryC
 * @date  15/11/30
 * @description
 *
 */


var should = require('should');

describe('JWTService', function () {
  describe('#decode and #encode', function () {
    var matchData  = {
      username: 'jerryc',
      timestamp: 1448864732592
    };
    var matchToken;
    var site;

    before(function () {
      return Site.create({
        sitename: 'unittest',
        url     : 'http://unittest.test.com'
      }).then((_site) => {
        site = _site;
        var token = JWTService.encode('shuoInfo', matchData, site.appkey);
        should(token).be.ok();
        matchToken = token;
      });
    });

    after(() => {
      return Site.destroy(site.id);
    });

    it('should match the token', function () {
      return JWTService.decode('shuoInfo', matchToken, site.appkey).then(function (data) {
        data.should.have.properties(matchData);
      });
    });
  });
});