'use strict';

describe('Controller: PositionsCtrl', function () {

  // load the controller's module
  beforeEach(module('adminApp'));

  var PositionsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PositionsCtrl = $controller('PositionsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
