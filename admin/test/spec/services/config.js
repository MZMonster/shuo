'use strict';

describe('Service: wanConfig', function () {

  // load the service's module
  beforeEach(module('adminApp'));

  // instantiate service
  var wanConfig;
  beforeEach(inject(function (_wanConfig_) {
    wanConfig = _wanConfig_;
  }));

  it('should do something', function () {
    expect(!!wanConfig).toBe(true);
  });

});
