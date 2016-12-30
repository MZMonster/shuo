'use strict';

describe('Controller: PushLogPushLogsCtrl', function () {

  // load the controller's module
  beforeEach(module('adminApp'));

  var PushLogPushLogsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PushLogPushLogsCtrl = $controller('PushLogPushLogsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
