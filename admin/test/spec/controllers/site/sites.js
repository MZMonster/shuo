'use strict';

describe('Controller: SiteSitesCtrl', function () {

  // load the controller's module
  beforeEach(module('adminApp'));

  var SiteSitesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SiteSitesCtrl = $controller('SiteSitesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SiteSitesCtrl.awesomeThings.length).toBe(3);
  });
});
