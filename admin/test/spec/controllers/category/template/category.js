'use strict';

describe('Controller: CategoryTemplateCategoryCtrl', function () {

  // load the controller's module
  beforeEach(module('adminApp'));

  var CategoryTemplateCategoryCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CategoryTemplateCategoryCtrl = $controller('CategoryTemplateCategoryCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
