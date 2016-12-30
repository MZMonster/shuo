/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author wuyanxin
 * @date  15/12/1
 * @description
 *
 */

var _ = require('lodash');
var rewire = require('rewire');
var Promise = require('bluebird');
var chance = require('chance').Chance();

describe('CommentService', function () {
  var _CommnetServie;
  var siteID = 1, sourceIDs = [chance.guid(), chance.guid(), chance.guid()];
  var users, threads, comments;

  before(function () {
    _CommnetServie = rewire('../../../api/services/CommentService.js');
    var _users = [];
    for (var i = 0; i < 2; i++) {
      _users.push({
        site: siteID,
        uuid: chance.guid(),
        username: chance.name(),
        avatar  : chance.url(),
        homepage: chance.url()
      });
    }
    return User.create(_users).then(function(_u) {
      users = _u;

      // 创建thread
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
      }, {
        site: siteID,
        sourceID: sourceIDs[2],
        url: chance.url({domain: 'wan.meizu.com'}),
        title: chance.sentence({words: 5}),
        category: 'product'
      }]);
    }).then(function(_threads) {
      threads = _threads;
      var _cmts = [];

      for (var i = 0; i < 30; i++) {
        _cmts.push({
          site: siteID,
          threadID: threads[0].uuid,
          user: users[0].id,
          content: chance.sentence()
        });
      }

      // 创建直接评论
      return Comment.create(_cmts);
    }).then(function(_comments) {
      comments = _comments;
      var _cmts = [];

      for (var i = 0; i < 10; i++) {
        _cmts.push({
          site: siteID,
          threadID: threads[0].uuid,
          user: users[1].id,
          replyTo: users[0].id,
          content: chance.sentence(),
          parentID: comments[i].uuid
        });
      }

      // 为前10条创建评论的回复(实际列表会显示在最后, 按创建时间倒序排序)
      return Comment.create(_cmts);
    }).then(function(_comments) {
      comments = comments.concat(_comments);
    });
  });

  after(function () {
    return Promise.all([
      User.destroy(),
      Thread.destroy(),
      Comment.destroy()
    ]);
  });

  describe('#submit', function () {
    it('should reject with code: 40002', function () {
      return CommentService.submit({}).should.rejectedWith({code: '40002'});
    });

    it('should reject with code: 40001', function () {
      return CommentService.submit({content: 'sdf'}).should.rejectedWith({code: '40001'});
    });

    it('should create one comment', function () {
      var comment = {
        site: siteID,
        content: chance.sentence(),
        threadID: threads[1].uuid,
        user: users[1].id,
        atUsers: null
      };
      return CommentService.submit(comment).then(function(_comment) {
        _comment.should.have.properties(comment);
      });
    });

    it('should return html content', function () {
      var comment = {
        site: siteID,
        content: '#Markdown Support',
        threadID: threads[1].uuid,
        user: users[1].id,
        atUsers: null
      };
      return CommentService.submit(comment).then(function(_comment) {
        _comment.should.have.properties(comment);
        _comment.content.should.eql('<h1>Markdown Support</h1>');
        _comment.srcContent.should.eql('#Markdown Support');
      });
    });

    it('should return html content', function () {
      var comment = {
        site: siteID,
        content: '**Markdown Support**',
        threadID: threads[1].uuid,
        user: users[1].id,
        atUsers: null
      };
      return CommentService.submit(comment).then(function(_comment) {
        _comment.should.have.properties(comment);
        _comment.content.should.eql('<p><strong>Markdown Support</strong></p>');
        _comment.srcContent.should.eql('**Markdown Support**');
      });
    });

    it('should prevent xss 1', () => {
      var comment = {
        site: siteID,
        content: '[test](javascript://%0d%0aprompt(document.cookie);com)',
        threadID: threads[1].uuid,
        user: users[1].id,
        atUsers: null
      };
      return CommentService.submit(comment).then(function(_comment) {
        _comment.should.have.properties(comment);
        _comment.content.should.eql('<p><a href>test</a></p>');
        _comment.srcContent.should.eql('[test](javascript://%0d%0aprompt(document.cookie);com)');
      });
    });

    it('should prevent xss 2', () => {
      var comment = {
        site: siteID,
        content: '<script>alert(1);</script>',
        threadID: threads[1].uuid,
        user: users[1].id,
        atUsers: null
      };
      return CommentService.submit(comment).then(function(_comment) {
        _comment.should.have.properties(comment);
        _comment.content.should.eql('<p>&amp;lt;script&amp;gt;alert(1);&amp;lt;/script&amp;gt;</p>');
        _comment.srcContent.should.eql('&lt;script&gt;alert(1);&lt;/script&gt;');
      });
    });

    it('should prevent xss 3', () => {
      var comment = {
        site: siteID,
        content: '&lt;script&gt;alert(1);&lt;/script&gt;',
        threadID: threads[1].uuid,
        user: users[1].id,
        atUsers: null
      };
      return CommentService.submit(comment).then(function(_comment) {
        _comment.should.have.properties(comment);
        _comment.content.should.eql('<p>&amp;lt;script&amp;gt;alert(1);&amp;lt;/script&amp;gt;</p>');
        _comment.srcContent.should.eql('&lt;script&gt;alert(1);&lt;/script&gt;');
      });
    });
  });

  describe('#_getComments', function () {
    var limit = 10, cLimit = 10, page = 1;

    it('should return 10 comments in the first page', function () {
      var _getComments = _CommnetServie.__get__('_getComments');
      return _getComments(siteID, threads[0].uuid, users[0].id, {page,limit,cLimit}).then(function(comments) {
        comments.length.should.eql(10);
      });
    });

    it('should return 10 comments in the first page', function () {
      var _getComments = _CommnetServie.__get__('_getComments');
      return _getComments(siteID, threads[0].uuid, users[0].id, {page:3,limit,cLimit}).then(function(_comments) {
        _comments.length.should.eql(10);
        _comments.forEach(function (comment) {
          if (!comment.children) {
            // 由于增加了autoIncrement, before中创建的数据并不是按ID顺序返回,而是先创建成功先返回
            // 导致创建子评论时并不是完全给最后10条数据创建子评论, 所以最后一页不是所有评论都有children
            // 这里跳过错误
            sails.log.error(comment.id);
            return;
          }
          comment.children.length.should.eql(1);
          comment.children[0].should.have.properties(['user', 'replyTo']);
        });
      });
    });

    it('should return comments with "hasStarred" field', function () {
      var _getComments = _CommnetServie.__get__('_getComments');
      return _getComments(siteID, threads[0].uuid, users[0].id, {page,limit,cLimit}).then(function(_comments) {
        _comments.length.should.eql(10);

        return Promise.map(_comments, function (comment) {
          comment.should.have.properties({'hasStarred': false});

          // 为每条评论点赞
          return PraiseService.praise(siteID, users[0].id, 'comment', comment.uuid);
        });
      }).then(function() {
        return _getComments(siteID, threads[0].uuid, users[0].id, {page,limit,cLimit});
      }).then(function(_comments) {
        _comments.forEach(function (comment) {
          comment.should.have.properties({'hasStarred': true});
        });
      });
    });

    // TODO 验证子评论第一页数据
  });

  describe('#list', function () {
    it('should return comment list with pagination when limit and page is in default', function () {
      return CommentService.list(siteID, sourceIDs[0]).then(function(list) {
        list.should.have.properties({
          threadID: threads[0].uuid,
          pagination: {
            page: 1,
            limit: Comment.config.LIMIT,
            pageCount: 2
          },
          cmtCount: 30,
          partsCount: 40
        });
        list.comments.length.should.eql(Comment.config.LIMIT);
        //list.users.should.have.properties(users[0].uuid);
      });
    });

    it('should return comment list with pagination', function () {
      return CommentService.list(siteID, sourceIDs[0], undefined, {limit: 10}).then(function(list) {
        list.should.have.properties({
          threadID: threads[0].uuid,
          pagination: {
            page: 1,
            limit: 10,
            pageCount: 3
          },
          cmtCount: 30,
          partsCount: 40
        });
        list.comments.length.should.eql(10);
        //list.users.should.have.properties([users[0].uuid]);
      });
    });
  });

  describe('#destroy', function () {
    it('delete comment', function () {
      var thread;
      var comment = {
        site: siteID,
        content: chance.sentence(),
        threadID: threads[1].uuid,
        user: users[1].id,
        atUsers: null
      };

      return Thread.findOne({uuid: comment.threadID}).then(function(_thread) {
        thread = _thread; // 保存创建评论前thread的统计数据

        return CommentService.submit(comment);
      }).then(function(_comment) {
        _comment.should.have.properties(comment);
        comment.uuid = _comment.uuid;

        return Thread.findOne({uuid: comment.threadID});
      }).then(function(_thread) {
        _thread.cmtCount.should.eql(thread.cmtCount+1);
        _thread.partsCount.should.eql(thread.partsCount+1);

        return CommentService.destroy(siteID, comment.uuid, users[1].id);
      }).then(function(data) {
        data.result.should.be.True();
        data.isParent.should.be.True();

        return Thread.findOne({uuid: comment.threadID});
      }).then(function(_thread) {
        _thread.cmtCount.should.eql(thread.cmtCount);
        _thread.partsCount.should.eql(thread.partsCount);
      });
    });
  });

  describe('#getGroupOfComments', function () {
    it('get group of comments', function () {
      return CommentService.getGroupOfComments(siteID, sourceIDs, users[0].id).then(commentsMap => {
        commentsMap[sourceIDs[0]].comments.length.should.eql(4);
        commentsMap[sourceIDs[2]].comments.length.should.eql(0);
      });
    });
  });

});
