'use strict';

describe('Service: AuthenticationService', function () {

  // load the service's module
  beforeEach(module('adminApp'));

  // instantiate service
  var AuthenticationService;
  beforeEach(inject(function (_AuthenticationService_) {
    AuthenticationService = _AuthenticationService_;
  }));

  it('should do something', function () {
    expect(!!AuthenticationService).toBe(true);
  });

});
