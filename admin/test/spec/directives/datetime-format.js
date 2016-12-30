'use strict';

describe('Directive: datetimeFormat', function () {

  // load the directive's module
  beforeEach(module('adminApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<datetime-format></datetime-format>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the datetimeFormat directive');
  }));
});
