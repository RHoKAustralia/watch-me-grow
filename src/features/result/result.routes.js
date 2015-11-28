'use strict';

routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
  $stateProvider
    .state('result', {
      url: '/result/:childId/:ageId',
      template: require('./result.html'),
      controller: 'ResultController',
      controllerAs: 'result'
    });
}