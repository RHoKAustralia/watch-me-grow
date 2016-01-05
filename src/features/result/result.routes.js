'use strict';

routes.$inject = ['$stateProvider'];
import defineHeader from '../header/define-header';

export default function routes($stateProvider) {
  $stateProvider
    .state('result', {
      url: 'result/{childId:int}/:ageId',
      views: {
        '': {
          template: require('./result.html'),
          controller: 'ResultController',
          controllerAs: 'controller'
        },
        'header@root': defineHeader('ResultController')
      },
      parent: 'root',
      data: {
        title: 'Answers'
      }
    });
}