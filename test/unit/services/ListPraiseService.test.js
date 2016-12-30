
var chance = require('chance').Chance();
var Promise = require('bluebird');

describe('ListPraiseService', () => {
  let site = 1;
  let users;
  let comment;
  let thread;
  before(() => {
    return Thread.create({
      site,
      sourceID: chance.guid(),
      title: chance.sentence()
    }).then(_thread => {
      thread = _thread;

      return User.create([
        {
          remoteID: chance.guid(),
          username: chance.name(),
          avatar: chance.url(),
          site
        },
        {
          remoteID: chance.guid(),
          username: chance.name(),
          avatar: chance.url(),
          site
        },
        {
          remoteID: chance.guid(),
          username: chance.name(),
          avatar: chance.url(),
          site
        },
      ]);
    }).then(_users => {
      users = _users;
      return Comment.create({
        site: site,
        threadID: thread.uuid,
        user: users[0],
        content: chance.sentence()
      });
    }).then(function(_comment) {
      comment = _comment;
    });
  });

  describe('star', () => {
    it('star a comment', () => {
      return ListPraiseService.star(site, users[0].id, comment, thread).then(result => {
        result.star.should.eql(1);
        return ListPraiseService.star(site, users[1].id, comment, thread);
      }).then(result => {
        result.star.should.eql(2);
        return ListPraiseService.star(site, users[2].id, comment, thread);
      }).then(result => {
        result.star.should.eql(3);
      });
    });
  });

  describe('#getStarredUsers', () => {
    it('should return a list of users', () => {
      return ListPraiseService.getStarredUsers(site, comment.uuid).then(list => {
        list.length.should.eql(3);
      });
    });
  });
});
