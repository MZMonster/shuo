'use strict';

describe('Service: proSubType', function () {

  // load the service's module
  beforeEach(module('adminApp'));

  // instantiate service
  var proSubType;
  beforeEach(inject(function (_proSubType_) {
    proSubType = _proSubType_;
  }));

  it('should do something', function () {
    expect(!!proSubType).toBe(true);
  });

});
