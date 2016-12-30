'use strict';

describe('Filter: proStatus', function () {

  // load the filter's module
  beforeEach(module('adminApp'));

  // initialize a new instance of the filter before each test
  var proStatus;
  beforeEach(inject(function ($filter) {
    proStatus = $filter('proStatus');
  }));

  it('should return the input prefixed with "proStatus filter:"', function () {
    var text = 'angularjs';
    expect(proStatus(text)).toBe('proStatus filter: ' + text);
  });

});
