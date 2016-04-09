'use strict';

routes.$inject = ['$stateProvider'];
import defineHeader from '../root/header/define-header';

export default function routes($stateProvider) {
  $stateProvider
    .state('result', {
      url: 'child/{childId:string}/responses/{responseId:string}',
      views: defineHeader({
        '': {
          template: require('./result.html'),
          controller: 'ResultController',
          controllerAs: 'controller'
        }
      }, 'ResultController'),
      parent: 'root'
    });
}