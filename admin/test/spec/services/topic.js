'use strict';

describe('Service: topic', function () {

  // load the service's module
  beforeEach(module('adminApp'));

  // instantiate service
  var topic;
  beforeEach(inject(function (_topic_) {
    topic = _topic_;
  }));

  it('should do something', function () {
    expect(!!topic).toBe(true);
  });

});
