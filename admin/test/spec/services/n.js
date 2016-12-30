'use strict';

describe('Service: N', function () {

  // load the service's module
  beforeEach(module('adminApp'));

  // instantiate service
  var N;
  beforeEach(inject(function (_N_) {
    N = _N_;
  }));

  it('should do something', function () {
    expect(!!N).toBe(true);
  });

});
