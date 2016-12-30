'use strict';

describe('Controller: CompanyCtrl', function () {

  // load the controller's module
  beforeEach(module('adminApp'));

  var CompanyCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CompanyCtrl = $controller('CompanyCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
