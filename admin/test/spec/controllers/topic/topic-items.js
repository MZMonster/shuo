'use strict';

describe('Controller: TopicTopicItemsCtrl', function () {

  // load the controller's module
  beforeEach(module('adminApp'));

  var TopicTopicItemsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TopicTopicItemsCtrl = $controller('TopicTopicItemsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
