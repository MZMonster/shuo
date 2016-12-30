'use strict';

describe('Service: site', function () {

  // load the service's module
  beforeEach(module('adminApp'));

  // instantiate service
  var site;
  beforeEach(inject(function (_site_) {
    site = _site_;
  }));

  it('should do something', function () {
    expect(!!site).toBe(true);
  });

});
