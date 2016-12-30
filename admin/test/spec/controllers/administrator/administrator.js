'use strict';

describe('Controller: AdministratorAdministratorCtrl', function () {

  // load the controller's module
  beforeEach(module('adminApp'));

  var AdministratorAdministratorCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AdministratorAdministratorCtrl = $controller('AdministratorAdministratorCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AdministratorAdministratorCtrl.awesomeThings.length).toBe(3);
  });
});
