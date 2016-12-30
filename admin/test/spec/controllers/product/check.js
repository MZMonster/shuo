'use strict';

describe('Controller: ProductCheckCtrl', function () {

  // load the controller's module
  beforeEach(module('adminApp'));

  var ProductCheckCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProductCheckCtrl = $controller('ProductCheckCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
