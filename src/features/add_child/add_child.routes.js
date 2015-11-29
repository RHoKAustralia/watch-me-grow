'use strict';

routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
  $stateProvider
    .state('add_child', {
      url: 'children/add',
      template: require('./add_child.html'),
      controller: 'AddChildController',
      controllerAs: 'addChild',
      parent: 'root',
      data: {
        title: 'Add Child'
      }
    });
}