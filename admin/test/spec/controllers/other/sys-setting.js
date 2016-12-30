'use strict';

describe('Controller: OtherSysSettingCtrl', function () {

  // load the controller's module
  beforeEach(module('adminApp'));

  var OtherSysSettingCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OtherSysSettingCtrl = $controller('OtherSysSettingCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
