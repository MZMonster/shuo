'use strict';

describe('Controller: CategoryCategoriesCtrl', function () {

  // load the controller's module
  beforeEach(module('adminApp'));

  var CategoryCategoriesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CategoryCategoriesCtrl = $controller('CategoryCategoriesCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
