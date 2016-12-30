'use strict';

describe('Controller: ThreadThreadsCtrl', function () {

  // load the controller's module
  beforeEach(module('adminApp'));

  var ThreadThreadsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ThreadThreadsCtrl = $controller('ThreadThreadsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ThreadThreadsCtrl.awesomeThings.length).toBe(3);
  });
});
