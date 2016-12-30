'use strict';

describe('Controller: CommentCommentsCtrl', function () {

  // load the controller's module
  beforeEach(module('adminApp'));

  var CommentCommentsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CommentCommentsCtrl = $controller('CommentCommentsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CommentCommentsCtrl.awesomeThings.length).toBe(3);
  });
});
