'use strict';

describe('Service: UEditor', function () {

  // load the service's module
  beforeEach(module('adminApp'));

  // instantiate service
  var UEditor;
  beforeEach(inject(function (_UEditor_) {
    UEditor = _UEditor_;
  }));

  it('should do something', function () {
    expect(!!UEditor).toBe(true);
  });

});
