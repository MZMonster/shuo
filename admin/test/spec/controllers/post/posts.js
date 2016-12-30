'use strict';

describe('Controller: PostPostsCtrl', function () {

  // load the controller's module
  beforeEach(module('adminApp'));

  var PostPostsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PostPostsCtrl = $controller('PostPostsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
