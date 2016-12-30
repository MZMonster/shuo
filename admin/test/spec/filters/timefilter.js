'use strict';

describe('Filter: timefilter', function () {

  // load the filter's module
  beforeEach(module('adminApp'));

  // initialize a new instance of the filter before each test
  var timefilter;
  beforeEach(inject(function ($filter) {
    timefilter = $filter('timefilter');
  }));

  it('should return the input prefixed with "timefilter filter:"', function () {
    var text = 'angularjs';
    expect(timefilter(text)).toBe('timefilter filter: ' + text);
  });

});
