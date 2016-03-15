'use strict';

routes.$inject = ['$stateProvider'];
import defineHeader from '../root/header/define-header';

export default function routes($stateProvider) {
  $stateProvider
    .state('result', {
      url: 'result/{childId:string}/:answerId',
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