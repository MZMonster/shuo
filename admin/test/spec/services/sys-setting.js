'use strict';

describe('Service: sysSetting', function () {

  // load the service's module
  beforeEach(module('adminApp'));

  // instantiate service
  var sysSetting;
  beforeEach(inject(function (_sysSetting_) {
    sysSetting = _sysSetting_;
  }));

  it('should do something', function () {
    expect(!!sysSetting).toBe(true);
  });

});
