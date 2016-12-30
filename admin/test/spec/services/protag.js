'use strict';

describe('Service: protag', function () {

  // load the service's module
  beforeEach(module('adminApp'));

  // instantiate service
  var protag;
  beforeEach(inject(function (_protag_) {
    protag = _protag_;
  }));

  it('should do something', function () {
    expect(!!protag).toBe(true);
  });

});
