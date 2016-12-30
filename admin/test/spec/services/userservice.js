'use strict';

describe('Service: UserService', function () {

  // load the service's module
  beforeEach(module('adminApp'));

  // instantiate service
  var UserService;
  beforeEach(inject(function (_UserService_) {
    UserService = _UserService_;
  }));

  it('should do something', function () {
    expect(!!UserService).toBe(true);
  });

});
