'use strict';

describe('Service: queryString', function () {

  // load the service's module
  beforeEach(module('adminApp'));

  // instantiate service
  var queryString;
  beforeEach(inject(function (_queryString_) {
    queryString = _queryString_;
  }));

  it('should do something', function () {
    expect(!!queryString).toBe(true);
  });

});
