'use strict';

describe('Service: posContent', function () {

  // load the service's module
  beforeEach(module('adminApp'));

  // instantiate service
  var posContent;
  beforeEach(inject(function (_posContent_) {
    posContent = _posContent_;
  }));

  it('should do something', function () {
    expect(!!posContent).toBe(true);
  });

});
