'use strict';

import defineHeader from '../root/header/define-header';

routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
  $stateProvider
    .state('postLogin', {
      url: 'postLogin',
      parent: 'root',
      views: defineHeader({
        '': {
          template: '<div></div>',
          controller: 'PostLoginController',
          controllerAs: 'controller'
        }
      }, 'PostLoginController')
    });
}