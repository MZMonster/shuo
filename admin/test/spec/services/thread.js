'use strict';

describe('Service: thread', function () {

  // load the service's module
  beforeEach(module('adminApp'));

  // instantiate service
  var thread;
  beforeEach(inject(function (_thread_) {
    thread = _thread_;
  }));

  it('should do something', function () {
    expect(!!thread).toBe(true);
  });

});
