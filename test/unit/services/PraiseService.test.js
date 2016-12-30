/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author wuyanxin
 * @date  15/12/31
 * @description
 *
 */

var chance = require('chance').Chance();
var Promise = require('bluebird');

describe('PraiseService', function () {

  var site = 1, user = 1;
  var comment;

  before(function () {
    return Thread.create({
      site,
      sourceID: chance.guid(),
      title: chance.sentence()
    }).then(thread => {
      return Comment.create({
        site: site,
        threadID: thread.uuid,
        user: user,
        content: chance.sentence()
      });
    }).then(function(_comment) {
      comment = _comment;
    });
  });

  describe('praise', function () {

    it('should increase star field in Comment', function () {
      comment.star.should.eql(0);

      return PraiseService.praise(site, user, 'comment', comment.uuid).then(function(result) {
        result[0].should.have.properties({
          uuid: comment.uuid,
          star: 1
        });
        return Comment.findOne(comment.id).then(function(_comment) {
          _comment.star.should.eql(1);
        });
      });

    });

    it('should decrease star field in Comment', function () {
      return PraiseService.praise(site, user, 'comment', comment.uuid).then(function(result) {
        result[0].should.have.properties({
          uuid: comment.uuid,
          star: 0
        });
        return Comment.findOne(comment.id).then(function(_comment) {
          _comment.star.should.eql(0);
        });
      });

    });

    it('should increase hate field in Comment', function () {
      comment.hate.should.eql(0);

      return PraiseService.praise(site, user, 'comment', comment.uuid, 'hate').then(function(result) {
        result[0].should.have.properties({
          uuid: comment.uuid,
          hate: 1
        });
        return Comment.findOne(comment.id).then(function(_comment) {
          _comment.hate.should.eql(1);
        });
      });

    });

    it('should decrease hate field in Comment', function () {

      return PraiseService.praise(site, user, 'comment', comment.uuid, 'hate').then(function(result) {
        result[0].should.have.properties({
          uuid: comment.uuid,
          hate: 0
        });
        return Comment.findOne(comment.id).then(function(_comment) {
          _comment.hate.should.eql(0);
        });
      });

    });

    it('should run complete correct when star 30 times', function () {
      var task = [];
      var times = 30;
      for(var _user = 0; _user < times; _user++) {
        task.push(PraiseService.praise(site, _user, 'comment', comment.uuid));
      }

      return Promise.all(task).then(function() {
        return Comment.findOne(comment.id).then(function(_comment) {
          _comment.star.should.eql(times);
        });
      });
    });

    it('should run complete correct when cancel star 30 times', function () {
      var task = [];
      var times = 30;
      for(var _user = 0; _user < times; _user++) {
        task.push(PraiseService.praise(site, _user, 'comment', comment.uuid));
      }

      return Promise.all(task).then(function() {
        return Comment.findOne(comment.id).then(function(_comment) {
          _comment.star.should.eql(0);
        });
      });
    });

  });
});

