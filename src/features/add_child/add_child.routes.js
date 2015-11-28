'use strict';

routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
  $stateProvider
    .state('add_child', {
      url: '/add_child',
      template: require('./add_child.html'),
      controller: 'AddChildController',
      controllerAs: 'addChild'
    });
}