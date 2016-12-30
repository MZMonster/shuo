'use strict';

describe('Controller: PoscontentsCtrl', function () {

  // load the controller's module
  beforeEach(module('adminApp'));

  var PoscontentsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PoscontentsCtrl = $controller('PoscontentsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
