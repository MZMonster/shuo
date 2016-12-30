'use strict';

describe('Controller: UserUsersCtrl', function () {

  // load the controller's module
  beforeEach(module('adminApp'));

  var UserUsersCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UserUsersCtrl = $controller('UserUsersCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
