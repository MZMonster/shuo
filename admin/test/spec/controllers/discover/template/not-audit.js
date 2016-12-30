'use strict';

describe('Controller: DiscoverTemplateNotAuditCtrl', function () {

  // load the controller's module
  beforeEach(module('adminApp'));

  var DiscoverTemplateNotAuditCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DiscoverTemplateNotAuditCtrl = $controller('DiscoverTemplateNotAuditCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
