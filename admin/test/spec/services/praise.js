'use strict';

describe('Service: praise', function () {

  // load the service's module
  beforeEach(module('adminApp'));

  // instantiate service
  var praise;
  beforeEach(inject(function (_praise_) {
    praise = _praise_;
  }));

  it('should do something', function () {
    expect(!!praise).toBe(true);
  });

});
