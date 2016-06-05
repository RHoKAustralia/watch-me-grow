'use strict';

import addHeader from '../root/header/define-header';

routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
  $stateProvider
    .state('enterDetails', {
      url: 'enter',
      parent: 'root',
      views: addHeader({
        '': {
          template: require('./enter-details.html'),
          controller: 'EnterDetailsController',
          controllerAs: 'controller'
        }
      }, 'EnterDetailsController')
    });
}