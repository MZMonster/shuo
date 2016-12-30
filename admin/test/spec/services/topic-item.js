'use strict';

describe('Service: topicItem', function () {

  // load the service's module
  beforeEach(module('adminApp'));

  // instantiate service
  var topicItem;
  beforeEach(inject(function (_topicItem_) {
    topicItem = _topicItem_;
  }));

  it('should do something', function () {
    expect(!!topicItem).toBe(true);
  });

});
