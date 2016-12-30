'use strict';

describe('Controller: TopicTopicCtrl', function () {

  // load the controller's module
  beforeEach(module('adminApp'));

  var TopicTopicCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TopicTopicCtrl = $controller('TopicTopicCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
