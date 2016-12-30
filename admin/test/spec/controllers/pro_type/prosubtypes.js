'use strict';

describe('Controller: ProTypeProsubtypesCtrl', function () {

  // load the controller's module
  beforeEach(module('adminApp'));

  var ProTypeProsubtypesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProTypeProsubtypesCtrl = $controller('ProTypeProsubtypesCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
