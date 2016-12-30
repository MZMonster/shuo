'use strict';

describe('Service: PushLog', function () {

  // load the service's module
  beforeEach(module('adminApp'));

  // instantiate service
  var PushLog;
  beforeEach(inject(function (_PushLog_) {
    PushLog = _PushLog_;
  }));

  it('should do something', function () {
    expect(!!PushLog).toBe(true);
  });

});
