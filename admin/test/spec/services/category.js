'use strict';

describe('Service: category', function () {

  // load the service's module
  beforeEach(module('adminApp'));

  // instantiate service
  var category;
  beforeEach(inject(function (_category_) {
    category = _category_;
  }));

  it('should do something', function () {
    expect(!!category).toBe(true);
  });

});
