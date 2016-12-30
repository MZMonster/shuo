'use strict';

describe('Filter: trustHtml', function () {

  // load the filter's module
  beforeEach(module('adminApp'));

  // initialize a new instance of the filter before each test
  var trustHtml;
  beforeEach(inject(function ($filter) {
    trustHtml = $filter('trustHtml');
  }));

  it('should return the input prefixed with "trustHtml filter:"', function () {
    var text = 'angularjs';
    expect(trustHtml(text)).toBe('trustHtml filter: ' + text);
  });

});
