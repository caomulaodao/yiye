'use strict';

angular.module('mean.overlook').controller('OverlookController', ['$scope', 'Global', 'Overlook',
  function($scope, Global, Overlook) {
    $scope.global = Global;
    $scope.package = {
      name: 'overlook'
    };
  }
]);
