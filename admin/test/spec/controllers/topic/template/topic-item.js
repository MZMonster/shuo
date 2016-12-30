'use strict';

describe('Controller: TopicTemplateTopicItemCtrl', function () {

  // load the controller's module
  beforeEach(module('adminApp'));

  var TopicTemplateTopicItemCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TopicTemplateTopicItemCtrl = $controller('TopicTemplateTopicItemCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
