'use strict';

describe('Service: proType', function () {

  // load the service's module
  beforeEach(module('adminApp'));

  // instantiate service
  var proType;
  beforeEach(inject(function (_proType_) {
    proType = _proType_;
  }));

  it('should do something', function () {
    expect(!!proType).toBe(true);
  });

});
