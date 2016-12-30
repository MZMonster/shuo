'use strict';

describe('Controller: PushLogTemplateSecurityCodeCtrl', function () {

  // load the controller's module
  beforeEach(module('adminApp'));

  var PushLogTemplateSecurityCodeCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PushLogTemplateSecurityCodeCtrl = $controller('PushLogTemplateSecurityCodeCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
