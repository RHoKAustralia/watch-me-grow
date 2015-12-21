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
          template: require('./home.html'),
          controller: 'HomeController',
          controllerAs: 'home'
        },
        'header@root': defineHeader('HomeController')
      }
    });
}