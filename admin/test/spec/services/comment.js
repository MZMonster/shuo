'use strict';

describe('Service: comment', function () {

  // load the service's module
  beforeEach(module('adminApp'));

  // instantiate service
  var comment;
  beforeEach(inject(function (_comment_) {
    comment = _comment_;
  }));

  it('should do something', function () {
    expect(!!comment).toBe(true);
  });

});
