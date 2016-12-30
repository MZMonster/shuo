'use strict';

describe('Controller: TopicTopicsCtrl', function () {

  // load the controller's module
  beforeEach(module('adminApp'));

  var TopicTopicsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TopicTopicsCtrl = $controller('TopicTopicsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
