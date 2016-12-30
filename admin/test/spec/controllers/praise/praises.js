'use strict';

describe('Controller: PraisePraisesCtrl', function () {

  // load the controller's module
  beforeEach(module('adminApp'));

  var PraisePraisesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PraisePraisesCtrl = $controller('PraisePraisesCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
