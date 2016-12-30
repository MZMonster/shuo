'use strict';

describe('Controller: ProductApplicationCtrl', function () {

  // load the controller's module
  beforeEach(module('adminApp'));

  var ProductApplicationCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProductApplicationCtrl = $controller('ProductApplicationCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
