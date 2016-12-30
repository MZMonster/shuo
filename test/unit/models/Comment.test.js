/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author wuyanxin
 * @date  15/12/11
 * @description
 *
 */

var chance = require('chance').Chance();

describe('Comment', function () {
  var thread, comment;

  before(function () {
    return Thread.create({
      sourceID: chance.guid(),
      site: 1,
      url: chance.url({domain: 'wan.meizu.com'}),
      title: chance.sentence({words: 5}),
      category: 'product'
    }).then(function (_thread) {
      thread = _thread;
    });
  });

  describe('#increaseCount', function () {
    it('should auto increase count after create comment', function () {
      return Comment.create({
        threadID: thread.uuid,
        content: chance.sentence({words: 5}),
        user: 1
      }).then(function(_comment) {
        comment = _comment;
        return Thread.findOne(thread.id);
      }).then(function(_thread) {
        _thread.cmtCount.should.eql(1);
        _thread.partsCount.should.eql(1);
      });
    });

    it('should auto increase count after create comment', function () {
      return Comment.create({
        threadID: thread.uuid,
        content: chance.sentence({words: 5}),
        user: 1,
        parentID: comment.uuid
      }).then(function() {
        return Promise.all([
          Thread.findOne(thread.id),
          Comment.findOne(comment.id)
        ]);
      }).then(function(result) {
        result[0].cmtCount.should.eql(1);
        result[0].partsCount.should.eql(2);
        result[1].replyCount.should.eql(1);

        return Comment.create({
          threadID: thread.uuid,
          content: chance.sentence({words: 5}),
          user: 1,
          parentID: comment.uuid
        });
      }).then(function() {
        return Promise.all([
          Thread.findOne(thread.id),
          Comment.findOne(comment.id)
        ]);
      }).then(function(result) {
        result[0].cmtCount.should.eql(1);
        result[0].partsCount.should.eql(3);
        result[1].replyCount.should.eql(2);
      });
    });

  });

});
