'use strict';

describe('Service: apply', function () {

  // load the service's module
  beforeEach(module('adminApp'));

  // instantiate service
  var apply;
  beforeEach(inject(function (_apply_) {
    apply = _apply_;
  }));

  it('should do something', function () {
    expect(!!apply).toBe(true);
  });

});
