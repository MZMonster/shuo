'use strict';

describe('Service: util', function () {

  // load the service's module
  beforeEach(module('adminApp'));

  // instantiate service
  var util;
  beforeEach(inject(function (_util_) {
    util = _util_;
  }));

  it('should do something', function () {
    expect(!!util).toBe(true);
  });

});
