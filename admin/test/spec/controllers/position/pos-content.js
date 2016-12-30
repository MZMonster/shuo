'use strict';

describe('Controller: PositionPosContentCtrl', function () {

  // load the controller's module
  beforeEach(module('adminApp'));

  var PositionPosContentCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PositionPosContentCtrl = $controller('PositionPosContentCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
