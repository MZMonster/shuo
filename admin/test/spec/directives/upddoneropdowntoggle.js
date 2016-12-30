'use strict';

describe('Directive: upDDoneropdownToggle', function () {

  // load the directive's module
  beforeEach(module('adminApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<up-d-doneropdown-toggle></up-d-doneropdown-toggle>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the upDDoneropdownToggle directive');
  }));
});
