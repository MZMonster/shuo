'use strict';

describe('Controller: ProductProductsCtrl', function () {

  // load the controller's module
  beforeEach(module('adminApp'));

  var ProductProductsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProductProductsCtrl = $controller('ProductProductsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
