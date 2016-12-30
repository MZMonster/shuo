'use strict';

describe('Controller: AdministratorAdministratorsCtrl', function () {

  // load the controller's module
  beforeEach(module('adminApp'));

  var AdministratorAdministratorsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AdministratorAdministratorsCtrl = $controller('AdministratorAdministratorsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AdministratorAdministratorsCtrl.awesomeThings.length).toBe(3);
  });
});
