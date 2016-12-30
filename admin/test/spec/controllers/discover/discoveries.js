'use strict';

describe('Controller: DiscoverDiscoveriesCtrl', function () {

  // load the controller's module
  beforeEach(module('adminApp'));

  var DiscoverDiscoveriesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DiscoverDiscoveriesCtrl = $controller('DiscoverDiscoveriesCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
