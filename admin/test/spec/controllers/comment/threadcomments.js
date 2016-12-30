'use strict';

describe('Controller: CommentThreadcommentsCtrl', function () {

  // load the controller's module
  beforeEach(module('adminApp'));

  var CommentThreadcommentsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CommentThreadcommentsCtrl = $controller('CommentThreadcommentsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CommentThreadcommentsCtrl.awesomeThings.length).toBe(3);
  });
});
