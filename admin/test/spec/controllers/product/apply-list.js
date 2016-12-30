'use strict';

describe('Controller: ProductApplyListCtrl', function () {

  // load the controller's module
  beforeEach(module('adminApp'));

  var ProductApplyListCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProductApplyListCtrl = $controller('ProductApplyListCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
