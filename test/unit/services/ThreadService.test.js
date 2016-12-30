/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author wuyanxin
 * @date  15/12/1
 * @description
 *
 */

var chance = require('chance').Chance();
var Promise = require('bluebird');
  
describe('ThreadService', function () {

  var siteID = 1;

  describe('#load', function () {
    var thread1 = {
      site: siteID,
      sourceID: chance.guid(),
      url: chance.url({domain: 'wan.meizu.com'}),
      title: chance.sentence({words: 5}),
      category: 'product'
    };

    it('should rejected with code: "40001", caused by null sourceID', function () {
      return ThreadService.load(null).should.rejectedWith({code: '40001'});
    });

    it('should rejected with code: "40001", caused by null title', function () {
      return ThreadService.load(siteID, thread1.sourceID).should.rejectedWith({code: '40001'});
    });

    it('should create one thread in db, then return', function () {
      return ThreadService.load(siteID, thread1.sourceID, thread1).then(function(result) {
        result.should.have.properties({cmtCount: 0, partsCount: 0});
        return Thread.findOne({sourceID: thread1.sourceID});
      }).then(function(_thread) {
        _thread.should.have.properties(thread1);
      });
    });
  });

  describe('#count', function () {
    var sourceIDs = [chance.guid(), chance.guid()];
    var threads, user = 1;

    before(function () {
      return Thread.create([{
        site: siteID,
        sourceID: sourceIDs[0],
        url: chance.url({domain: 'wan.meizu.com'}),
        title: chance.sentence({words: 5}),
        category: 'product'
      }, {
        site: siteID,
        sourceID: sourceIDs[1],
        url: chance.url({domain: 'wan.meizu.com'}),
        title: chance.sentence({words: 5}),
        category: 'product'
      }]).then(function(_threads) {
        threads = _threads;
        var _cmts1 = [];
        var _cmts2 = [];

        for (var i = 0; i < 20; i++) {
          _cmts1.push({
            site: siteID,
            threadID: threads[0].uuid,
            user: user,
            content: chance.sentence()
          });
          _cmts2.push({
            site: siteID,
            threadID: threads[1].uuid,
            user: user,
            content: chance.sentence()
          });
        }

        return Promise.mapSeries(_cmts1.concat(_cmts2), function (cmt) {
          return Comment.create(cmt);
        });
      }).then(function(_comments) {
        var _cmts1 = [];
        for (var i = 0; i < 10; i++) {
          _cmts1.push({
            site: siteID,
            threadID: threads[0].uuid,
            user: user,
            content: chance.sentence(),
            parentID: _comments[i].uuid
          });
        }
        return Promise.mapSeries(_cmts1, function (cmt) {
          return Comment.create(cmt);
        });
      });
    });

    it('should return thread\'s comment count', function () {
      return ThreadService.count(siteID, sourceIDs).then(function(result) {
        result.should.have.properties(sourceIDs);
        result[sourceIDs[0]].should.have.properties({
          sourceID: sourceIDs[0],
          cmtCount: 20,
          partsCount: 30
        });
        result[sourceIDs[1]].should.have.properties({
          sourceID: sourceIDs[1],
          cmtCount: 20,
          partsCount: 20
        });
      });
    });
  });

  describe("#info", function () {
    var thread1 = {
      site: siteID,
      sourceID: chance.guid(),
      url: chance.url({domain: 'wan.meizu.com'}),
      title: chance.sentence({words: 5}),
      category: 'product'
    };
    var user1 = {
      remoteID: chance.guid(),
      username: chance.name(),
      avatar: chance.avatar(),
      site: siteID
    };
    var comment1 = {site: siteID, content: 'test content'};
    var comment2 = {site: siteID, content: 'test content'};

    before(() => {
      return Promise.all([
        Thread.create(thread1),
        User.create(user1)
      ]).spread((thread, user) => {
        thread1.id = thread.id;
        comment1.threadID = thread.uuid;
        comment2.threadID = thread.uuid;
        comment1.user = comment2.user = user.id;
        return Comment.create([comment1, comment2])
      });
    });

    it('should rejected with code: "40001", caused by null sourceID', function () {
      return ThreadService.load(null).should.rejectedWith({code: '40001'});
    });

    it("should data of threads that catains comment, child comment and comment's user", function () {
      return ThreadService.info(siteID, thread1.sourceID).then((data) => {
        let threadInfo = data[0];
        threadInfo.should.have.properties(thread1);
        delete comment1.user;
        delete comment2.user;
        threadInfo.comments[0].should.have.properties(comment1);
        threadInfo.comments[1].should.have.properties(comment2);
      });
    });
  });

});
