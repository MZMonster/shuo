'use strict';

describe('Service: SiteConfig', function () {

  // load the service's module
  beforeEach(module('adminApp'));

  // instantiate service
  var SiteConfig;
  beforeEach(inject(function (_SiteConfig_) {
    SiteConfig = _SiteConfig_;
  }));

  it('should do something', function () {
    expect(!!SiteConfig).toBe(true);
  });

});
