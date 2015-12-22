'use strict';

import defineHeader from '../header/define-header';

routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
  $stateProvider
    .state('dashboard', {
      url: 'dashboard/{childId:int}',
      parent: 'root',
      views: {
        '': {
          template: require('./dashboard.html'),
          controller: 'DashboardController',
          controllerAs: 'dashboard'
        },
        'header@root': defineHeader('DashboardController')
      }
    });
}