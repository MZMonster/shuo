'use strict';

describe('Controller: PushLogPushlogCtrl', function () {

  // load the controller's module
  beforeEach(module('adminApp'));

  var PushLogPushlogCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PushLogPushlogCtrl = $controller('PushLogPushlogCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
