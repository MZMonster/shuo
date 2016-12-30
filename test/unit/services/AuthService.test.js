/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author JerryC
 * @date  15/11/30
 * @description
 *
 */

var should = require('should');
var rewire = require('rewire');
var Chance = require('chance');
var chance = new Chance;

describe('AuthService', function () {
  var _encodeShuoSession;
  var _encodeShuoInfo;
  var _decodeShuoSession;
  var _decodeShuoInfo;
  var appkey;
  var site;

  before(function () {
    var AuthServicePrivate  = rewire('../../../api/services/AuthService.js');
    _encodeShuoSession      = AuthServicePrivate.__get__('_encodeShuoSession');
    _encodeShuoInfo         = AuthServicePrivate.__get__('_encodeShuoInfo');
    _decodeShuoSession      = AuthServicePrivate.__get__('_decodeShuoSession');
    _decodeShuoInfo         = AuthServicePrivate.__get__('_decodeShuoInfo');
    return Site.create({
      sitename: chance.name(),
      url     : chance.url()
    }).then((_site) => {
      site = _site;
      appkey = _site.appkey;
    });
  });

  after(() => {
    return Site.destroy(site.id);
  });

  describe('#_encodeShuoSessionData & _decodeShuoSession', function () {
    var shuoSession;
    var shuoSessionData = {
      uuid: chance.guid()
    };
    before(function () {
      shuoSession = _encodeShuoSession(shuoSessionData, appkey);
      should(shuoSession).be.ok();
    });

    it('should decode shuoSession', function () {
      should(_decodeShuoSession(shuoSession)).be.have.properties(shuoSessionData);
    });
  });

  describe('#_encodeShuoInfoData & _decodeShuoInfo', function () {
    var shuoInfo;
    var shuoInfoData = {
      uuid: chance.guid(),
      username: chance.name(),
      avatar: chance.url()
    };
    before(function () {
      shuoInfo = _encodeShuoInfo(shuoInfoData, appkey);
      should(shuoInfo).be.ok();
    });

    it('should decode shuoSession', function () {
      return _decodeShuoInfo(shuoInfo, appkey).then(function (shuoInfo) {
        should(shuoInfo).be.have.properties(shuoInfoData);
      });
    });
  });
  
  describe('#verifySign', function () {
    var shuoSession;

    before(function () {
      var shuoSessionData = {uuid: chance.guid()};
      shuoSession = _decodeShuoSession(_encodeShuoSession(shuoSessionData, appkey));
    });

    it('should return true', function () {
      var isMatched = AuthService.verifySign(shuoSession, appkey);
      isMatched.should.be.true();
    });

    it('should return false', function () {
      var isMatched = AuthService.verifySign({uuid: chance.guid()}, appkey);
      isMatched.should.be.false();
    });
  });

  describe('#decode & #encode', function () {
    var shuoSession;
    var shuoInfo;
    var shuoSessionData = {uuid: chance.guid()};
    var shuoInfoData    = {uuid: chance.guid(), username: chance.name(), avatar: chance.url()};

    before(function () {
      var decoded = AuthService.encode(shuoSessionData, shuoInfoData, appkey);
      decoded.should.have.properties('shuoSession', 'shuoInfo');
      shuoSession = decoded.shuoSession;
      shuoInfo    = decoded.shuoInfo;
    });

    it('should return decoded shuoInfo and shuoSession', function () {
      return AuthService.decode(shuoSession, shuoInfo, appkey).then(function (decoded) {
        decoded.should.have.properties('shuoInfoData', 'shuoSessionData');
        decoded.shuoInfoData.should.have.properties(shuoInfoData);
        decoded.shuoSessionData.should.have.properties(shuoSessionData);
      });
    });
  });
});