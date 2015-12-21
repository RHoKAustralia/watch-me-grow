'use strict';

import angular from 'angular';
import defineHeader from '../header/define-header';

routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
  $stateProvider
    .state('children', {
      url: 'children',
      parent: 'root',
      views: {
        '': {
          template: require('./child_selection.html'),
          controller: 'ChildSelectionController',
          controllerAs: 'childSelection'
        },
        'header@root': defineHeader('ChildSelectionController')
      }
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