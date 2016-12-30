'use strict';

describe('Controller: DiscoverCheckCtrl', function () {

  // load the controller's module
  beforeEach(module('adminApp'));

  var DiscoverCheckCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DiscoverCheckCtrl = $controller('DiscoverCheckCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
