'use strict';

var angular = require('angular');

routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
  $stateProvider
    .state('children', {
      url: 'children',
      template: require('./child_selection.html'),
      controller: 'ChildSelectionController',
      controllerAs: 'childSelection',
      data: {
        title: 'Select Child'
      },
      parent: 'root'
    })
    .state('children.add', {
      url: '/add',
      onEnter: ['$mdDialog', '$timeout', '$state', function ($mdDialog, $timeout, $state) {
        $timeout(() => {
          $mdDialog.show({
            controller: 'AddChildController',
            controllerAs: 'addChild',
            template: require('./add/add_child.html'),
            parent: document.body,
            clickOutsideToClose: true
          }).finally(() => {
            $state.go('children');
          });
        }, 0);
      }]
    });
}