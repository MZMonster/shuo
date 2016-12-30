'use strict';

describe('Controller: ProductIssueCtrl', function () {

  // load the controller's module
  beforeEach(module('adminApp'));

  var ProductIssueCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProductIssueCtrl = $controller('ProductIssueCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
