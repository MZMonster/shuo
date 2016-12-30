'use strict';

describe('Controller: CompanyCompaniesCtrl', function () {

  // load the controller's module
  beforeEach(module('adminApp'));

  var CompanyCompaniesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CompanyCompaniesCtrl = $controller('CompanyCompaniesCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
