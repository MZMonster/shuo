/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author JerryC
 * @date  15/12/1
 * @description
 *
 */

'use strict';

var should = require('should');
var Chance = require('chance');
var chance = new Chance();

describe('User', function () {
  describe('#createOrUpdateOne', function () {
    var userA = {
      uuid    : chance.guid(),
      username: chance.name(),
      avatar  : chance.url(),
      homepage: chance.url()
    };

    var userB = {
      uuid    : chance.guid(),
      username: chance.name(),
      avatar  : chance.url(),
      homepage: chance.url()
    };
    before(function () {
      return User.create(userA).then(function (_user) {
        userA = _user;
      });
    });

    it('should create user when not exit', function () {
      return User.updateOrCreateOne({uuid: userB.uuid}, userB).then(function (user) {
        user.should.have.properties(userB);
      });
    });

    it('should update user when existed', function () {
      userA.username = chance.name();
      return User.updateOrCreateOne({uuid: userA.uuid}, userA).then(function (user) {
        user.should.have.properties({
          username: userA.username,
          avatar: userA.avatar,
          homepage: userA.homepage
        });
      });
    });
  });

  describe("#useDefaultAvatar", function () {
    let siteA, siteB;
    let siteA_user_default_avatar;

    before(function () {
      // 准备站点A、B
      return Site.create([
        {sitename: chance.name(), url: chance.url()},
        {sitename: chance.name(), url: chance.url()}
      ]).then(function (sites) {
        [siteA, siteB] = sites;

        // 给站点A配置用户默认头像
        return SiteConfig.update({site: siteA.id}, {user_default_avatar: chance.url()});
      }).then(function (config) {
        siteA_user_default_avatar = config[0].user_default_avatar;
      });
    });

    after(function () {
      return Site.destroy([siteA.id, siteB.id]);
    });

    it("crate user who has avatar", function () {
      return User.create({
        remoteID: chance.guid(),
        username: chance.name(),
        avatar  : chance.url(),
        site    : siteA.id
      }).then(function (user) {
        should(user.avatar).not.equal(siteA_user_default_avatar);
      });
    });

    it("create user who has avatar but no site", function () {
      return User.create({
        remoteID: chance.guid(),
        username: chance.name(),
        avatar  : chance.url()
      }).then(function (user) {
        should(user.avatar).not.equal(siteA_user_default_avatar);
      });
    });

    it("create user who hasn't avatar", function () {
      return User.create({
        remoteID: chance.guid(),
        username: chance.name(),
        site    : siteA.id
      }).then(function (user) {
        should(user.avatar).be.equal(siteA_user_default_avatar);
      });
    });

    it("create user who hasn't avatar and site", function () {
      return User.create({
        remoteID: chance.guid(),
        username: chance.name()
      }).then(function (user) {
        should(user.avatar).be.undefined();
      });
    });

    it("create user who hasn't avatar and the site no default avatar", function () {
      return User.create({
        remoteID: chance.guid(),
        username: chance.name(),
        site    : siteB.id
      }).then(function (user) {
        should(user.avatar).be.undefined();
      });
    });
  });
});