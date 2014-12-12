'use strict';

angular.module('mean.overlook').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('overlook example page', {
      url: '/overlook/example',
      templateUrl: 'overlook/views/index.html'
    });
  }
]);
