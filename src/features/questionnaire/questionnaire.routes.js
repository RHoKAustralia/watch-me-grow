'use strict';

import defineHeader from '../root/header/define-header';

routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
  const views = defineHeader({
    '': {
      template: require('./questionnaire.html'),
      controller: 'QuestionnaireController',
      controllerAs: 'controller'
    }
  }, 'QuestionnaireController');

  $stateProvider
    .state('response', {
      url: 'child/{childId:string}/responses/add',
      parent: 'root',
      views
    })
    .state('response.edit', {
      url: 'child/{childId:string}/responses/{responseId:string}/edit',
      parent: 'root',
      views
    });
}